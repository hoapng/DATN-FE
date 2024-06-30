"use client";
import React from "react";
import { Breadcrumb, Button, Form, Input, Layout, Menu, theme } from "antd";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const App = ({ children }: { children: React.ReactNode }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Link
          href="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Hoa&apos;s
          </span>
          Blog
        </Link>
        <Form>
          <Form.Item>
            <Input prefix={<SearchOutlined />} className="hidden lg:inline" />
          </Form.Item>
        </Form>
        <Button>
          <SearchOutlined />
        </Button>
      </Header>
      <Content style={{ padding: "0 48px" }}>{children}</Content>
    </Layout>
  );
};

export default App;
