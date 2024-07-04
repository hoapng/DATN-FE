"use client";
import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Popconfirm, message } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import InputPostsSearch from "@/components/dashboard/InputPostsSearch";
import Link from "next/link";

// https://stackblitz.com/run?file=demo.tsx
const CommentsTable = () => {
  const { data: session } = useSession();
  const [listComments, setListComments] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState({});
  const [sortQuery, setSortQuery] = useState("-updatedAt");
  useEffect(() => {
    fetchComments();
  }, [current, pageSize, filter, sortQuery]);

  const fetchComments = async () => {
    setIsLoading(true);
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
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
    })) as any;
    if (res && res.data) {
      setListComments(res.data.result);
      setTotal(res.data.meta.total);
      // console.log(res.data.result);
    }
    setIsLoading(false);
  };

  const handleDeleteComments = async (_id: any) => {
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tweets/${_id}`,
      method: "DELETE",
      nextOption: {
        cache: "no-store",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })) as any;
    if (res && res.data) {
      message.success("Thành công");
      fetchComments();
    } else {
      message.error("Lỗi");
    }
  };

  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
    },
    {
      title: "post",
      dataIndex: "post",
      render: (text: any, record: any, index: any) => {
        return <Link href={`/Post/${record.post}`}>{record.post}</Link>;
      },
    },
    {
      title: "content",
      dataIndex: "content",
      sorter: true,
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
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Confirm Delete"}
              description={`${record._id}`}
              onConfirm={() => handleDeleteComments(record._id)}
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

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
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

  const handleSearch = (query: any) => {
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
        {/* <Col span={24}>
          <InputPostsSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col> */}
        <Col span={24}>
          <Table
            // title={renderHeader}
            loading={isLoading}
            className="def"
            columns={columns}
            dataSource={listComments}
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

export default CommentsTable;
