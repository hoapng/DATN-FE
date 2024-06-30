"use client";

import { sendRequest } from "@/utils/api";
import { message } from "antd";
import { Button, Textarea } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Comment({ comment, onDelete, getComments }) {
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    const res = await sendRequest({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments/${comment._id}`,
      method: "PATCH",
      body: {
        content: editedContent,
      },
      nextOption: {
        cache: "no-store",
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    if (res.data) {
      setIsEditing(false);
      getComments();
      // onEdit(comment, editedContent);
    } else {
      message.info(res.message);
    }
  };
  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          className="w-10 h-10 rounded-full bg-gray-200"
          src={comment?.createdBy?.avatar}
          alt={comment?.createdBy?.name}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {comment?.createdBy?.name
              ? comment?.createdBy?.name
              : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {new Date(comment?.createdAt).toDateString()}
            {/* {moment(comment.createdAt).fromNow()} */}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 pb-2">{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
              {/* <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  session &&
                  comment.likes.includes(session.user._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button> */}
              {/* <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p> */}
              {session && session.user._id === comment?.createdBy?._id && (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(comment._id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
              {/* <button
                type="button"
                onClick={handleEdit}
                className="text-gray-400 hover:text-blue-500"
              >
                Reply
              </button> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
