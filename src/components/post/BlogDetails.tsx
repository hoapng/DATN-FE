"use client";
import { clean, cleanCustom } from "@/utils/filter";
import CommentSection from "./PostComments";
import SamePost from "./SamePost";
import DeletePost from "./DeletePost";
import Link from "next/link";

import ReactPost from "./ReactPost";
import { Button } from "flowbite-react";

const BlogDetails = ({ session, post, samePosts, slug }: any) => {
  return (
    <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
      <div className="w-full flex flex-col md:flex-row gap-2 gap-y-5 items-center">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
            {post?.title}
          </h1>
          <span className="text-slate-600">
            {new Date(post?.createdAt).toDateString()}
          </span>

          <div className="w-full flex flex-wrap gap-2 items-center ">
            {/* {post?.hashtags?.map((hashtag: string, index: number) => (
                <Badge key={index} color="indigo" size="sm">
                  {hashtag}
                </Badge>
              ))} */}
            <ReactPost post={post} />
          </div>
          <Link
            href={`/Profile/${post?.createdBy?._id}`}
            className="flex gap-3"
          >
            <img
              src={post?.createdBy?.avatar}
              alt={post?.createdBy?.name}
              className="object-cover w-12 h-12  rounded-full"
            />
            <div className="">
              <p className="text-slate-800 dark:text-white font-medium">
                {post?.createdBy?.name}
              </p>
              <span className="text-slate-600">{post?.createdBy?.email}</span>
            </div>
          </Link>
          {session?.user._id === post?.createdBy?._id ? (
            <div className="flex flex-wrap gap-2">
              <Link href={`/EditPost/${slug}`}>
                <Button color="gray">Chỉnh sửa</Button>
              </Link>
              <DeletePost postId={post._id} />
            </div>
          ) : (
            <></>
          )}
        </div>
        {post?.files?.length > 0 ? (
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${post.files}`}
            alt=""
            className="w-full md:w-1/2 h-auto md:h-[360px] 2xl:h-[460px] rounded object-contain"
          />
        ) : (
          <></>
        )}
      </div>

      <div className="w-full flex flex-col md:flex-row gap-x-10 2xl:gap-x-28 mt-10">
        {/* LEFT */}
        <div className="w-full md:w-2/3 flex flex-col text-black dark:text-gray-500 ">
          {/* {post?.content} */}
          {post.content ? (
            <div
              className="content"
              dangerouslySetInnerHTML={{
                __html: post?.content,
                // __html: badWords(post?.content, {
                //   replacement: "*",
                //   blackList: (defaultList) => [...badWordList],
                // }),
              }}
            />
          ) : (
            <></>
          )}

          {/* COMMENTS SECTION */}
          <div className="w-full">{<CommentSection postId={slug} />}</div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/4 flex flex-col gap-y-12">
          {/* SAME POSTS */}
          <p className="text-xl font-bold -mb-3 text-gray-600 dark:text-slate-500">
            Bài viết liên quan
          </p>
          {samePosts?.map((post: any, id: number) => {
            return <SamePost post={post} key={id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
