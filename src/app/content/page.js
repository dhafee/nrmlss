import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import IgPostCard from "@/components/IgPostCard/IgPostCard";
import { auth } from "@/lib/auth";
import "./content.css";

export const metadata = {
  title: "Content Studio | NRMLSS",
  description: "Private Instagram post templates for NRMLSS.",
  robots: {
    index: false,
    follow: false,
  },
};

const posts = [
  {
    id: "know-your-body",
    label: "Brand",
    eyebrow: "",
    headline: "Know your body.",
    accent: "Then move earlier.",
    footer: "Wearables · Labs · Coach",
    caption:
      "Know your body.\n\nNRMLSS turns continuous signals into clear next steps — so you recover smarter and stay ahead of risk.\n\n#NRMLSS #KnowYourBody",
  },
  {
    id: "depth",
    label: "Positioning",
    eyebrow: "",
    headline: "Depth without noise.",
    accent: "Wearables + labs. Connected.",
    footer: "Health intelligence",
    caption:
      "Depth without noise.\n\nWearables catch the day. Labs ground the trend. NRMLSS connects both.\n\n#NRMLSS #HealthIntelligence",
  },
  {
    id: "clarity",
    label: "Clarity",
    eyebrow: "",
    headline: "Less data.",
    accent: "More direction.",
    footer: "Continuous health intelligence",
    caption:
      "Less data. More direction.\n\nNRMLSS clarifies wearable signals so you know what to do next — not what to stare at.\n\n#NRMLSS #HealthTech",
  },
  {
    id: "readiness",
    label: "Today",
    eyebrow: "Today",
    headline: "Readiness 92%",
    accent: "Push or protect?",
    footer: "Sleep · Strain · Stress · Recovery",
    caption:
      "Readiness 92%.\n\nA daily decision layer for sleep, strain, stress, and recovery — not another dashboard.\n\n#NRMLSS #Readiness #Performance",
  },
  {
    id: "recovery",
    label: "Recovery",
    eyebrow: "Overnight",
    headline: "Recovery told you first.",
    accent: "Listen before the crash.",
    footer: "HRV · Resting HR · Sleep debt",
    caption:
      "Recovery told you first.\n\nNRMLSS turns overnight recovery into a clearer next-day plan.\n\n#NRMLSS #Recovery",
  },
  {
    id: "lab",
    label: "Labs",
    eyebrow: "Advanced Labs",
    headline: "100+ biomarkers",
    accent: "chosen for clinical impact",
    footer: "Hormones · Heart · Metabolic · Focus",
    caption:
      "100+ biomarkers. Chosen for clinical impact.\n\nAdvanced Labs pairs Band signals with deeper panels — so trends have ground truth.\n\n#NRMLSS #Lab #Biomarkers",
  },
  {
    id: "band-4",
    label: "Hardware",
    eyebrow: "Hardware",
    headline: "NRMLSS Band 4",
    accent: "Always measuring.",
    footer: "From $349 · Preorder open",
    caption:
      "NRMLSS Band 4.\n\nContinuous monitoring. Clinical clarity. Built for everyday performance.\n\nFrom $349 · Preorder now.\n\n#NRMLSS #Band4",
  },
  {
    id: "waitlist",
    label: "CTA",
    eyebrow: "Early access",
    headline: "Reserve your Band.",
    accent: "Priority fulfillment starts now.",
    footer: "Preorder · Join waitlist",
    caption:
      "Early access is open.\n\nPreorder Band 4 for priority fulfillment — or join the waitlist for launch updates.\n\nLink in bio.\n\n#NRMLSS #Preorder",
  },
  {
    id: "coach",
    label: "Coach",
    eyebrow: "Coach",
    headline: "Not more charts.",
    accent: "A clearer next move.",
    footer: "Adaptive guidance",
    caption:
      "Not more charts. A clearer next move.\n\nNRMLSS Coach turns readiness, recovery, and labs into guidance you can act on today.\n\n#NRMLSS #Coach",
  },
  {
    id: "care",
    label: "Care share",
    eyebrow: "Care",
    headline: "Share the signal.",
    accent: "Keep your clinician in the loop.",
    footer: "Secure · Opt-in · Readable",
    caption:
      "Share the signal.\n\nNRMLSS Care Share lets you bring continuous context to your clinician — without the spreadsheet dump.\n\n#NRMLSS #Care",
  },
  {
    id: "ceramic",
    label: "Edition",
    eyebrow: "Limited",
    headline: "Ceramic Band.",
    accent: "Quiet on the wrist.",
    footer: "Same continuous stack",
    caption:
      "Ceramic Band.\n\nA quieter finish. Same continuous health stack.\n\nLimited edition — details in bio.\n\n#NRMLSS #Ceramic",
  },
  {
    id: "how-it-works",
    label: "Carousel · How it works",
    caption:
      "How NRMLSS works.\n\n1. Wear the Band\n2. Continuous signals sync\n3. Labs ground the trend\n4. Coach gives the next move\n\nSwipe through.\n\n#NRMLSS #HowItWorks",
    slides: [
      {
        eyebrow: "01",
        headline: "Wear the Band.",
        accent: "Always on.",
        footer: "Sleep · Strain · Stress · Heart",
      },
      {
        eyebrow: "02",
        headline: "Signals sync.",
        accent: "Clarity, not clutter.",
        footer: "Readiness updated daily",
      },
      {
        eyebrow: "03",
        headline: "Add Advanced Labs.",
        accent: "Clinical ground truth.",
        footer: "100+ biomarkers",
      },
      {
        eyebrow: "04",
        headline: "Act earlier.",
        accent: "Coach-ready next steps.",
        footer: "Recover · Focus · Perform",
      },
    ],
  },
  {
    id: "domains-carousel",
    label: "Carousel · Domains",
    caption:
      "Every domain. Chosen for impact.\n\nHormones. Heart. Sleep. Metabolic. Inflammation. Focus.\n\nNRMLSS Lab connects continuous signals to the markers that matter.\n\n#NRMLSS #Lab #Domains",
    slides: [
      {
        eyebrow: "Domains",
        headline: "Hormones",
        accent: "How you feel starts here.",
        footer: "Cortisol · TSH · Testosterone",
      },
      {
        eyebrow: "Domains",
        headline: "Heart health",
        accent: "Long-term signal.",
        footer: "ApoB · Triglycerides · Resting HR",
      },
      {
        eyebrow: "Domains",
        headline: "Sleep",
        accent: "Nights shape performance.",
        footer: "Sleep Score · REM · Sleep Debt",
      },
      {
        eyebrow: "Domains",
        headline: "Metabolic",
        accent: "Energy with context.",
        footer: "Glucose · Insulin · HbA1c",
      },
      {
        eyebrow: "Domains",
        headline: "Inflammation",
        accent: "Quiet risk, made visible.",
        footer: "hs-CRP · Ferritin",
      },
      {
        eyebrow: "Domains",
        headline: "Focus",
        accent: "Cognitive load, tracked.",
        footer: "Stress · Sleep · Nutrients",
      },
    ],
  },
  {
    id: "why-nrmlss",
    label: "Carousel · Why NRMLSS",
    caption:
      "Why NRMLSS.\n\nNot another tracker.\nNot a one-off blood draw.\nA continuous health layer — wearables + labs + coaching.\n\n#NRMLSS #HealthIntelligence",
    slides: [
      {
        eyebrow: "Why",
        headline: "Not another tracker.",
        accent: "A decision layer.",
        footer: "Built for action",
      },
      {
        eyebrow: "Why",
        headline: "Not a one-off lab.",
        accent: "Trends over time.",
        footer: "Band + Advanced Labs",
      },
      {
        eyebrow: "Why",
        headline: "One ecosystem.",
        accent: "Health. Performance. Recovery.",
        footer: "NRMLSS",
      },
    ],
  },
  {
    id: "day-in-life",
    label: "Carousel · A day with NRMLSS",
    caption:
      "A day with NRMLSS.\n\nMorning readiness → training call → overnight recovery → what to change tomorrow.\n\nSwipe through.\n\n#NRMLSS #WearableHealth",
    slides: [
      {
        eyebrow: "Morning",
        headline: "Open Today.",
        accent: "Readiness sets the tone.",
        footer: "Push · Maintain · Protect",
      },
      {
        eyebrow: "Midday",
        headline: "Strain with context.",
        accent: "Not just a calorie count.",
        footer: "Heart · Stress · Load",
      },
      {
        eyebrow: "Night",
        headline: "Recovery starts early.",
        accent: "Sleep debt made obvious.",
        footer: "Wind-down cues",
      },
      {
        eyebrow: "Tomorrow",
        headline: "Adjust. Don’t guess.",
        accent: "Coach closes the loop.",
        footer: "NRMLSS",
      },
    ],
  },
  {
    id: "lab-flow",
    label: "Carousel · Lab flow",
    caption:
      "Advanced Labs, without the friction.\n\nOrder → draw → results in context → share with care.\n\n#NRMLSS #Lab",
    slides: [
      {
        eyebrow: "01",
        headline: "Pick your panel.",
        accent: "Domains that matter to you.",
        footer: "Hormones · Heart · Metabolic",
      },
      {
        eyebrow: "02",
        headline: "Book the draw.",
        accent: "Simple scheduling.",
        footer: "Partner labs",
      },
      {
        eyebrow: "03",
        headline: "Results with context.",
        accent: "Next to Band trends.",
        footer: "Not a PDF dump",
      },
      {
        eyebrow: "04",
        headline: "Share if you want.",
        accent: "Care Share is opt-in.",
        footer: "You stay in control",
      },
    ],
  },
  {
    id: "preorder-carousel",
    label: "Carousel · Preorder",
    caption:
      "NRMLSS Band 4 is open for preorder.\n\nPriority fulfillment. Continuous monitoring. Care-ready insight.\n\nLink in bio.\n\n#NRMLSS #Preorder #Band4",
    slides: [
      {
        eyebrow: "Band 4",
        headline: "Preorder open.",
        accent: "From $349.",
        footer: "Priority fulfillment",
      },
      {
        eyebrow: "What you get",
        headline: "24/7 signals.",
        accent: "Recovery insight.",
        footer: "Adaptive coaching",
      },
      {
        eyebrow: "Labs",
        headline: "Optional depth.",
        accent: "Advanced Labs when you need it.",
        footer: "100+ biomarkers",
      },
      {
        eyebrow: "Next",
        headline: "Reserve early access.",
        accent: "Link in bio.",
        footer: "NRMLSS",
      },
    ],
  },
];

export default async function ContentStudioPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="content-studio">
      <header className="content-studio-header">
        <div>
          <p className="content-kicker">Private · Content studio</p>
          <h1>IG posts</h1>
          <p className="content-lead">
            Fresh singles + carousels. Preview slides, download PNGs, copy
            captions.
          </p>
        </div>
        <div className="content-studio-actions">
          <Link href="/app" className="content-link">
            App
          </Link>
          <Link href="/" className="content-link">
            Site
          </Link>
        </div>
      </header>

      <div className="content-grid">
        {posts.map((post) => (
          <IgPostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
