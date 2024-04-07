"use client";
import React from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { useRouter } from "next/navigation";

const { Header, Content, Footer, Sider } = Layout;

// const items: MenuProps["items"] = [
//   UserOutlined,
//   VideoCameraOutlined,
//   UploadOutlined,
//   BarChartOutlined,
//   CloudOutlined,
//   AppstoreOutlined,
//   TeamOutlined,
//   ShopOutlined,
// ].map((icon, index) => ({
//   key: String(index + 1),
//   icon: React.createElement(icon),
//   label: `nav ${index + 1}`,
// }));

const items: MenuProps["items"] = [
  {
    key: "home",
    icon: <UserOutlined />,
    label: "Home",
  },
  {
    key: "profile",
    icon: <UserOutlined />,
    label: "Profile",
  },
];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          background: colorBgContainer,
        }}
      >
        <Menu
          activeKey=""
          mode="inline"
          items={items}
          onClick={({ item, key, keyPath, domEvent }) => {
            if (key === "home") {
              router.push(`/`);
            } else router.push(`/${key}`);
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Content style={{ margin: "24px auto", overflow: "initial" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
