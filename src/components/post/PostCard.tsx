import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <div
      key={post?._id}
      className={`w-full flex flex-col gap-8 items-center rounded 
     md:flex-row
        `}
      //  ${index / 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}
    >
      {post.files.length > 0 ? (
        <>
          <Link
            href={`/Post/${post._id}`}
            className="w-full h-auto md:h-64 md:w-2/4 "
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/uploadedFiles/${post.files}`}
              alt={post?.title}
              className="object-cover w-full h-full rounded"
            />
          </Link>
          <div className="w-full md:w-2/4 flex flex-col gap-3">
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">
                {new Date(post?.createdAt).toDateString()}
              </span>
              {/* <span className="text-sm text-rose-600 font-semibold">
            {"post?.cat"}
          </span> */}
            </div>

            <h6 className="text-xl 2xl:text-3xl font-semibold text-black dark:text-white">
              {post?.title}
            </h6>

            {/* <div className="flex-1 overflow-hidden text-gray-600 dark:text-slate-500 text-sm text-justify">
          <Markdown options={{ wrapper: "article" }}>
            {post?.desc?.slice(0, 250) + "..."}
          </Markdown>
        </div> */}

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
          <div className="w-full flex flex-col gap-3">
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">
                {new Date(post?.createdAt).toDateString()}
              </span>
              {/* <span className="text-sm text-rose-600 font-semibold">
            {"post?.cat"}
          </span> */}
            </div>

            <h6 className="text-xl 2xl:text-3xl font-semibold text-black dark:text-white">
              {post?.title}
            </h6>

            {/* <div className="flex-1 overflow-hidden text-gray-600 dark:text-slate-500 text-sm text-justify">
          <Markdown options={{ wrapper: "article" }}>
            {post?.desc?.slice(0, 250) + "..."}
          </Markdown>
        </div> */}

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
