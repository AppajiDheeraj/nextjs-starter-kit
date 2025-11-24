import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import OnboardingSteps from "@/modules/onboarding/ui/views/OnboardingSteps";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If not logged in → redirect
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { user: authUser } = session;

  // Fetch DB user
  const currentUser = await db.query.user.findFirst({
    where: eq(user.id, authUser.id),
  });

  if (!currentUser) redirect("/sign-in");

  // If already completed → dashboard
  if (currentUser.onboardingCompleted) {
    redirect("/home");
  }

  return (
    <div className="flex items-center justify-center">
      <OnboardingSteps />
    </div>
  );
}
