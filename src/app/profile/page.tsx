import { Avatar } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import Post from "@/components/post/Post";

const Profile: React.FC = () => {
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
