"use client";
import React, { useState } from "react";
import { Button, message } from "antd";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { Modal } from "flowbite-react";

export default function DeletePost({ postId }: { postId: any }) {
  // console.log(postId);
  const router = useRouter();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  const handleDeletePost = async (_id: any) => {
    console.log(_id);
    try {
      const res = (await sendRequest({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tweets/${_id}`,
        method: "DELETE",
        nextOption: {
          cache: "no-store",
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      })) as any;

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
    <>
      <Button danger onClick={() => setShowModal(true)} size={"large"}>
        Xóa
      </Button>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            {/* <ExclamationCircleOutlined className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' /> */}
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeletePost(postId)}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
