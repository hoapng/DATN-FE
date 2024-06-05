"use client";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const { Meta } = Card;

const SamePost = (props: any) => {
  const router = useRouter();
  const { post } = props;
  return (
    <Card
      onClick={() => router.push(`/Post/${post?._id}`)}
      cover={
        post.files.length > 0 ? (
          <img
            alt="example"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${post.files}`}
          />
        ) : (
          <></>
        )
      }
    >
      <Meta description={<Title level={5}>{post.title}</Title>} />
    </Card>
  );
};

export default SamePost;
