"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const path = usePathname();
  return (
    <Navbar className="border-b-2">
      <Link
        href="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Hoa's
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={SearchOutlined}
          className="hidden lg:inline"
          //   value={searchTerm}
          //   onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <SearchOutlined />
      </Button>
      <div className="flex gap-2 md:order-2">
        {/* <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button> */}
        {session ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={session.user.avatar} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{session.user.name}</span>
              <span className="block text-sm font-medium truncate">
                {session.user.email}
              </span>
            </Dropdown.Header>
            {/* <Link href={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider /> */}
            <Dropdown.Item
              onClick={() => {
                signOut();
              }}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Button
            gradientDuoTone="purpleToBlue"
            outline
            onClick={() => {
              signIn();
            }}
          >
            Sign In
          </Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link href="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link
          active={path === `/Profile/${session?.user._id}`}
          as={"div"}
        >
          <Link href={`/Profile/${session?.user._id}`}>Profile</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/Market"} as={"div"}>
          <Link href="/Market">Market</Link>
        </Navbar.Link>
        {session ? (
          <Navbar.Link active={path === "/CreatePost"} as={"div"}>
            <Link href="/CreatePost">Write A Post</Link>
          </Navbar.Link>
        ) : (
          <></>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
