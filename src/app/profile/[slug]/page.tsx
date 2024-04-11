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
  const tweets = await sendRequest({
    url: `http://localhost:8000/api/v1/tweets`,
    method: "GET",
    queryParams: {
      current: 1,
      pageSize: 5,
      createdBy: props.params.slug,
      populate: "createdBy",
      fields:
        "createdBy._id, createdBy.name, createdBy.email, createdBy.avatar",
    },
  });
  return (
    <>
      <Card style={{ padding: "auto", justifyItems: "center" }}>
        <Meta
          avatar={
            <Avatar
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
              icon={<AntDesignOutlined />}
              src={user?.data?.avatar}
            />
          }
          title={
            <>
              <p>{user?.data?.name}</p>
              <p className="font-light text-sm">{user?.data?.email}</p>
            </>
          }
        />
      </Card>
      <Post tweets={tweets?.data?.result} />
    </>
  );
};

export default Profile;
