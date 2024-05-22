"use client";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const { Meta } = Card;

const SamePost = (props: any) => {
  const router = useRouter();
  const { post } = props;
  return (
    <Card
      onClick={() => router.push(`/Post/${post?._id}`)}
      cover={
        <img
          alt="example"
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${post.files}`}
        />
      }
    >
      <Meta title={post.title} />
    </Card>
  );
};

export default SamePost;
