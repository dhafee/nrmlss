import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import AuthForm from "@/components/AuthForm/AuthForm";
import { auth } from "@/lib/auth";
import "../auth.css";

export const metadata = {
  title: "Create account | NRMLSS",
  description: "Create your NRMLSS account.",
};

export default async function SignupPage() {
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
        <p className="auth-kicker">Get started</p>
        <h1>Create account</h1>
        <p className="auth-lead">
          Set up your NRMLSS profile to unlock the continuous health app.
        </p>
        <AuthForm mode="signup" />
      </div>
    </main>
  );
}
