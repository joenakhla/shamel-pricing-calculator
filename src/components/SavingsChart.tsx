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
  ReferenceLine,
} from "recharts";

interface Props {
  result: CalculationResult;
}

function formatCompact(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

export default function SavingsChart({ result }: Props) {
  const data = [
    {
      name: "vs Basic",
      savings: result.savingsVsBasic,
      roi: result.roiVsBasic,
    },
    {
      name: "vs Standard",
      savings: result.savingsVsStandard,
      roi: result.roiVsStandard,
    },
    {
      name: "vs Premium",
      savings: result.savingsVsPremium,
      roi: result.roiVsPremium,
    },
  ];

  const getColor = (value: number) => (value >= 0 ? "#10b981" : "#ef4444");

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
            formatter={(value: any, name: any) => {
              if (name === "savings") return [`${new Intl.NumberFormat("en-EG").format(Number(value))} EGP`, "Annual Savings"];
              return [value, name];
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <ReferenceLine y={0} stroke="#cbd5e1" />
          <Bar dataKey="savings" radius={[8, 8, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.savings)} />
            ))}
            <LabelList
              dataKey="roi"
              position="top"
              formatter={(v: unknown) => `${Number(v).toFixed(0)}%`}
              style={{ fontSize: 11, fill: "#10b981", fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
