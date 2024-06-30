"use client";
import React from "react";
import { Button, message } from "antd";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function DeletePost({ postId }: { postId: any }) {
  // console.log(postId);
  const router = useRouter();
  const { data: session } = useSession();

  const handleDeletePost = async (_id: any) => {
    console.log(_id);
    try {
      const res = await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tweets/${_id}`,
        method: "DELETE",
        nextOption: {
          cache: "no-store",
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res && res.data) {
        message.success("Thành công");
        router.push("/");
      } else {
        message.error(`Lỗi: ${res.message}`);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa bài viết");
    }
  };

  return (
    <div>
      <Button danger onClick={() => handleDeletePost(postId)} size={"large"}>
        Xóa
      </Button>
    </div>
  );
}
