import { sendRequest } from "@/utils/api";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { clean, cleanCustom } from "@/utils/filter";
import BlogDetails from "@/components/post/BlogDetails";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/authOptions";

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
    const [title, content] = await Promise.all([
      await clean(res.data.title),
      await clean(res.data.content),
    ]);

    return {
      ...res.data,
      title: title,
      content: content,
    };
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

  if (res.data.result) {
    return await Promise.all(
      res.data.result?.map(async (x: any) => {
        return {
          ...x,
          title: await clean(x.title),
        };
      })
    );
  }
};

async function AsyncPage({ slug }: any) {
  const [session, post, samePosts] = await Promise.all([
    getServerSession(authOptions),
    getData(slug),
    getSamePosts(slug),
  ]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BlogDetails
        session={session}
        post={post}
        samePosts={samePosts}
        slug={slug}
      />
    </Suspense>
  );
}

export default function Page({ params }: any) {
  const { slug } = params;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AsyncPage slug={slug} />
    </Suspense>
  );
}
