export const waitlistProducts = [
  {
    id: "nrmlss-band-4",
    name: "NRMLSS Band 4",
    price: "From $349",
    deposit: "$49",
    image: "/chiron/c1.jpeg",
    description:
      "Continuous health monitoring with advanced recovery insights, built for everyday performance.",
    features: [
      {
        title: "24/7 signals",
        copy: "Round-the-clock biometric capture for sleep, strain, and recovery.",
      },
      {
        title: "Recovery insights",
        copy: "Actionable guidance that turns daily wear into clearer performance decisions.",
      },
      {
        title: "Adaptive coaching",
        copy: "AI coaching that adjusts daily priorities based on readiness and load.",
      },
      {
        title: "Secure sync",
        copy: "Encrypted cloud sync across devices so your insights stay private and portable.",
      },
    ],
  },
  {
    id: "nrmlss-band-ceramic",
    name: "NRMLSS Band Ceramic",
    price: "$399",
    deposit: "$79",
    image: "/chiron/c9.png",
    description:
      "Premium ceramic finish with the same clinical-grade signal stack, designed for all-day wear.",
    features: [
      {
        title: "Ceramic build",
        copy: "Refined all-day comfort with a durable, premium ceramic finish.",
      },
      {
        title: "Clinical signal stack",
        copy: "Same high-fidelity biometric processing as Band 4, built for continuous wear.",
      },
      {
        title: "All-day comfort",
        copy: "Lightweight profile engineered for uninterrupted wear across sleep and training.",
      },
      {
        title: "Precision sensing",
        copy: "Stable contact and cleaner signal quality for more reliable health trends.",
      },
    ],
  },
];

export function getWaitlistProduct(id) {
  return waitlistProducts.find((product) => product.id === id);
}

export function getWaitlistProductHref(id) {
  return `/waitlist/${id}`;
}
