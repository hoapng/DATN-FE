"use client";

import { sendRequest } from "@/utils/api";
import { TextInput } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "antd";

interface Post {
  _id: string;
  id: string;
  title: string;
}

interface ApiResponse {
  data: {
    result: Post[];
    meta: {
      total: number;
    };
  };
}

const removeDiacritics = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const { Search } = Input;

export default function SearchBar() {
  const { data: session } = useSession();
  const [listPosts, setListPosts] = useState<Post[]>([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState({});
  const [sortQuery, setSortQuery] = useState("-updatedAt");
  const [activeSearch, setActiveSearch] = useState<Post[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, [current, pageSize, filter, sortQuery]);

  const fetchPosts = async () => {
    setIsLoading(true);
    const res = await sendRequest<ApiResponse>({
      url: `http://localhost:8000/api/v1/tweets`,
      method: "GET",
      queryParams: {
        current: current,
        pageSize: pageSize,
        sort: sortQuery,
        ...filter,
      },
      nextOption: {
        cache: "no-store",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    console.log(res.data.result);
    if (res && res.data) {
      setListPosts(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  const debounce = (func: Function, delay: number) => {
    let timerId: NodeJS.Timeout;
    return function (...args: any[]) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSearch = debounce((value: string) => {
    if (value === "") {
      setActiveSearch([]);
      return;
    }

    const normalizedSearchValue = removeDiacritics(value.toLowerCase()); // Normalize input
    const filteredPosts = listPosts
      .filter((item) => {
        const normalizedTitle = removeDiacritics(item.title.toLowerCase());
        return normalizedTitle.includes(normalizedSearchValue);
      })
      .slice(0, 5);

    setActiveSearch(filteredPosts);
  }, 500); // Adjust delay as per your preference

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleResultClick = (postId: string) => {
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
      />
      {activeSearch.length > 0 && (
        <div className="absolute mt-2 p-4 bg-slate-800 text-white w-[28rem] rounded-xl flex flex-col gap-2 z-10">
          {activeSearch.map((post) => (
            <div
              key={post.id}
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
