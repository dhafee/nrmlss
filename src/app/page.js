"use client";
import "./home.css";
import Link from "next/link";
import { useRef } from "react";

import GenesisSection from "@/components/GenesisSection/GenesisSection";
import {
  getWaitlistProductHref,
  waitlistProducts,
} from "@/data/waitlistProducts";

export default function Index() {
  const heroTabs = ["Cardio", "Recovery", "Sleep", "Stress"];
  const featuredProducts = waitlistProducts
    .filter((product) => product.id === "nrmlss-band-ceramic")
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    }));
  const healthInsights = [
    {
      title: "Quantify how your body is feeling",
      image: "/chiron/n1.png",
    },
    {
      title: "Extend your prime for years to come",
      image: "/chiron/n2.png",
    },
    {
      title: "Optimize your sleep",
      image: "/chiron/n3.png",
    },
    {
      title: "Measure the impact of every step and rep",
      image: "/chiron/n4.png",
    },
    {
      title: "Track stress and recovery in real time",
      image: "/chiron/n5.png",
    },
  ];
  const insightsTrackRef = useRef(null);

  const scrollInsights = (direction) => {
    const track = insightsTrackRef.current;
    if (!track) return;

    const card = track.querySelector(".chiron-insight-card");
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
    const scrollAmount = card ? card.offsetWidth + gap : 320;

    track.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  const metrics = [
    {
      value: "24/7",
      title: "Continuous Intelligence",
      description:
        "Not just tracking—NRMLSS builds a real-time understanding of your body, recovery, and daily performance.",
      accent: "#5b8cff",
    },
    {
      value: "AI",
      title: "Personal Intelligence Engine",
      description:
        "An AI that analyzes sleep, stress, recovery, activity, and lifestyle to deliver actionable guidance—not raw data.",
      accent: "#a86bff",
    },
    {
      value: "Predictive",
      title: "Health & Performance",
      description:
        "Detect trends before they become problems with proactive insights designed to help you recover, focus, and perform.",
      accent: "#ff6b4a",
    },
    {
      value: "One Ecosystem",
      title: "Health. Performance. Recovery.",
      description:
        "Unify sleep, strain, stress, and recovery in one connected platform built for whole-person health.",
      accent: "#8f9aa8",
    },
    {
      value: "AI Coach",
      title: "Guided Performance Coaching",
      description:
        "Personalized coaching that turns your biometrics into daily actions for better recovery, focus, and performance.",
      accent: "#f0a43a",
    },
  ];

  return (
    <main className="chiron-home">
      <section className="chiron-hero">
        <div className="container">
          <div className="chiron-hero-shell">
            <div className="chiron-hero-top">
              <div className="chiron-top-left">
                <span className="chiron-icon-chip">NR</span>
                <span className="chiron-menu-chip">...</span>
              </div>
              <button className="chiron-mini-btn">Book demo</button>
            </div>

            <div className="chiron-hero-content">
              <div className="chiron-hero-copy">
                <p className="chiron-eyebrow">
                  AI-Powered Wearable Health Platform
                </p>
                <h1>
                  <span className="chiron-headline-line">Unlock Peak</span>
                  <span className="chiron-headline-line">Human Performance</span>
                </h1>
                <p className="bodyCopy chiron-subtext">
                  NRMLSS turns continuous wearable data into actionable health
                  insights — so you train smarter, recover faster, and stay
                  ahead of risk.
                </p>
              </div>

              <div className="chiron-hero-side">
                <div className="chiron-kpi">
                  <p>Patients monitored this month</p>
                  <h4>+40k</h4>
                </div>
                <div className="chiron-hero-card">
                  <div className="chiron-product-media">
                    <p className="chiron-media-caption">Time to pause.</p>
                    <div className="chiron-media-overlay">
                      <div className="chiron-media-stat">
                        <span>Readiness</span>
                        <strong>92%</strong>
                      </div>
                      <div className="chiron-media-stat">
                        <span>Resting HR</span>
                        <strong>61 bpm</strong>
                      </div>
                      <div className="chiron-media-stat">
                        <span>Sleep Score</span>
                        <strong>87</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="chiron-hero-bottom">
              <div className="chiron-tab-row">
                {heroTabs.map((tab, index) => (
                  <button
                    key={tab}
                    className={`chiron-pill ${index === 0 ? "active" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <p className="chiron-bottom-copy">
                Predictive alerting and care-ready summaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="chiron-featured">
        <div className="container">
          <div className="chiron-featured-grid chiron-featured-grid--single">
            {featuredProducts.map((product) => (
              <article
                key={product.name}
                className="chiron-featured-card chiron-featured-card--single"
                style={{ backgroundImage: `url(${product.image})` }}
              >
                <span className="chiron-featured-badge">Out of Stock</span>
                <div className="chiron-featured-card-footer">
                  <div className="chiron-featured-card-copy">
                    <h3>{product.name}</h3>
                    <p>{product.price}</p>
                  </div>
                  <div className="chiron-featured-card-actions">
                    <Link
                      href={getWaitlistProductHref(product.id)}
                      className="chiron-featured-btn ghost"
                    >
                      Explore
                    </Link>
                    <Link
                      href={`${getWaitlistProductHref(product.id)}?mode=preorder`}
                      className="chiron-featured-btn solid"
                    >
                      Preorder
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="chiron-insights">
        <div className="container chiron-insights-header">
          <h2>Get a complete picture of your health</h2>
          <p className="bodyCopy chiron-insights-copy">
            With 24/7 monitoring across sleep, strain, stress, and heart health,
            NRMLSS gives you a complete view of your health — so you can make
            smarter decisions every day.
          </p>
        </div>

        <div className="chiron-insights-carousel">
          <div className="chiron-insights-track" ref={insightsTrackRef}>
            {healthInsights.map((item) => (
              <article key={item.title} className="chiron-insight-card">
                <img src={item.image} alt={item.title} />
                <h3>{item.title}</h3>
                <button
                  className="chiron-insight-expand"
                  aria-label={`Learn more about ${item.title}`}
                >
                  +
                </button>
              </article>
            ))}
          </div>
          <button
            className="chiron-insights-nav"
            onClick={() => scrollInsights(1)}
            aria-label="Next insight"
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="container chiron-insights-cta-wrap">
          <button className="chiron-insights-cta">Join Now</button>
        </div>
      </section>

      <section className="chiron-metrics">
        <div className="chiron-metrics-liquid" aria-hidden="true">
          <span className="chiron-liquid-blob blob-1" />
          <span className="chiron-liquid-blob blob-2" />
          <span className="chiron-liquid-blob blob-3" />
        </div>
        <div className="container">
          <div className="chiron-metrics-header">
            <h2>Built for continuous monitoring at scale</h2>
            <p className="bodyCopy chiron-metrics-copy">
              Clinical-grade signal processing across every biometric stream —
              so care teams act on insight, not noise.
            </p>
          </div>
          <div className="chiron-metric-grid">
            {metrics.map((item) => (
              <article
                className="chiron-metric-card"
                key={item.title}
                style={{ "--card-accent": item.accent }}
              >
                <h4 className="chiron-metric-value">{item.value}</h4>
                <div className="chiron-metric-card-body">
                  <p className="chiron-metric-title">{item.title}</p>
                  {item.description ? (
                    <p className="bodyCopy chiron-metric-desc">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GenesisSection />

      <section className="chiron-proof">
        <div className="container chiron-proof-inner">
          <p className="chiron-eyebrow">Trusted By Digital Health Teams</p>
          <h4>
            "NRMLSS gave our care managers a proactive signal layer we never had
            before. We now intervene days earlier."
          </h4>
          <p>Head of Virtual Care / Northlight Health Network</p>
        </div>
      </section>

      <section className="chiron-cta">
        <div className="container chiron-cta-inner">
          <h3>Design The Future Of Preventive Care With NRMLSS</h3>
          <p className="bodyCopy">
            Launch pilots in weeks, connect wearable streams securely, and
            empower teams with clinically aligned AI insights.
          </p>
          <div className="chiron-actions">
            <button className="primary">Schedule Platform Walkthrough</button>
            <Link href="/" className="chiron-link-btn">
              Explore API & Integrations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
