"use client";
import "react-quill/dist/quill.snow.css";
import Editor from "@/components/Editor";
import React, { useCallback, useRef, useState } from "react";
import { Image as Image2, InputNumber, Mentions, Modal, message } from "antd";
import debounce from "lodash/debounce";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Upload } from "antd";
import { sendRequest, sendRequestFile } from "@/utils/api";
import type { FormProps, GetProp, UploadProps } from "antd";
import { signIn, useSession } from "next-auth/react";
import * as nsfwjs from "nsfwjs";
import { useRouter } from "next/navigation";

// export enum ProductType {
//   New = "New",
//   LikeNew = "LikeNew",
//   Good = "Good",
//   Fine = "Fine",
// }

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export default function CreatePost() {
  const [description, setDescription] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [users, setUsers] = useState([]);
  // const ref = useRef<string>();

  // const loadGithubUsers = async (key: string) => {
  //   if (!key) {
  //     setUsers([]);
  //     return;
  //   }

  //   let date = new Date();

  //   const res = (await sendRequest({
  //     url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/hashtag/top`,
  //     method: "GET",
  //     queryParams: {
  //       current: 1,
  //       pageSize: 5,
  //       from: date.setDate(date.getDate() - 7),
  //       name: `/${key}/`,
  //     },
  //     nextOption: {
  //       cache: "no-store",
  //     },
  //   })) as any;
  //   if (res && res.data) {
  //     if (ref.current !== key) return;
  //     setLoading(false);
  //     setUsers(res.data.result);
  //   }

  // fetch(`https://api.github.com/search/users?q=${key}`)
  //   .then((res) => res.json())
  //   .then(({ items = [] }) => {
  //     if (ref.current !== key) return;

  //     setLoading(false);
  //     setUsers(items.slice(0, 10));
  //     console.log(users);
  //   });
  // };

  // const debounceLoadGithubUsers = useCallback(
  //   debounce(loadGithubUsers, 500),
  //   []
  // );

  // const onSearch = (search: string) => {
  //   console.log("Search:", search);
  //   ref.current = search;
  //   setLoading(!!search);
  //   setUsers([]);

  //   debounceLoadGithubUsers(search);
  // };

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleChange: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setUploading(false);
        setImageUrl(url);
      });
    }
  };

  const [file, setFile] = React.useState([]);
  const { data: session } = useSession();

  const handleUploadFiles = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("filesUpload", file);
    try {
      const res = (await sendRequestFile({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
        method: "POST",
        body: formData,
        nextOption: {
          cache: "no-store",
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })) as any;
      setFile(res.data.fileNames);
      onSuccess("ok");
    } catch (error) {
      //@ts-ignore
      message.error("Đã có lỗi khi upload file");
      onError();
    }
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handlePreview = async (file: any) => {
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
    });
  };

  const beforeUpload = async (file: FileType) => {
    let isSafe;
    // const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    // if (!isJpgOrPng) {
    //   message.error("You can only upload JPG/PNG file!");
    //   return Promise.reject("Invalid file type");
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return Promise.reject("Image size exceeds the limit");
    }
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = async (e: any) => {
        let img = new Image();
        img.src = e.target.result;

        img.onload = async function () {
          const model = await nsfwjs.load();
          const predictions = await model.classify(img);
          isSafe = predictions.every((pred) => {
            if (pred.className === "Porn" && pred.probability > 0.2)
              return false;
            if (pred.className === "Hentai" && pred.probability > 0.2)
              return false;
            if (pred.className === "Sexy" && pred.probability > 0.2)
              return false;
            return true;
          });
          if (!isSafe) {
            message.error("Hình ảnh không phù hợp!");
            reject("Image is not safe");
          } else {
            resolve(isSafe); // Resolve with isSafe value
          }
        };
      };

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = () => {
    setFile([]);
  };

  const router = useRouter();

  const onFinish: FormProps["onFinish"] = async (values) => {
    // console.log("Success:", {
    //   ...values,
    //   hashtags: values.hashtags
    //     ? values.hashtags
    //         .trim()
    //         .split("#")
    //         .map((hashtag: any) => hashtag.trim())
    //     : [],
    //   files: file,
    // });
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
      method: "POST",
      body: {
        ...values,
        name: values.name.trim(),
        address: values.address.trim(),
        description: values.description.trim(),
        files: file,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })) as any;
    if (res.data) {
      message.success(res.message);
      router.push("/Market");
    } else {
      message.error(res.message);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Rao bán</h1>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Tình trạng" name="status">
          <Select>
            <Select.Option value={"New"}>Mới</Select.Option>
            <Select.Option value={"LikeNew"}>Như mới</Select.Option>
            <Select.Option value={"Good"}>Tốt</Select.Option>
            <Select.Option value={"Fine"}>Ổn</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Tên sản phẩm" name="name">
          <Input
            count={{
              show: true,
              max: 280,
            }}
          />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input
            count={{
              show: true,
              max: 280,
            }}
          />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Giá tiền"
          name="price"
          // rules={[{ required: true, message: "Vui lòng nhập giá tiền!" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            addonAfter="VND"
          />
        </Form.Item>

        {/* <Form.Item label="Trending" name="hashtags">
          <Mentions
            prefix="#"
            style={{ width: "100%" }}
            loading={loading}
            onSearch={onSearch}
            options={users.map(({ _id }) => ({
              key: _id,
              value: _id,
              className: "antd-demo-dynamic-option",
              label: (
                <>
                  <span>{_id}</span>
                </>
              ),
            }))}
          />
        </Form.Item> */}

        <Form.Item
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            multiple={false}
            maxCount={1}
            // fileList={fileList}
            name="slider"
            listType="picture-card"
            className="avatar-uploader"
            beforeUpload={(file) =>
              beforeUpload(file).then((isSafeResult) => {
                // Handle successful result
                if (isSafeResult) {
                  return true;
                } else {
                  return false;
                }
              })
            }
            customRequest={handleUploadFiles}
            onChange={(info) => handleChange(info)}
            onPreview={handlePreview}
            onRemove={handleRemoveFile}
          >
            <div>
              {uploading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Editor value={description} onChange={setDescription} />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
      {previewImage && (
        <Image2
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}
