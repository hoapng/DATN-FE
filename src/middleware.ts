export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/CreatePost", "/EditPost", "/Market/Create", "/Dashboard/:path*"],
};
