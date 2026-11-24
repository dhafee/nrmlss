"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

const TONE_COLOR = {
  good: "#2f6b4f",
  watch: "#9a6b2f",
  steady: "#5f6f5c",
  caution: "#9a3d2f",
};

export function buildSparkSeries(seed = 50, points = 16) {
  return Array.from({ length: points }, (_, index) => {
    const wave = Math.sin(seed / 16 + index * 0.55) * 14;
    const drift = ((seed * (index + 2)) % 13) - 6;
    const trend = index * 0.35;
    return {
      i: index,
      v: Math.max(8, 42 + wave + drift + trend),
    };
  });
}

function LastDot(props) {
  const { cx, cy, index, payload, dataLength, color, tip } = props;
  if (index !== dataLength - 1 || cx == null || cy == null) return null;

  return (
    <g>
      {tip ? (
        <g transform={`translate(${cx}, ${cy - 22})`}>
          <rect
            x={-28}
            y={-11}
            rx={10}
            ry={10}
            width={56}
            height={20}
            fill={color}
          />
          <text
            x={0}
            y={3}
            textAnchor="middle"
            fill="#fff"
            fontSize="9"
            fontFamily="var(--font-host-grotesk), sans-serif"
          >
            {tip}
          </text>
        </g>
      ) : null}
      <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />
    </g>
  );
}

export default function MetricSpark({
  id = "spark",
  seed = 50,
  tone = "steady",
  tip = "",
  height = 78,
}) {
  const color = TONE_COLOR[tone] || TONE_COLOR.steady;
  const data = buildSparkSeries(seed);
  const gradientId = `spark-fill-${id}`;

  return (
    <div className="metric-spark" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: tip ? 26 : 8, right: 10, left: 4, bottom: 4 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            activeDot={false}
            dot={(dotProps) => (
              <LastDot
                {...dotProps}
                dataLength={data.length}
                color={color}
                tip={tip}
              />
            )}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
