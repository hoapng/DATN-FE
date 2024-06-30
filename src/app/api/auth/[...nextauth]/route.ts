import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { NextApiRequest, NextApiResponse } from "next";
import { sendRequest } from "@/utils/api";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  secret: process.env.NO_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      if (trigger === "signIn" && account?.provider !== "credentials") {
        const res = await sendRequest<IBackendRes<JWT>>({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/provider`,
          method: "POST",
          body: {
            name: user.name,
            email: user.email,
            image: user.image,
          },
        });
        if (res.data) {
          token.access_token = res.data.access_token;
          token.refresh_token = res.data.refresh_token;
          token.user = res.data.user;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      if (token) {
        session.access_token = token.access_token;
        session.refresh_token = token.refresh_token;
        session.user = token.user;
      }
      return session;
    },
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, authOptions);
};

export { handler as GET, handler as POST };
