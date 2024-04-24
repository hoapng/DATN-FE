"use client";
import "react-quill/dist/quill.snow.css";
import Editor from "@/components/Editor";
import React, { useCallback, useRef, useState } from "react";
import { Mentions } from "antd";
import debounce from "lodash/debounce";
import { PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Select, Upload } from "antd";
import { sendRequest } from "@/utils/api";
import { error } from "console";

const { TextArea } = Input;

export enum TweetType {
  Post,
  Share,
  Comment,
  News,
  Review,
  Tips,
  Question,
}

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const ref = useRef<string>();

  const loadGithubUsers = async (key: string) => {
    if (!key) {
      setUsers([]);
      return;
    }

    let date = new Date();

    const res = await sendRequest({
      url: `http://localhost:8000/api/v1/hashtag/top`,
      method: "GET",
      queryParams: {
        current: 1,
        pageSize: 5,
        from: date.setDate(date.getDate() - 7),
        name: `/${key}/`,
      },
      nextOption: {
        cache: "no-store",
      },
    });
    if (res && res.data) {
      if (ref.current !== key) return;
      setLoading(false);
      setUsers(res.data.result);
    }

    // fetch(`https://api.github.com/search/users?q=${key}`)
    //   .then((res) => res.json())
    //   .then(({ items = [] }) => {
    //     if (ref.current !== key) return;

    //     setLoading(false);
    //     setUsers(items.slice(0, 10));
    //     console.log(users);
    //   });
  };

  const debounceLoadGithubUsers = useCallback(
    debounce(loadGithubUsers, 500),
    []
  );

  const onSearch = (search: string) => {
    console.log("Search:", search);
    ref.current = search;
    setLoading(!!search);
    setUsers([]);

    debounceLoadGithubUsers(search);
  };

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Select">
          <Select>
            <Select.Option value={TweetType.News}>News</Select.Option>
            <Select.Option value={TweetType.Post}>Post</Select.Option>
            <Select.Option value={TweetType.Question}>Question</Select.Option>
            <Select.Option value={TweetType.Review}>Review</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Title">
          <TextArea rows={1} />
        </Form.Item>

        <Form.Item label="Trending">
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
        </Form.Item>

        <Form.Item
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Editor value={content} onChange={setContent} />
        </Form.Item>

        <Form.Item>
          <Button>Submit</Button>
        </Form.Item>
      </Form>
    </>
  );
}
