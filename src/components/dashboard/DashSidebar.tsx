"use client";
import {
  DiffOutlined,
  PieChartOutlined,
  UsergroupDeleteOutlined,
} from "@ant-design/icons";
import { Sidebar } from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashSidebar() {
  const tab = usePathname();
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link href="/Dashboard">
            <Sidebar.Item
              active={tab === "/Dashboard" || !tab}
              icon={PieChartOutlined}
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>

          <Link href="/Dashboard/Posts">
            <Sidebar.Item
              active={tab === "/Dashboard/Posts"}
              icon={DiffOutlined}
              as="div"
            >
              Posts
            </Sidebar.Item>
          </Link>

          <>
            <Link href="/Dashboard/Users">
              <Sidebar.Item
                active={tab === "/Dashboard/Users"}
                icon={UsergroupDeleteOutlined}
                as="div"
              >
                Users
              </Sidebar.Item>
            </Link>
          </>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
