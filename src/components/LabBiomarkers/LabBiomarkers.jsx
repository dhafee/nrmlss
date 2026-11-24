"use client";

import { useEffect, useRef, useState } from "react";

const biomarkers = [
  {
    id: "hormones",
    title: "Hormones",
    description: "Uncover how hormones impact how you feel",
    image: "/chiron/c5.jpeg",
    markers: [
      "Cortisol",
      "Estradiol",
      "Testosterone",
      "Thyroid Stimulating Hormone (TSH)",
    ],
  },
  {
    id: "heart",
    title: "Heart health",
    description: "Connect the dots to long-term heart health",
    image: "/chiron/c1.jpeg",
    markers: [
      "Triglycerides",
      "Apolipoprotein (ApoB)",
      "Cholesterol",
      "Resting Heart Rate",
    ],
  },
  {
    id: "sleep",
    title: "Sleep",
    description: "See how recovery nights shape next-day performance",
    image: "/chiron/c4.jpeg",
    markers: ["Sleep Score", "REM Balance", "HRV Overnight", "Sleep Debt"],
  },
  {
    id: "inflammation",
    title: "Inflammation",
    description: "Track inflammation signals before they become noise",
    image: "/chiron/c3.jpeg",
    markers: ["CRP Trend", "Recovery Load", "Strain Residue", "Immune Load"],
  },
  {
    id: "fitness",
    title: "Fitness",
    description: "Measure training impact across every session and rest day",
    image: "/chiron/c2.jpeg",
    markers: ["VO2 Proxy", "Strain Score", "Readiness", "Muscle Load"],
  },
  {
    id: "metabolic",
    title: "Metabolic health",
    description: "Understand energy, glucose patterns, and metabolic resilience",
    image: "/chiron/c6.jpeg",
    markers: ["Glucose Variability", "Fasting Window", "Metabolic Load", "Energy Score"],
  },
  {
    id: "nutrients",
    title: "Nutrient status",
    description: "Spot nutrient gaps that quietly drain recovery",
    image: "/chiron/c7.jpeg",
    markers: ["Iron Status", "Vitamin D Trend", "Omega Balance", "Hydration"],
  },
  {
    id: "cognitive",
    title: "Cognitive performance",
    description: "Link focus, stress, and sleep into clearer mental readiness",
    image: "/chiron/c8.jpg",
    markers: ["Focus Score", "Stress Load", "Reaction Proxy", "Mental Fatigue"],
  },
];

export default function LabBiomarkers() {
  const [activeId, setActiveId] = useState(biomarkers[0].id);
  const trackRef = useRef(null);
  const cardRefs = useRef({});

  const scrollToCategory = (id) => {
    setActiveId(id);
    const card = cardRefs.current[id];
    const track = trackRef.current;
    if (!card || !track) return;

    track.scrollTo({
      left: card.offsetLeft - 24,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const trackLeft = track.scrollLeft;
      let closestId = biomarkers[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      biomarkers.forEach((item) => {
        const card = cardRefs.current[item.id];
        if (!card) return;
        const distance = Math.abs(card.offsetLeft - 24 - trackLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = item.id;
        }
      });

      setActiveId((current) => (current === closestId ? current : closestId));
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="lab-biomarkers">
      <div className="container">
        <div className="lab-biomarkers-header">
          <h2>Every biomarker chosen for impact</h2>
          <div className="lab-biomarker-tabs" role="tablist">
            {biomarkers.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeId === item.id}
                className={activeId === item.id ? "active" : ""}
                onClick={() => scrollToCategory(item.id)}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lab-biomarker-carousel">
        <div className="lab-biomarker-track" ref={trackRef}>
          {biomarkers.map((item) => (
            <article
              key={item.id}
              className="lab-biomarker-card"
              ref={(node) => {
                if (node) cardRefs.current[item.id] = node;
              }}
            >
              <img src={item.image} alt="" />
              <div className="lab-biomarker-card-scrim" />
              <div className="lab-biomarker-card-top">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="lab-biomarker-card-bottom">
                <p className="lab-biomarker-label">Key biomarkers</p>
                <div className="lab-biomarker-pills">
                  {item.markers.map((marker) => (
                    <span key={marker}>{marker}</span>
                  ))}
                  <span className="more">+ more</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="lab-biomarker-dots" aria-hidden="true">
        {biomarkers.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeId === item.id ? "active" : ""}
            onClick={() => scrollToCategory(item.id)}
            aria-label={`Show ${item.title}`}
          />
        ))}
      </div>
    </section>
  );
}
