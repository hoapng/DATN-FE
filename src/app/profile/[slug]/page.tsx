import { Avatar } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import Post from "@/components/post/Post";
import { sendRequest } from "@/utils/api";

const Profile: React.FC = async () => {
  const user = await sendRequest({
    url: "http://localhost:8000/api/v1/users/66010ee0ad519e20b635c6e9",
    method: "GET",
  });
  console.log(user);
  return (
    <>
      <Avatar
        size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
        icon={<AntDesignOutlined />}
      />
      <Post />
      <Post />
    </>
  );
};

export default Profile;
