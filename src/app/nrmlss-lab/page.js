import "./nrmlss-lab.css";
import Link from "next/link";
import { Instrument_Serif } from "next/font/google";

import LabBiomarkers from "@/components/LabBiomarkers/LabBiomarkers";
import LabFAQ from "@/components/LabFAQ/LabFAQ";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata = {
  title: "NRMLSS Lab | Continuous Health Intelligence",
  description:
    "NRMLSS Lab turns continuous wearable signals into clear, proactive health insight.",
};

const heroStats = [
  { value: "24/7", label: "Signal coverage" },
  { value: "5 streams", label: "Biometrics monitored" },
  { value: "Early", label: "Intervention window" },
];

const labPanels = [
  {
    title: "Signal processing",
    copy: "Clinical-grade pipelines across sleep, strain, stress, heart, and recovery — cleaned for care teams, not dashboards.",
  },
  {
    title: "Predictive insight",
    copy: "Trend detection that surfaces risk early, so teams act on signal before symptoms escalate.",
  },
  {
    title: "Care-ready output",
    copy: "Summaries built for clinicians and coaches — concise, actionable, and ready for protocol.",
  },
];

const labTestGroups = [
  {
    title: "Hormones & thyroid",
    count: "16 Biomarkers",
    tests: [
      "Thyroxine (T4) Free",
      "Testosterone, Total",
      "Cortisol",
      "Estradiol",
      "Thyroid Stimulating Hormone (TSH)",
      "DHEA-Sulfate",
      "Sex Hormone Binding Globulin (SHBG)",
      "Free Testosterone",
    ],
  },
  {
    title: "Cancer & other silent risks",
    count: "34 Biomarkers",
    tests: [
      "PSA",
      "Mercury",
      "Lead",
      "hs-CRP",
      "CA-125 Trend Proxy",
      "AFP Signal",
      "Environmental Toxins Panel",
      "Inflammatory Load Index",
    ],
  },
  {
    title: "Heart & metabolic",
    count: "18 Biomarkers",
    tests: [
      "LDL Small",
      "Omega-3 Total",
      "Insulin",
      "Apolipoprotein B (ApoB)",
      "Triglycerides",
      "HbA1c",
      "HDL Cholesterol",
      "Resting Heart Rate Trend",
    ],
  },
  {
    title: "Aging",
    count: "34 Biomarkers",
    tests: [
      "SHBG",
      "DHEA-Sulfate",
      "Biological Age Proxy",
      "Telomere Load Index",
      "NAD+ Pathway Score",
      "Oxidative Stress Marker",
      "Muscle Mass Trend",
      "Recovery Capacity",
    ],
  },
  {
    title: "Mental health & focus",
    count: "20 Biomarkers",
    tests: [
      "Cortisol Rhythm",
      "HRV Focus Index",
      "Sleep Debt Impact",
      "Stress Load Score",
      "Vitamin D Trend",
      "Magnesium Status",
      "Dopamine Pathway Proxy",
      "Cognitive Fatigue Index",
    ],
  },
];

export default function NrmlssLabPage() {
  return (
    <main className={`nrmlss-lab ${instrumentSerif.variable}`}>
      <section className="lab-hero">
        <div className="lab-hero-media" aria-hidden="true">
          <img src="/chiron/c8.jpg" alt="" />
          <div className="lab-hero-scrim" />
        </div>

        <div className="container lab-hero-inner">
          <div className="lab-hero-copy">
            <p className="lab-brand">NRMLSS</p>
            <span className="lab-badge">Lab / Continuous monitoring</span>
            <h1>
              <em>Know your body.</em>
            </h1>
            <p className="lab-hero-text">
              Wearable signals, clarified. NRMLSS Lab converts continuous
              biometrics into proactive insight — so you move earlier, recover
              smarter, and stay ahead of risk.
            </p>
            <div className="lab-hero-actions">
              <Link
                href="/waitlist/nrmlss-band-4?mode=preorder"
                className="lab-cta"
              >
                Preorder
              </Link>
              <Link href="/waitlist" className="lab-cta-ghost">
                Join waitlist
              </Link>
            </div>
          </div>

          <div className="lab-hero-stats">
            {heroStats.map((stat) => (
              <div className="lab-stat" key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lab-panels">
        <div className="container">
          <div className="lab-panels-header">
            <p className="lab-kicker">Inside the lab</p>
            <h2>Built for continuous health intelligence.</h2>
          </div>
          <div className="lab-panel-grid">
            {labPanels.map((panel) => (
              <article className="lab-panel" key={panel.title}>
                <h3>{panel.title}</h3>
                <p>{panel.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <LabBiomarkers />

      <section className="lab-tests">
        <div className="container">
          <div className="lab-tests-intro">
            <h2>
              100+ biomarkers <em>chosen for clinical impact</em>
            </h2>
          </div>

          <div className="lab-tests-grid">
            {labTestGroups.map((group) => (
              <article className="lab-tests-cell" key={group.title}>
                <h3>{group.title}</h3>
                <p className="lab-tests-count">
                  <span aria-hidden="true">✦</span>
                  {group.count}
                </p>
                <ul>
                  {group.tests.map((test) => (
                    <li key={test}>{test}</li>
                  ))}
                </ul>
              </article>
            ))}

            <Link
              href="/waitlist/nrmlss-band-4?mode=preorder"
              className="lab-tests-cell lab-tests-cta"
            >
              <em>+ More</em>
              <strong>All-in-one continuous testing</strong>
              <span>Preorder NRMLSS Band 4</span>
            </Link>
          </div>
        </div>
      </section>

      <LabFAQ />

      <section className="lab-close">
        <div className="container lab-close-inner">
          <h2>Reserve early access to NRMLSS Lab.</h2>
          <p>
            Preorder hardware for priority fulfillment, or join the waitlist for
            launch updates.
          </p>
          <Link href="/waitlist/nrmlss-band-4?mode=preorder" className="lab-cta">
            Preorder Band 4
          </Link>
        </div>
      </section>
    </main>
  );
}
