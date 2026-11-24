"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How many biomarkers are included in each Specialized Panel?",
    answer:
      "Each Specialized Panel focuses on a clinical domain with a curated set of continuous and lab-derived markers — typically 8–16 high-signal biomarkers chosen for actionable insight, not noise.",
  },
  {
    question: "What additional biomarkers are tested for in Specialized Panels?",
    answer:
      "Depending on the panel, you may see deeper coverage across hormones, thyroid, metabolic risk, inflammation, nutrient status, and cognitive load — layered on top of your core NRMLSS Band streams.",
  },
  {
    question: "How do I get NRMLSS Advanced Labs?",
    answer:
      "Preorder NRMLSS Band 4 for priority access, then activate Advanced Labs from your account once your kit ships. Waitlist members are notified as capacity opens.",
  },
  {
    question: "What biomarkers are included in NRMLSS Advanced Labs?",
    answer:
      "Advanced Labs expands beyond continuous wearables into 100+ biomarkers spanning hormones & thyroid, heart & metabolic, aging, mental health, and silent risk panels.",
  },
  {
    question: "What is NRMLSS Advanced Labs and how is it different?",
    answer:
      "Advanced Labs pairs continuous wearable signals with deeper lab panels so trends are contextualized — not a one-off blood draw, and not raw sensor noise.",
  },
  {
    question: "How does it work?",
    answer:
      "Wear the band for always-on biometrics. When you add Advanced Labs, schedule a draw, results sync into NRMLSS Lab, and insights update as new signals arrive.",
  },
  {
    question: "Why combine blood testing with NRMLSS?",
    answer:
      "Wearables catch day-to-day change. Labs ground those patterns in clinical markers. Together they surface earlier intervention windows with clearer next steps.",
  },
  {
    question: "What do I get after taking a lab test?",
    answer:
      "Structured results in NRMLSS Lab, plain-language summaries, trend context against your continuous data, and care-ready outputs for clinicians or coaches.",
  },
  {
    question: "Where do I go to get tested?",
    answer:
      "You’ll choose a partner lab or at-home collection option in your region during checkout. Scheduling and instructions live in the NRMLSS app.",
  },
  {
    question: "Who views my results?",
    answer:
      "You control access. Results stay in your account by default. You can share care-ready summaries with a clinician or coach when you choose.",
  },
  {
    question: "How quickly will I get my results?",
    answer:
      "Most panels return within a few business days after collection. Continuous wearable insights update in near real time as soon as your band is paired.",
  },
];

export default function LabFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="lab-faq">
      <div className="container">
        <h2 className="lab-faq-title">Frequently asked questions</h2>
        <div className="lab-faq-list">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                className={`lab-faq-item${isOpen ? " is-open" : ""}`}
                key={item.question}
              >
                <button
                  type="button"
                  className="lab-faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setOpenIndex((current) => (current === index ? null : index))
                  }
                >
                  <span>{item.question}</span>
                  <svg
                    className="lab-faq-chevron"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 5L7 9.5L11.5 5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className="lab-faq-panel"
                  role="region"
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
