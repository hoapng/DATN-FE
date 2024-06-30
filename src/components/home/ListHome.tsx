"use client";
import React, { useEffect, useState } from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, List, Pagination, PaginationProps, Space } from "antd";
import { sendRequest } from "@/utils/api";
import PostCard from "../post/PostCard";

const ListHome = (props: any) => {
  const [data, setData] = useState<any>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const getData = async () => {
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tweets/`,
      method: "GET",
      queryParams: {
        current: current,
        pageSize: pageSize,
        type: props.type,
        sort: "-updatedAt",
        createdBy: props?.profile ? props?.profile : "",
      },
      nextOption: {
        cache: "no-store",
      },
      // headers: {
      //   Authorization: `Bearer ${session?.access_token}`,
      // },
    })) as any;

    if (res.data) {
      setData(res.data);
      setTotal(res.data.meta.total);
    }
  };
  useEffect(() => {
    getData();
  }, [current, pageSize]);

  const handleOnchangePage = (pagination: any) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  return (
    <div className="w-full md:w-2/3 flex flex-col gap-y-28 md:gap-y-14">
      {data?.result?.map((post: any, index: any) => {
        return <PostCard key={index} post={post} />;
      })}
      <Pagination
        current={current}
        showSizeChanger
        showQuickJumper
        total={total}
        pageSize={pageSize}
        responsive
        onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
      />
    </div>
  );
};

export default ListHome;
