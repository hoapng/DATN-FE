/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { use, useState } from "react";
import {
  ShareAltOutlined,
  CommentOutlined,
  LikeOutlined,
  LeftOutlined,
  RightOutlined,
  EditOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import { Carousel } from "antd";
import ModalReadPost from "./ModalReadPost";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";

const { Meta } = Card;

const Post: React.FC = (props: any) => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleCheckBookmark = async (tweet_id: string) => {
  //   const res = await sendRequest({
  //     url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/bookmarks/${tweet_id}`,
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${session?.access_token}`,
  //     },
  //   });
  //   if (res.data) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  return (
    <>
      {props.tweets.map((tweet: any) => {
        return (
          <Card
            key={tweet._id}
            style={{ width: 500, margin: "20px auto" }}
            cover={
              tweet.files.length !== 0 ? (
                <Carousel afterChange={onChange}>
                  {tweet.files.map((image: string, index: number) => (
                    <img key={index} src={image} />
                  ))}
                </Carousel>
              ) : (
                <Carousel>
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                </Carousel>
              )
            }
            actions={
              session?.user._id === tweet.createdBy?._id
                ? [
                    <LikeOutlined key="Like" />,
                    <CommentOutlined
                      key="Comment"
                      onClick={() => setIsModalOpen(true)}
                    />,
                    <>
                      {/* {isBookmark.data ? (
                        <StarFilled key="Bookmark" />
                      ) : ( */}
                      <StarOutlined key="Bookmark" />
                      {/* )} */}
                    </>,
                    <ShareAltOutlined key="Share" />,
                    <EditOutlined key="Edit" />,
                  ]
                : [
                    <LikeOutlined key="Like" />,
                    <CommentOutlined
                      key="Comment"
                      onClick={() => setIsModalOpen(true)}
                    />,
                    <StarOutlined key="Bookmark" />,
                    <ShareAltOutlined key="ShareAlt" />,
                  ]
            }
          >
            <Meta
              avatar={<Avatar src={tweet.createdBy?.avatar} />}
              title={
                <>
                  <p>{tweet.createdBy?.name}</p>
                  <p className="font-light text-sm">{tweet.createdBy?.email}</p>
                </>
              }
              description={tweet.content}
            />
          </Card>
        );
      })}

      <ModalReadPost
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default Post;
