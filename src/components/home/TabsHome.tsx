"use client";
import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import ListHome from "./ListHome";
import Link from "next/link";

const onChange = (key: string) => {
  console.log(key);
};

const TabsHome: React.FC = (props: any) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Tin tức",
      children: <ListHome profile={props?.profile} type="News" />,
    },
    {
      key: "2",
      label: "Review và chia sẻ",
      children: <ListHome profile={props?.profile} type="Review" />,
    },
    {
      key: "3",
      label: "Thủ thuật và tối ưu",
      children: <ListHome profile={props?.profile} type="Tips" />,
    },
    {
      key: "4",
      label: "Hỏi đáp và thảo luận",
      children: <ListHome profile={props?.profile} type="Question" />,
    },
  ];
  return <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default TabsHome;
