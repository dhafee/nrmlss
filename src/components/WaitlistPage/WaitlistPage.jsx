"use client";
import "@/app/waitlist/waitlist.css";
import Link from "next/link";
import { useState } from "react";

import Copy from "@/components/Copy/Copy";
import {
  getWaitlistProductHref,
  waitlistProducts,
} from "@/data/waitlistProducts";

export default function WaitlistPage({ product, initialMode = "waitlist" }) {
  const [email, setEmail] = useState("");
  const [accessMode, setAccessMode] = useState(initialMode);
  const [submitted, setSubmitted] = useState(false);

  const otherProduct = waitlistProducts.find((item) => item.id !== product.id);
  const isPreorder = accessMode === "preorder";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <main className="waitlist-page">
      <section className="waitlist-hero">
        <div className="container">
          <Copy animateOnScroll={false} delay={0.2}>
            <p className="waitlist-eyebrow">NRMLSS Waitlist</p>
            <h1>Join the waitlist for {product.name}.</h1>
          </Copy>
          <Copy animateOnScroll={false} delay={0.35}>
            <p className="bodyCopy waitlist-hero-copy">
              Reserve your spot and get notified when {product.name} becomes
              available in your region — or preorder for priority fulfillment.
            </p>
          </Copy>
        </div>
      </section>

      <section className="waitlist-product-shell">
        <div className="container waitlist-product-grid">
          <div className="waitlist-showcase">
            <div className="waitlist-showcase-frame">
              <img src={product.image} alt={product.name} />
              <div className="waitlist-showcase-meta">
                <p>{product.name}</p>
                <p>{product.price}</p>
              </div>
            </div>

            <div className="waitlist-showcase-copy">
              <p className="waitlist-kicker">NRMLSS hardware</p>
              <h2>{product.name}</h2>
              <p className="waitlist-lead">{product.description}</p>

              <div className="waitlist-feature-cards">
                {product.features.map((feature) => (
                  <div key={feature.title}>
                    <p className="waitlist-access-title">{feature.title}</p>
                    <p>{feature.copy}</p>
                  </div>
                ))}
              </div>

              {otherProduct ? (
                <Link
                  href={getWaitlistProductHref(otherProduct.id)}
                  className="waitlist-switch"
                >
                  View {otherProduct.name}
                </Link>
              ) : null}
            </div>
          </div>

          <aside className="waitlist-signup">
            {submitted ? (
              <div className="waitlist-success">
                <p className="waitlist-kicker light">Confirmed</p>
                <h2>
                  {isPreorder
                    ? "Priority preorder reserved."
                    : "You're on the list."}
                </h2>
                <p>
                  {isPreorder
                    ? `We'll follow up with next steps for your ${product.name} priority preorder.`
                    : `We'll email you when ${product.name} opens for early access.`}
                </p>
                <Link href="/" className="waitlist-secondary-btn">
                  Back to home
                </Link>
              </div>
            ) : (
              <form className="waitlist-form" onSubmit={handleSubmit}>
                <p className="waitlist-kicker light">Access options</p>
                <h2>
                  {isPreorder ? "Priority preorder" : "Reserve early access"}
                </h2>

                <div className="waitlist-mode-toggle" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={!isPreorder}
                    className={!isPreorder ? "active" : ""}
                    onClick={() => setAccessMode("waitlist")}
                  >
                    Waitlist
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isPreorder}
                    className={isPreorder ? "active" : ""}
                    onClick={() => setAccessMode("preorder")}
                  >
                    Priority preorder
                  </button>
                </div>

                <p className="waitlist-form-intro">
                  {isPreorder ? (
                    <>
                      Lock priority shipment for{" "}
                      <strong>{product.name}</strong> with a{" "}
                      <strong>{product.deposit}</strong> deposit. Applied to
                      your final purchase.
                    </>
                  ) : (
                    <>
                      Enter your email to secure a free waitlist spot for{" "}
                      <strong>{product.name}</strong>.
                    </>
                  )}
                </p>

                <label className="waitlist-field">
                  <span>Email address</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>

                {isPreorder ? (
                  <div className="waitlist-deposit-note">
                    <span>Deposit due today</span>
                    <strong>{product.deposit}</strong>
                  </div>
                ) : null}

                <button type="submit" className="waitlist-submit">
                  {isPreorder
                    ? `Preorder · ${product.deposit}`
                    : "Join waitlist"}
                </button>

                <p className="waitlist-disclaimer">
                  {isPreorder
                    ? "Deposit is refundable before launch. Final pricing confirmed at checkout."
                    : "Product updates only. Unsubscribe anytime."}
                </p>
              </form>
            )}
          </aside>
        </div>
      </section>

    </main>
  );
}
