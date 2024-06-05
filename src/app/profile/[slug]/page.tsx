import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TabsHome from "@/components/home/TabsHome";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import React from "react";

const getProfile = async (slug: string) => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/users/${slug}`,
    method: "GET",
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

const getFollowers = async (slug: string) => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/followers`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 1,
      user: slug,
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

const getFollowing = async (slug: string) => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/followers`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 1,
      createdBy: slug,
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

const getPosts = async (slug: string) => {
  const res = await sendRequest({
    url: `http://localhost:8000/api/v1/tweets`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 1,
      createdBy: slug,
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

const Profile = async ({ params }) => {
  const { slug } = params;
  const session = await getServerSession(authOptions);
  const user = await getProfile(slug);
  const followers = await getFollowers(slug);
  const following = await getFollowing(slug);
  const posts = await getPosts(slug);
  return (
    <div className="p-3 max-w-7xl mx-auto min-h-screen">
      <div className="w-full md:h-60 flex flex-col gap-5 items-center md:flex-row bg-gradient-to-r from-[#020b19] via-[#071b3e] to-[#020b19]  mt-5 mb-10 rounded-md p-5 md:px-20">
        <img
          src={user?.avatar}
          alt="Writer"
          className="w-48 h-48 rounded-full border-4 border-slate-400 object-cover"
        />
        <div className="w-full h-full flex flex-col gap-y-5 md:gap-y-8  items-center justify-center">
          <h2 className="text-white text-4xl 2xl:text-5xl font-bold">
            {user?.name}
          </h2>

          <div className="flex gap-10">
            <div className="flex flex-col items-center">
              <p className="text-gray-300 text-2xl font-semibold">
                {followers?.meta?.total ?? 0}
              </p>
              <span className="text-gray-500">Followers</span>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-gray-300 text-2xl font-semibold">
                {following?.meta?.total ?? 0}
              </p>
              <span className="text-gray-500">Following</span>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-gray-300 text-2xl font-semibold">
                {posts?.meta?.total}
              </p>
              <span className="text-gray-500">Posts</span>
            </div>
          </div>

          {/* {user?.token && (
          <div>
            {!followerIds?.includes(user?.user?._id) ? (
              <Button
                label="Follow"
                onClick={() => {}}
                styles="text-slate-800 text-semibold md:-mt-4 px-6 py-1 rounded-full bg-white"
              />
            ) : (
              <div className="flex items-center justify-center gap-2 text-white text-semibold md:-mt-4 px-6 py-1 rounded-full border">
                <span>Following</span>
                <FaUserCheck />
              </div>
            )}
          </div>
        )} */}
        </div>
      </div>
      <TabsHome profile={slug} />
    </div>
  );
};

export default Profile;
