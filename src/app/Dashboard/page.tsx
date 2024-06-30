import { redirect } from "next/navigation";

export default async function Dashboard() {
  return redirect("/Dashboard/Posts");
}
