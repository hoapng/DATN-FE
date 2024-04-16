import { Avatar, Card } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import Post from "@/components/post/Post";
import { sendRequest } from "@/utils/api";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Meta from "antd/es/card/Meta";

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "UserName",
    children: "Zhou Maomao",
  },
  {
    key: "2",
    label: "Email",
    children: "1810000000",
  },
  // {
  //   key: "3",
  //   label: "Email",
  //   children: "Hangzhou, Zhejiang",
  // },
  // {
  //   key: "4",
  //   label: "Remark",
  //   children: "empty",
  // },
  // {
  //   key: "5",
  //   label: "Address",
  //   children: "No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China",
  // },
];

const Profile: React.FC = async (props: any) => {
  const session = await getServerSession(authOptions);
  const user = await sendRequest({
    url: `http://localhost:8000/api/v1/users/${props.params.slug}`,
    method: "GET",
  });
  const bookmarks = await sendRequest({
    url: `http://localhost:8000/api/v1/bookmarks`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 5,
      createdBy: session?.user._id,
      populate: "tweet,tweet.createdBy",
      fields:
        "tweet.createdBy._id,tweet.createdBy.name,tweet.createdBy.email,tweet.createdBy.avatar",
    },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });
  const tweets = bookmarks.data.result.map((bookmark) => bookmark.tweet);
  return (
    <>
      <Post tweets={tweets} />
    </>
  );
};

export default Profile;
