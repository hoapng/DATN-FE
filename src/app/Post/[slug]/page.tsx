import ImagePost from "@/components/post/ImagePost";
import CommentSection from "@/components/post/PostComments";
import ReactPost from "@/components/post/ReactPost";
import SamePost from "@/components/post/SamePost";
import { sendRequest } from "@/utils/api";
import { Badge, Button } from "flowbite-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Filter from "bad-words";
import DeletePost from "./DeletePost";
import authOptions from "@/app/api/authOptions";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { clean } from "@/utils/filter";

const getData = async (slug: string) => {
  const res = (await sendRequest({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tweets/${slug}`,
    method: "GET",
    queryParams: {
      populate: "createdBy",
    },
    nextOption: {
      cache: "no-store",
    },
    // headers: {
    //   Authorization: `Bearer ${session?.access_token}`,
    // },
  })) as any;
  if (res.data) {
    return res.data;
  }
};

const getSamePosts = async (slug: string) => {
  const res = (await sendRequest({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tweets/recommend/${slug}`,
    method: "GET",
    queryParams: {
      sort: "-updatedAt",
      type: "News,Review,Tips",
    },
    nextOption: {
      cache: "no-store",
    },
    // headers: {
    //   Authorization: `Bearer ${session?.access_token}`,
    // },
  })) as any;

  if (res.data) {
    return res.data;
  }
};

const BlogDetails = async ({ params }: any) => {
  const { slug } = params;

  const [session, post, samePosts] = await Promise.all([
    getServerSession(authOptions),
    getData(slug),
    getSamePosts(slug),
  ]);

  return (
    <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
      <div className="w-full flex flex-col md:flex-row gap-2 gap-y-5 items-center">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
            {await clean(post?.title)}
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
                __html: await clean(post?.content),
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
          {samePosts?.result?.map((post: string, id: number) => {
            return <SamePost post={post} key={id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default function Page({ params }: any) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlogDetails params={params} />
    </Suspense>
  );
}
