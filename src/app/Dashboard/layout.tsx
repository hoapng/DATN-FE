import DashSidebar from "@/components/dashboard/DashSidebar";
import { getServerSession } from "next-auth";
import authOptions from "../api/authOptions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session?.user.role === "admin")
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-56">
          {/* Sidebar */}
          <DashSidebar />
        </div>

        {children}
      </div>
    );
  else return redirect("/");
}
