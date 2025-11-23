import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { magicLink } from "better-auth/plugins";
import { sendMagicLinkEmail } from "@/lib/email";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "https://fun-cattle-normally.ngrok-free.app", // Replace with your actual production URL
  ],
  appName: "Money Matters",
   plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        console.log("📩 Sending BetterAuth magic link:", url);
        await sendMagicLinkEmail({
          to: email,
          magicLink: url,
        });
      },
    }),
   ],
});
