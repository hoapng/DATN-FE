import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const App: React.FC = async () => {
  const session = await getServerSession(authOptions);
  return <>Hello</>;
};

export default App;
