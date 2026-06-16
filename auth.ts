import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import type {} from "@/types"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) token.githubAccessToken = account.access_token
      if (profile) token.githubUsername = (profile as { login: string }).login
      return token
    },
    async session({ session, token }) {
      session.githubAccessToken = token.githubAccessToken as string
      session.githubUsername = token.githubUsername as string
      return session
    },
  },
})
