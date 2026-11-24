import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import AuthForm from "@/components/AuthForm/AuthForm";
import { auth } from "@/lib/auth";
import "../auth.css";

export const metadata = {
  title: "Sign in | NRMLSS",
  description: "Sign in to your NRMLSS health app.",
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/app");
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          NRMLSS
        </Link>
        <p className="auth-kicker">App access</p>
        <h1>Sign in</h1>
        <p className="auth-lead">
          Continue to readiness, recovery, domains, labs, and coaching.
        </p>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
