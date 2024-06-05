"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
import {
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  HeartTwoTone,
  LikeOutlined,
  LikeTwoTone,
  ShareAltOutlined,
} from "@ant-design/icons";
import { message } from "antd";

const ReactPost = (props: any) => {
  const { post } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const [postLikes, setPostLikes] = useState({});

  const [checkPostLikes, setCheckPostLikes] = useState([]);

  const fetchData = async () => {
    const res2 = await sendRequest({
      url: `http://localhost:8000/api/v1/likes`,
      method: "GET",
      queryParams: {
        current: 1,
        pageSize: 1,
        tweet: post._id,
      },
      // headers: {
      //   Authorization: `Bearer ${session?.access_token}`,
      // },
      nextOption: {
        cache: "no-store",
      },
    });
    if (res2?.data) setPostLikes(res2?.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const checkLike = async () => {
    if (session) {
      const res1 = await sendRequest({
        url: `http://localhost:8000/api/v1/likes`,
        method: "GET",
        queryParams: {
          createdBy: session?.user._id,
          tweet: post._id,
        },
        // headers: {
        //   Authorization: `Bearer ${session?.access_token}`,
        // },
        nextOption: {
          cache: "no-store",
        },
      });
      if (res1?.data?.result) setCheckPostLikes(res1?.data?.result);
      else setCheckPostLikes([]);
    }
  };

  useEffect(() => {
    checkLike();
  }, [session]);

  const handleLikePost = async () => {
    const res = await sendRequest({
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
    if (res?.error) message.error(res?.error);

    fetchData();
    checkLike();
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
    checkLike();
    // router.refresh();
  };
  return (
    <>
      {checkPostLikes.length > 0 ? (
        <span className="flex items-center" onClick={() => handleUnlikePost()}>
          <HeartFilled style={{ fontSize: "30px", color: "hotpink" }} />{" "}
          <p className="text-3xl">{postLikes?.meta?.total}</p>
        </span>
      ) : (
        <span className="flex items-center" onClick={() => handleLikePost()}>
          <HeartOutlined style={{ fontSize: "30px" }} />{" "}
          <p className="text-3xl">{postLikes?.meta?.total}</p>
        </span>
      )}
      {/* <ShareAltOutlined style={{ fontSize: "30px" }} /> */}
    </>
  );
};

export default ReactPost;
