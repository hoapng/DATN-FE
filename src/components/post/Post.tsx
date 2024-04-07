"use client";
import React, { use, useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import { Carousel } from "antd";
import ModalReadPost from "./ModalReadPost";

const { Meta } = Card;

const Post: React.FC = () => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card
        style={{ width: 500, margin: "20px 0" }}
        cover={
          <Carousel afterChange={onChange}>
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          </Carousel>
        }
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          }
          title="Card title"
          description="This is the description"
          onClick={() => setIsModalOpen(true)}
        />
      </Card>
      <ModalReadPost
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default Post;
