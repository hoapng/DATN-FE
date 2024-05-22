import ImagePost from "@/components/post/ImagePost";
import ReactPost from "@/components/post/ReactPost";
import SamePost from "@/components/post/SamePost";
import { sendRequest } from "@/utils/api";
import { Badge } from "flowbite-react";
import Link from "next/link";

const getData = async (slug: string) => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/tweets/${slug}`,
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
  });

  if (res.data) {
    return res.data;
  }
};

const getSamePosts = async (slug: string) => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/tweets/recommend/${slug}`,
    method: "GET",
    // queryParams: {
    //   populate: "createdBy",
    // },
    nextOption: {
      cache: "no-store",
    },
    // headers: {
    //   Authorization: `Bearer ${session?.access_token}`,
    // },
  });

  if (res.data) {
    return res.data;
  }
};

const BlogDetails = async ({ params }) => {
  const { slug } = params;

  const post = await getData(slug);

  const SamePosts = await getSamePosts(slug);

  return (
    <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
      <div className="w-full flex flex-col md:flex-row gap-2 gap-y-5 items-center">
        <div className="w-full md:w-1/2 flex flex-col gap-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
            {post?.title}
          </h1>

          <div className="w-full flex flex-wrap gap-2 items-center ">
            {/* {post?.hashtags?.map((hashtag: string, index: number) => (
              <Badge key={index} color="indigo" size="sm">
                {hashtag}
              </Badge>
            ))} */}
            <ReactPost post={post} />
          </div>

          <Link href={`/Profile/${post?.user?._id}`} className="flex gap-3">
            <img
              src={post?.createdBy?.avatar}
              alt={post?.createdBy?.name}
              className="object-cover w-12 h-12  rounded-full"
            />
            <div className="">
              <p className="text-slate-800 dark:text-white font-medium">
                {post?.createdBy?.name}
              </p>
              <span className="text-slate-600">
                {new Date(post?.createdAt).toDateString()}
              </span>
            </div>
          </Link>
        </div>
        <ImagePost files={post?.files} />
      </div>

      <div className="w-full flex flex-col md:flex-row gapx-10 2xl:gap-x-28 mt-10">
        {/* LEFT */}
        <div className="w-full md:w-2/3 flex flex-col text-black dark:text-gray-500 ">
          {/* {post?.content} */}
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />

          {/* COMMENTS SECTION */}
          {/* <div className='w-full'>{<PostComments postId={id} />}</div> */}
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/4 flex flex-col gap-y-12">
          {/* SAME POSTS */}
          <p className="text-xl font-bold -mb-3 text-gray-600 dark:text-slate-500">
            Bài viết liên quan
          </p>
          {SamePosts.map((post, id) => (
            <SamePost post={post} key={id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
