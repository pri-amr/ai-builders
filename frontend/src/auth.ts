import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginUser } from "@/services/session";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        try {
          const { token, user } = await loginUser(email, password);
          return { id: user.id, email: user.email, backendToken: token };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.backendToken = user.backendToken;
      }
      return token;
    },
    session: async ({ session, token }) => {
      const tokenId = token.id as string | undefined;
      const tokenBackendToken = token.backendToken as string | undefined;

      if (session.user) {
        session.user.id = tokenId ?? "";
      }
      session.backendToken = tokenBackendToken;
      return session;
    },
  },
});
