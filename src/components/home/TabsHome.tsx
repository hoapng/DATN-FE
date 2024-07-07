"use client";
import React, { useEffect, useState } from "react";
import { Pagination, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import ListHome from "./ListHome";
import Link from "next/link";
import { sendRequest } from "@/utils/api";
import PostCard from "../post/PostCard";
import { clean } from "@/utils/filter";

const TabsHome = (props: any) => {
  const [filter, setFilter] = useState("News");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [listPost, setListPost] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [current, pageSize, filter]);

  const fetchPost = async () => {
    setIsLoading(true);
    // let query = `current=${current}&pageSize=${pageSize}`;
    // if (filter) {
    //   query += `&${filter}`;
    // }
    // if (sortQuery) {
    //   query += `&${sortQuery}`;
    // }

    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tweets`,
      method: "GET",
      queryParams: {
        current: current,
        pageSize: pageSize,
        type: filter,
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
    if (res && res.data) {
      const result = await Promise.all(
        res.data.result?.map(async (x: any) => {
          return {
            ...x,
            title: await clean(x.title),
          };
        })
      );
      setListPost(result);
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

  const items: TabsProps["items"] = [
    {
      key: "News",
      label: "Tin tức",
      children: <></>,
    },
    {
      key: "Review",
      label: "Review và chia sẻ",
      children: <></>,
    },
    {
      key: "Tips",
      label: "Thủ thuật và tối ưu",
      children: <></>,
    },
    {
      key: "Question",
      label: "Hỏi đáp và thảo luận",
      children: <></>,
    },
  ];
  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <Tabs
          defaultActiveKey="News"
          items={items}
          onChange={(value) => {
            setFilter(value);
          }}
        />
        <div className="w-full md:w-2/3 flex flex-col gap-y-28 md:gap-y-14">
          {listPost.map((post: any, index: any) => {
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
      </Spin>
    </>
  );
};

export default TabsHome;
