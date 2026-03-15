"use client";

import { CalculationResult } from "@/lib/pricing";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

interface Props {
  result: CalculationResult;
}

function formatCompact(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export default function ComparisonChart({ result }: Props) {
  const hasMini = result.miniIndividualCount > 0 || result.miniFamilyCount > 0;
  const data = [
    {
      name: hasMini ? "Shamel + Mini" : "Shamel",
      cost: result.shamelTotalAnnual,
      fill: "#0891b2",
    },
    {
      name: "Basic Ins.",
      cost: result.traditionalBasicAnnual,
      fill: "#94a3b8",
    },
    {
      name: "Standard Ins.",
      cost: result.traditionalStandardAnnual,
      fill: "#64748b",
    },
    {
      name: "Premium Ins.",
      cost: result.traditionalPremiumAnnual,
      fill: "#475569",
    },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCompact}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [`${new Intl.NumberFormat("en-EG").format(Number(value))} EGP`, "Annual Cost"]}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Bar dataKey="cost" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="cost"
              position="top"
              formatter={(v: unknown) => formatCompact(Number(v))}
              style={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
