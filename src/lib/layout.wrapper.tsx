"use client";
import React from "react";
import {
  AntDesignOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  ShopOutlined,
  StarOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Divider, Layout, Menu, Typography, theme } from "antd";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

const { Header, Content, Footer, Sider } = Layout;

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const itemsAccount: MenuProps["items"] = [
    {
      key: "info",
      icon: (
        <Avatar
          size="default"
          icon={<AntDesignOutlined />}
          src={session?.user?.avatar}
        />
      ),
      label: session?.user.email,
      onClick: () => {
        router.push(`/profile/${session?.user._id}`);
      },
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => {
        signOut();
      },
    },
  ];

  const items: MenuProps["items"] = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => {
        router.push("/");
      },
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => {
        router.push(`/profile/${session?.user._id}`);
      },
    },
    {
      key: "bookmark",
      icon: <StarOutlined />,
      label: "Bookmark",
      onClick: () => {
        router.push(`/bookmark/${session?.user._id}`);
      },
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { Text } = Typography;

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
          paddingTop: 20,
        }}
      >
        {session ? (
          <>
            <Menu
              style={{ borderInlineEnd: "none" }}
              activeKey=""
              mode="inline"
              items={session ? itemsAccount : []}
            />
            <Divider />
            <Menu
              style={{ borderInlineEnd: "none" }}
              mode="inline"
              items={session ? items : []}
            />
            <div className="my-6 mx-12">
              <Button
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
                block
              >
                POST
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-5 px-6">
            <Button
              type="primary"
              shape="round"
              icon={<LoginOutlined />}
              size="large"
              onClick={() => signIn()}
            >
              Login
            </Button>
          </div>
        )}
      </Sider>
      <Layout style={{ marginLeft: 200, minHeight: "100vh" }}>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}
