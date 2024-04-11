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
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import { Carousel } from "antd";
import ModalReadPost from "./ModalReadPost";
import { useSession } from "next-auth/react";

const { Meta } = Card;

const Post: React.FC = (props: any) => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  const { data: session } = useSession();

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {props.tweets.map((tweet) => {
        return (
          <Card
            key={tweet._id}
            style={{ width: 500, margin: "20px auto" }}
            cover={
              tweet.files.length !== 0 ? (
                <Carousel afterChange={onChange}>
                  {tweet.files.map((image, index) => (
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
                    <StarOutlined key="Bookmark" />,
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
