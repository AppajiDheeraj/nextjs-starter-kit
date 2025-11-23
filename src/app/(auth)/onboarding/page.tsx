import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function OnboardingPage() {
  const { data, error } = await authClient.getSession();

  // If not logged in → redirect
  if (error || !data) {
    redirect("/sign-in");
  }

  const { user: authUser } = data;

  // Fetch DB user
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, authUser.id),
  });

  if (!currentUser) redirect("/sign-in");

  // If already completed → dashboard
  if (currentUser.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-3xl font-bold">Welcome! 🎉</h1>
      <p className="text-muted-foreground mb-6">
        Let’s set up your account.
      </p>

      <form action="/api/onboarding/complete" method="POST">
        <button
          type="submit"
          className="px-6 py-3 rounded-md bg-primary text-white"
        >
          Finish Onboarding
        </button>
      </form>
    </div>
  );
}
