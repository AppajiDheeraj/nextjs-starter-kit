import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { user, session, account, verification } from "@/db/schema";
import { magicLink } from "better-auth/plugins";
import { eq, type InferSelectModel } from "drizzle-orm";

type User = InferSelectModel<typeof user>;
import { sendWelcomeEmail } from "@/lib/email";
import { sendMagicLinkEmail } from "@/lib/email";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbacks: {
        async onSignIn({ user: u, account }: { user: any; account: any }) {
          console.log("Google onSignIn callback triggered for email:", u.email);

          // Ensure the user object and email are valid before proceeding
          if (!u || !u.email) {
            console.error("Auth callback error: User or email is missing.");
            // Returning false will prevent the sign-in
            return false;
          }

          try {
            const foundUser = await db.query.user.findFirst({
              where: eq(user.email, u.email),
            });

            // If no user is found, it's a new sign-up
            if (!foundUser) {
              console.log(`New user detected: ${u.email}. Attempting to send welcome email.`);

              await sendWelcomeEmail({
                to: u.email,
                name: u.name ?? "there",
              });

              console.log(`Welcome email function called for ${u.email}.`);
            } else {
              console.log(`Existing user detected: ${u.email}. Skipping welcome email.`);
            }

            // Return true to allow the sign-in to proceed
            return true;

          } catch (error) {
            console.error("Error in onSignIn callback:", error);
            // Return false to prevent sign-in if an error occurs
            return false;
          }
        },

        async redirect({ user }: { user: User }) {
          // This logic remains the same
          if (!user.onboardingCompleted) return "/onboarding";
          return "/dashboard";
        },
      },
    },
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "https://fun-cattle-normally.ngrok-free.app",
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
