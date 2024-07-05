"use client";
import { Alert, Button, Modal, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { sendRequest } from "@/utils/api";
import { message } from "antd";

export default function CommentSection({ postId }: { postId: any }) {
  const { data: session } = useSession();

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState("");

  const getComments = async () => {
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/`,
      method: "GET",
      queryParams: {
        post: postId,
        populate: "createdBy",
        sort: "-updatedAt",
      },
      nextOption: {
        cache: "no-store",
      },
      // headers: {
      //   Authorization: `Bearer ${session?.access_token}`,
      // },
    })) as any;
    if (res.data) {
      setComments(res.data);
    } else message.info(res.message);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/`,
      method: "POST",
      body: {
        post: postId,
        content: comment.trim(),
      },
      nextOption: {
        cache: "no-store",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })) as any;

    if (res.data) {
      setComment("");
      getComments();
    } else message.info(res.message);
  };

  const handleDelete = async (commentId: string) => {
    setShowModal(false);

    // if (!currentUser) {
    //   navigate('/sign-in');
    //   return;
    // }
    const res = (await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/${commentId}`,
      method: "DELETE",
      nextOption: {
        cache: "no-store",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    })) as any;
    if (res.data) {
      getComments();
    } else message.info(res.message);
  };

  useEffect(() => {
    getComments();
  }, [postId]);
  return (
    <div className="mx-auto w-full p-3">
      {session ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={session.user.avatar}
            alt=""
          />
          <Link
            href={`/Profile/${session.user._id}`}
            className="text-xs text-cyan-600 hover:underline"
          >
            {session.user.name}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          {/* <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link> */}
        </div>
      )}
      {session && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a comment..."
            rows={4}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {/* {commentError && (
            <Alert color='failure' className='mt-5'>
              {commentError}
            </Alert>
          )} */}
        </form>
      )}
      {comments?.meta?.total === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments?.meta?.total}</p>
            </div>
          </div>
          {comments?.result?.map((comment: any) => (
            <Comment
              key={comment._id}
              comment={comment}
              getComments={getComments}
              // onLike={handleLike}
              // onEdit={handleEdit}
              onDelete={(commentId: string) => {
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(commentToDelete)}
              >
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
