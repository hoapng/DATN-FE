"use client";
import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, Popconfirm, message } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import InputUsersSearch from "@/components/dashboard/InputUsersSearch";
import Link from "next/link";

// https://stackblitz.com/run?file=demo.tsx
const UsersTable = () => {
  const { data: session } = useSession();
  const [listUsers, setListUsers] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const [filter, setFilter] = useState({});
  const [sortQuery, setSortQuery] = useState("-updatedAt");

  useEffect(() => {
    fetchUsers();
  }, [current, pageSize, filter, sortQuery]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
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
      setListUsers(res.data.result);
      setTotal(res.data.meta.total);
      // console.log(res.data.result);
    }
    setIsLoading(false);
  };

  const handleDeleteUsers = async (_id: any) => {
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${_id}`,
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
      fetchUsers();
    } else {
      message.error("Lỗi");
    }
  };

  const columns = [
    {
      title: "_id",
      dataIndex: "_id",
      render: (text: any, record: any, index: any) => {
        return <Link href={`/Profile/${record._id}`}>{record._id}</Link>;
      },
    },
    {
      title: "role",
      dataIndex: "role",
    },
    {
      title: "name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "email",
      dataIndex: "email",
      sorter: true,
    },
    {
      title: "avatar",
      dataIndex: "avatar",
      render: (text: any, record: any, index: any) => {
        return (
          <img
            src={`${record.avatar}`}
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
      title: "action",
      render: (text: any, record: any, index: any) => {
        return (
          <>
            <Popconfirm
              placement="leftTop"
              title={"Confirm Delete"}
              description={`${record._id}`}
              onConfirm={() => {
                if (record.role === "admin")
                  return message.error("Không thể xóa admin");
                handleDeleteUsers(record._id);
              }}
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
        <Col span={24}>
          <InputUsersSearch handleSearch={handleSearch} setFilter={setFilter} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            loading={isLoading}
            className="def"
            columns={columns}
            dataSource={listUsers}
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

export default UsersTable;
