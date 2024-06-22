"use client";

import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "antd";

interface Post {
  userName: string;
  _id: string;
  title: string;
  createdBy: string;
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

interface ApiUserResponse {
  data: {
    name: string;
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

    try {
      const res = await sendRequest<ApiPostResponse>({
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

      if (res && res.data && res.data.result) {
        const posts = res.data.result;

        const postsWithUserNames = await Promise.all(
          posts.map(async (post) => {
            const userRes = await sendRequest<ApiUserResponse>({
              url: `http://localhost:8000/api/v1/users/${post.createdBy}`,
              method: "GET",
              nextOption: {
                cache: "no-store",
              },
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
              },
            });

            if (userRes && userRes.data && userRes.data.name) {
              post.userName = userRes.data.name;
            }

            return post;
          })
        );

        setListPosts(postsWithUserNames);
        setTotal(res.data.meta.total);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    setIsLoading(false);
  };

  console.log(listPosts);

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
              key={post._id}
              onClick={() => handleResultClick(post._id)}
              className="cursor-pointer"
            >
              {post.title} - {post.userName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
