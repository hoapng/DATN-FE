"use client";

import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "antd";
import { clean } from "@/utils/filter";

interface Post {
  _id: string;
  title: string;
}

interface ApiPostResponse {
  data: {
    name: { result: Post[]; meta: { total: number } };
    result: Post[];
    meta: {
      total: number;
    };
  };
}

const { Search } = Input;

export default function SearchBar() {
  const [activeSearch, setActiveSearch] = useState<Post[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();

  const fetchPosts = async (key: string) => {
    if (!key) {
      setActiveSearch([]);
      return;
    }

    const res = await sendRequest<ApiPostResponse>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tweets`,
      method: "GET",
      queryParams: {
        current: 1,
        pageSize: 5,
        title: `/${key}/i`,
      },
      nextOption: {
        cache: "no-store",
      },
    });
    if (res && res.data && res.data.result.length > 0) {
      const result = await Promise.all(
        res.data.result?.map(async (x: any) => {
          return {
            ...x,
            title: await clean(x.title),
          };
        })
      );
      setActiveSearch(result);
    } else setActiveSearch([{ _id: "0", title: "Không có dữ liệu" }]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search:", e.target.value);
    const { value } = e.target;
    setSearchValue(value);
    if (value === "") {
      setActiveSearch([]);
      return;
    }
  };

  const handleResultClick = (postId: string) => {
    if (postId === "0") return;
    setSearchValue("");
    router.push(`/Post/${postId}`);
    setActiveSearch([]);
  };

  return (
    <div className="relative">
      <Search
        placeholder="Search..."
        size="large"
        value={searchValue}
        onChange={handleInputChange}
        onSearch={() => fetchPosts(searchValue)}
      />
      {activeSearch.length > 0 && (
        <div className="absolute mt-2 p-4 bg-slate-800 text-white w-[28rem] rounded-xl flex flex-col gap-2 z-10">
          {activeSearch.map((post) => (
            <div
              key={post._id}
              onClick={() => handleResultClick(post._id)}
              className="cursor-pointer"
            >
              {post.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
