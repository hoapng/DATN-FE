"use client";
import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Popconfirm, message } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import InputPostsSearch from "@/components/dashboard/InputPostsSearch";

// https://stackblitz.com/run?file=demo.tsx
const PostsTable = () => {
  const { data: session } = useSession();
  const [listPosts, setListPosts] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState({});
  const [sortQuery, setSortQuery] = useState("-updatedAt");
  useEffect(() => {
    fetchPosts();
  }, [current, pageSize, filter, sortQuery]);

  const fetchPosts = async () => {
    setIsLoading(true);
    const res = await sendRequest({
      url: `http://localhost:8000/api/v1/tweets`,
      method: "GET",
      queryParams: {
        current: current,
        pageSize: pageSize,
        sort: sortQuery,
        ...filter,
      },
      nextOption: {
        cache: "no-store",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res && res.data) {
      setListPosts(res.data.result);
      setTotal(res.data.meta.total);
      console.log(res.data.result);
    }
    setIsLoading(false);
  };

  const handleDeletePosts = async (_id) => {
    const res = await sendRequest({
      url: `http://localhost:8000/api/v1/tweets/${_id}`,
      method: "DELETE",
      nextOption: {
        cache: "no-store",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res && res.data) {
      message.success("Thành công");
      fetchPosts();
    } else {
      message.error({ message: "Lỗi", description: res.message });
    }
  };

  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return <a href={`/Post/${record._id}`}>{record._id}</a>;
      },
    },
    {
      title: "type",
      dataIndex: "type",
      sorter: true,
    },
    {
      title: "title",
      dataIndex: "title",
      sorter: true,
    },
    {
      title: "image",
      dataIndex: "image",
      render: (text, record, index) => {
        return (
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${record.files[0]}`}
            alt={record.title}
            className="w-20 h-10 object-cover bg-gray-500"
          />
        );
      },
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      sorter: true,
    },
    {
      title: "updatedAt",
      dataIndex: "updatedAt",
      sorter: true,
    },
    {
      title: "action",
      render: (text, record, index) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Confirm Delete"}
              description={`${record._id}`}
              onConfirm={() => handleDeletePosts(record._id)}
            >
              <span style={{ cursor: "pointer", margin: "0 20px" }}>
                <DeleteTwoTone twoToneColor="#ff4d4f" />
              </span>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }

    if (sorter && sorter.field) {
      const q =
        sorter.order === "ascend" ? `${sorter.field}` : `-${sorter.field}`;
      setSortQuery(q);
    }
  };

  const handleSearch = (query) => {
    setFilter(query);
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <Button
          type="default"
          onClick={() => {
            setFilter("");
            setSortQuery("");
          }}
        >
          Reset
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Row gutter={[20, 20]}>
        <Col span={24}>
          <InputPostsSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            className="def"
            columns={columns}
            dataSource={listPosts}
            onChange={onChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              total: total,
              showTotal: (total, range) => {
                return (
                  <div>
                    {range[0]}-{range[1]}/{total}
                  </div>
                );
              },
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PostsTable;
