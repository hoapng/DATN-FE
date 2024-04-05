"use client";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem("Option 13", "13"),
  getItem("Option 14", "14"),
];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      {/* <Header style={{ display: "flex", alignItems: "center" }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            items={items1}
            style={{ flex: 1, minWidth: 0 }}
          />
        </Header> */}
      <Content
      // style={{ padding: "0 48px" }}
      >
        <Layout
          className="h-screen"
          // style={{
          //   // padding: "24px 0",
          //   background: colorBgContainer,
          //   borderRadius: borderRadiusLG,
          // }}
        >
          <Sider
            // style={{ background: colorBgContainer }}
            width={300}
          >
            <Menu
              // onClick={onClick}
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              style={{ height: "100%" }}
              items={items}
            />
          </Sider>
          <Content style={{ padding: "0 24px", minHeight: 280 }}>
            {children}
          </Content>
          <Sider style={{ background: "red" }} width={200}>
            Right part
          </Sider>
        </Layout>
      </Content>
    </Layout>
  );
}
