import { Instrument_Serif } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import AppShell from "@/components/AppShell/AppShell";
import { getAppDashboardData } from "@/lib/app-data";
import { auth } from "@/lib/auth";
import "@/components/AppShell/AppShell.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata = {
  title: "NRMLSS App | Continuous Health Intelligence",
  description:
    "Your NRMLSS readiness, recovery, domains, labs, and coaching in one place.",
};

export default async function AppPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const data = await getAppDashboardData(session.user.id);

  return (
    <main className={instrumentSerif.variable}>
      <AppShell user={session.user} data={data} />
    </main>
  );
}
