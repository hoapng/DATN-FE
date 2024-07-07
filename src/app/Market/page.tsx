"use client";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  Button,
  Tabs,
  Pagination,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import "./home.scss";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { clean } from "@/utils/filter";
const Home = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const listCategory = [
    { label: "Mới", value: "New" },
    { label: "Như mới", value: "LikeNew" },
    { label: "Tốt", value: "Good" },
    { label: "Ổn", value: "Fine" },
  ];

  const [listProduct, setListProduct] = useState<any>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [sortQuery, setSortQuery] = useState("-updatedAt");

  const [form] = Form.useForm();

  // useEffect(() => {
  //   const initCategory = async () => {
  //     const res = await callFetchCategory();
  //     if (res && res.data) {
  //       const d = res.data.map((item) => {
  //         return { label: item, value: item };
  //       });
  //       setListCategory(d);
  //     }
  //   };
  //   initCategory();
  // }, []);

  useEffect(() => {
    fetchProduct();
    console.log(createdBy);
  }, [current, pageSize, filter, sortQuery, createdBy]);

  const fetchProduct = async () => {
    setIsLoading(true);
    // let query = `current=${current}&pageSize=${pageSize}`;
    // if (filter) {
    //   query += `&${filter}`;
    // }
    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
      method: "GET",
      queryParams: {
        current: current,
        pageSize: pageSize,
        sort: sortQuery,
        status: filter,
        createdBy: createdBy,
      },
      nextOption: {
        cache: "no-store",
      },
      // headers: {
      //   Authorization: `Bearer ${session?.access_token}`,
      // },
    })) as any;
    if (res && res.data && res.data.result) {
      const result = await Promise.all(
        res.data.result?.map(async (x: any) => {
          return {
            ...x,
            name: await clean(x.name),
          };
        })
      );
      setListProduct(result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const handleOnchangePage = (pagination: any) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleChangeFilter = (changedValues: any, values: any) => {
    // console.log(">>> check changedValues, values: ", changedValues, values)

    //only fire if category changes
    if (changedValues.category) {
      const cate = values.category;
      if (cate && cate.length > 0) {
        const f = cate.join(",");
        setFilter(`${f}`);
      } else {
        //reset data -> fetch all
        setFilter("");
      }
    }

    if (changedValues.createdBy) {
      const createdBy = values.createdBy;
      if (createdBy && createdBy.length > 0) {
        const f = createdBy.join(",");
        setCreatedBy(`${f}`);
      } else {
        //reset data -> fetch all
        setCreatedBy("");
      }
    }
  };

  const onFinish = (values: any) => {
    // console.log('>> check values: ', values)

    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilter(f);
    }
  };

  const items = [
    {
      key: "-updatedAt",
      label: `Mới đăng`,
      children: <></>,
    },
    {
      key: "price",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "-price",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="homepage-container min-h-screen"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={4} sm={0} xs={0}>
            <div
              style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>
                  {" "}
                  <FilterTwoTone />
                  <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                </span>
                <ReloadOutlined
                  title="Reset"
                  onClick={() => {
                    form.resetFields();
                    setFilter("");
                  }}
                />
              </div>
              <Divider />
              <Form
                onFinish={onFinish}
                form={form}
                onValuesChange={(changedValues, values) =>
                  handleChangeFilter(changedValues, values)
                }
              >
                <Form.Item name="createdBy" labelCol={{ span: 24 }}>
                  <Checkbox.Group>
                    <Row>
                      <Col span={24} style={{ padding: "7px 0" }}>
                        <Checkbox value={session?.user._id}>Của tôi</Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  name="category"
                  label="Tình trạng sản phẩm"
                  labelCol={{ span: 24 }}
                >
                  <Checkbox.Group>
                    <Row>
                      {listCategory?.map((item, index) => {
                        return (
                          <Col
                            span={24}
                            key={`index-${index}`}
                            style={{ padding: "7px 0" }}
                          >
                            <Checkbox value={item.value}>{item.label}</Checkbox>
                          </Col>
                        );
                      })}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
                <Divider />
                {/* <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
                  <Row gutter={[10, 10]} style={{ width: "100%" }}>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "from"]}>
                        <InputNumber
                          name="from"
                          min={0}
                          placeholder="đ TỪ"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={2} md={0}>
                      <div> - </div>
                    </Col>
                    <Col xl={11} md={24}>
                      <Form.Item name={["range", "to"]}>
                        <InputNumber
                          name="to"
                          min={0}
                          placeholder="đ ĐẾN"
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div>
                    <Button
                      onClick={() => form.submit()}
                      style={{ width: "100%" }}
                      type="primary"
                    >
                      Áp dụng
                    </Button>
                  </div>
                </Form.Item> */}
                <Button
                  onClick={() => router.push("/Market/Create")}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  Rao bán
                </Button>
              </Form>
            </div>
          </Col>

          <Col md={20} xs={24}>
            <Spin spinning={isLoading} tip="Loading...">
              <div
                style={{ padding: "20px", background: "#fff", borderRadius: 5 }}
              >
                <Row>
                  <Tabs
                    defaultActiveKey="-updatedAt"
                    items={items}
                    onChange={(value) => {
                      setSortQuery(value);
                    }}
                    style={{ overflowX: "auto" }}
                  />
                </Row>
                <Row className="customize-row">
                  {listProduct?.map((item: any, index: any) => {
                    return (
                      <div
                        className="column"
                        key={`product-${index}`}
                        onClick={() =>
                          router.push(`/Market/Product/${item._id}`)
                        }
                      >
                        <div className="wrapper h-full w-full relative">
                          <div className="thumbnail h-full w-full overflow-hidden">
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${item.files}`}
                              alt="thumbnail product"
                              className="object-cover h-full w-full"
                            />
                          </div>
                          <div className="text" title={item.name}>
                            {item.name}
                          </div>
                          <div className="price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item?.price ?? 0)}
                          </div>
                          <div className="rating">
                            {/* <Rate
                              value={5}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 10 }}
                            /> */}
                            <span>Tình trạng {item?.status}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Row>
                <Row
                  style={{
                    marginTop: 80,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Pagination
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    responsive
                    onChange={(p, s) =>
                      handleOnchangePage({ current: p, pageSize: s })
                    }
                  />
                </Row>
              </div>
            </Spin>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
