"use client";

import { useEffect, useRef, useState } from "react";

function formatNumber(value, fallback = "—") {
  if (value == null || Number.isNaN(Number(value))) return fallback;
  const num = Number(value);
  return Number.isInteger(num) ? String(num) : num.toFixed(1);
}

function buildOpeningMessages({ today, insights, displayName }) {
  const firstName = displayName.trim().split(/\s+/)[0] || "there";
  const readiness =
    today?.readiness != null ? `${formatNumber(today.readiness)}%` : null;
  const top = insights[0];

  const lines = [
    {
      id: "open-1",
      role: "coach",
      text: readiness
        ? `Hi ${firstName} — readiness is ${readiness} today${today?.recoveryLabel ? `, recovery feels ${today.recoveryLabel.toLowerCase()}` : ""}. I’ve lined up a short plan from overnight signals.`
        : `Hi ${firstName} — sync your band and I’ll turn readiness, recovery, and labs into a clear daily plan.`,
    },
  ];

  if (top) {
    lines.push({
      id: "open-2",
      role: "coach",
      text: `Top priority: ${top.title}. ${top.body}`,
    });
  }

  return lines;
}

function buildCoachReply(raw, { today, insights, domains }) {
  const q = raw.toLowerCase();
  const top = insights[0];
  const readiness =
    today?.readiness != null ? `${formatNumber(today.readiness)}%` : "unknown";
  const strain = today?.strainRoom || "limited";
  const sleepDebt =
    today?.sleepDebtMinutes != null
      ? `${formatNumber(today.sleepDebtMinutes)} minutes`
      : "still elevated";

  if (
    /train|workout|lift|run|intensity|strain|exercise|gym/.test(q)
  ) {
    return `Keep strain ${strain.toLowerCase()}. Readiness is ${readiness}, but sleep debt is ${sleepDebt} — favor technique work, Zone 2, or mobility over hard intervals.`;
  }

  if (/sleep|wind.?down|bed|rest|tired/.test(q)) {
    return `Protect a 90-minute wind-down. Dim screens, keep caffeine cut off, and treat sleep debt (${sleepDebt}) as the constraint — not motivation.`;
  }

  if (/lab|blood|panel|biomarker|vitamin|apob/.test(q)) {
    const labInsight = insights.find((item) =>
      /lab/i.test(item.tag || item.kind || ""),
    );
    return labInsight
      ? `${labInsight.title}. ${labInsight.body} I can help you pick a panel when you’re ready.`
      : `Advanced Labs give clinical ground truth next to Band trends. Start with the domain you’re watching most closely.`;
  }

  if (/stress|anxious|cortisol|calm|overwhelm/.test(q)) {
    return `Stress looks elevated relative to recovery. Short nasal breathing between meetings, then a true wind-down after 9:30p — don’t stack late caffeine or hard work.`;
  }

  if (/recover|hrv|resting|heart/.test(q)) {
    return `Recovery is ${today?.recoveryLabel?.toLowerCase() || "in progress"}. Ease load for 24–48h, hydrate, and prioritize consistent bedtime over chasing a single HRV reading.`;
  }

  if (/hormone|domain|focus|metabolic|inflammation/.test(q)) {
    const match = domains.find((d) =>
      q.includes(d.title.toLowerCase().split(" ")[0]),
    );
    if (match) {
      return `${match.title} is ${match.status.toLowerCase()}. ${match.summary || "Watch the domain markers and keep today’s plan light until the trend settles."}`;
    }
    return `Open Domains for the marker detail. Today’s coach ranking already weights the domains under pressure.`;
  }

  if (/plan|today|priority|what should|should i/.test(q)) {
    if (!insights.length) {
      return `No priorities yet — once today’s snapshot lands, I’ll rank the next moves.`;
    }
    return insights
      .slice(0, 3)
      .map(
        (item, index) =>
          `${index + 1}. ${item.title}${item.priority === "high" ? " (high)" : ""}`,
      )
      .join(" ");
  }

  if (top) {
    return `Stay with “${top.title}” first. ${top.body} Ask me about training, sleep, stress, or labs if you want a tighter call.`;
  }

  return `Tell me if you want a training call, sleep plan, stress reset, or lab next step — I’ll keep it tied to today’s signals.`;
}

const QUICK_PROMPTS = [
  "What should I do today?",
  "Can I train hard?",
  "Help me wind down",
  "Any lab priorities?",
];

export default function CoachChat({
  today,
  insights = [],
  domains = [],
  displayName = "Member",
  activeInsight = null,
}) {
  const [messages, setMessages] = useState(() =>
    buildOpeningMessages({ today, insights, displayName }),
  );
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const threadRef = useRef(null);
  const typingTimer = useRef(null);
  const lastSeededInsight = useRef(null);

  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimer.current) window.clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!activeInsight?.id) return;
    if (lastSeededInsight.current === activeInsight.id) return;
    if (lastSeededInsight.current == null) {
      lastSeededInsight.current = activeInsight.id;
      return;
    }
    lastSeededInsight.current = activeInsight.id;
    setMessages((current) => [
      ...current,
      {
        id: `focus-${activeInsight.id}-${Date.now()}`,
        role: "coach",
        text: `Let’s focus on “${activeInsight.title}”. ${activeInsight.body}`,
      },
    ]);
  }, [activeInsight]);

  const sendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsTyping(true);

    typingTimer.current = window.setTimeout(() => {
      const reply = buildCoachReply(trimmed, { today, insights, domains });
      setMessages((current) => [
        ...current,
        {
          id: `coach-${Date.now()}`,
          role: "coach",
          text: reply,
        },
      ]);
      setIsTyping(false);
    }, 650 + Math.min(900, trimmed.length * 12));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <div className="app-coach-chat">
      <div className="app-coach-chat-head">
        <div>
          <p className="app-label">Coach</p>
          <h2>Ask anything</h2>
        </div>
        <span className="app-chip app-chip--steady">Live context</span>
      </div>

      <div className="app-coach-thread" ref={threadRef} role="log" aria-live="polite">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`app-coach-bubble app-coach-bubble--${message.role}`}
          >
            <span className="app-coach-bubble-meta">
              {message.role === "coach" ? "Coach" : "You"}
            </span>
            <p>{message.text}</p>
          </div>
        ))}
        {isTyping ? (
          <div className="app-coach-bubble app-coach-bubble--coach is-typing">
            <span className="app-coach-bubble-meta">Coach</span>
            <p>
              <span className="app-coach-typing-dot" />
              <span className="app-coach-typing-dot" />
              <span className="app-coach-typing-dot" />
            </p>
          </div>
        ) : null}
      </div>

      <div className="app-coach-prompts">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="app-coach-prompt"
            onClick={() => sendMessage(prompt)}
            disabled={isTyping}
          >
            {prompt}
          </button>
        ))}
        {activeInsight ? (
          <button
            type="button"
            className="app-coach-prompt"
            onClick={() =>
              sendMessage(`Tell me more about: ${activeInsight.title}`)
            }
            disabled={isTyping}
          >
            About “{activeInsight.title}”
          </button>
        ) : null}
      </div>

      <form className="app-coach-composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="coach-message">
          Message coach
        </label>
        <input
          id="coach-message"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about training, sleep, stress, labs…"
          autoComplete="off"
          disabled={isTyping}
        />
        <button
          type="submit"
          className="app-btn"
          disabled={!draft.trim() || isTyping}
        >
          Send
        </button>
      </form>
    </div>
  );
}
