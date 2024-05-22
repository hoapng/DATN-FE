"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
import {
  HeartFilled,
  HeartOutlined,
  HeartTwoTone,
  LikeOutlined,
  LikeTwoTone,
  ShareAltOutlined,
} from "@ant-design/icons";

const ReactPost = (props: any) => {
  const { post } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const [postLikes, setPostLikes] = useState([]);

  const fetchData = async () => {
    if (session?.access_token) {
      const res2 = await sendRequest({
        url: `http://localhost:8000/api/v1/likes`,
        method: "GET",
        queryParams: {
          tweet: post._id,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
          cache: "no-store",
        },
      });
      if (res2?.data?.result) setPostLikes(res2?.data?.result);
      else setPostLikes([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  const handleLikePost = async () => {
    await sendRequest({
      url: `http://localhost:8000/api/v1/likes`,
      method: "POST",
      body: {
        tweet: post?._id,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        cache: "no-store",
      },
    });

    fetchData();
    // router.refresh();
  };
  const handleUnlikePost = async () => {
    await sendRequest({
      url: `http://localhost:8000/api/v1/likes/${post?._id}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        cache: "no-store",
      },
    });

    fetchData();
    // router.refresh();
  };
  return (
    <>
      {postLikes?.some((t) => t.createdBy === session?.user._id) ? (
        <span className="flex items-center" onClick={() => handleUnlikePost()}>
          <HeartFilled style={{ fontSize: "30px", color: "hotpink" }} />{" "}
          <p className="text-3xl">{postLikes?.length}</p>
        </span>
      ) : (
        <span className="flex items-center" onClick={() => handleLikePost()}>
          <HeartOutlined style={{ fontSize: "30px" }} />{" "}
          <p className="text-3xl">{postLikes?.length}</p>
        </span>
      )}
      {/* <ShareAltOutlined style={{ fontSize: "30px" }} /> */}
    </>
  );
};

export default ReactPost;
