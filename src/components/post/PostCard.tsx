"use client";
import { useFilter } from "@/utils/customHooks";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function PostCard({ post }: any) {
  const customFilter = useFilter();
  return (
    <div
      key={post?._id}
      className={`w-full flex flex-col gap-8 items-center rounded 
     md:flex-row
        `}
    >
      {post.files.length > 0 ? (
        <>
          <Link
            href={`/Post/${post._id}`}
            className="w-full h-auto md:h-64 md:w-2/4 "
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${post.files}`}
              alt={customFilter.clean(post?.title)}
              className="object-cover w-full h-full rounded"
            />
          </Link>
          <div className="w-full md:w-2/4 flex flex-col gap-3">
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">
                {new Date(post?.createdAt).toDateString()}
              </span>
            </div>

            <h6 className="text-xl 2xl:text-3xl font-semibold text-black dark:text-white">
              {customFilter.clean(post?.title)}
            </h6>
            <Link
              href={`/Post/${post._id}`}
              className="flex items-center gap-2 text-black dark:text-white"
            >
              <span className="underline">Read More</span>{" "}
              <ArrowRightOutlined />
            </Link>
          </div>
        </>
      ) : (
        <>
          <Link
            href={`/Post/${post._id}`}
            className="w-full h-auto md:h-64 md:w-2/4"
          >
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 place-content-center object-cover w-full h-full rounded">
              <p className="text-white text-2xl w-8/12 mx-auto text-center">
                {customFilter.clean(post?.title)}
              </p>
            </div>
          </Link>
          <div className="w-full md:w-2/4 flex flex-col gap-3">
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">
                {new Date(post?.createdAt).toDateString()}
              </span>
            </div>

            <h6 className="text-xl 2xl:text-3xl font-semibold text-black dark:text-white">
              {customFilter.clean(post?.title)}
            </h6>
            <Link
              href={`/Post/${post._id}`}
              className="flex items-center gap-2 text-black dark:text-white"
            >
              <span className="underline">Read More</span>{" "}
              <ArrowRightOutlined />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
