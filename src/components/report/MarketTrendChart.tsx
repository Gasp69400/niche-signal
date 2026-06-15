"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MarketTrendPoint } from "@/types/market-report";

interface MarketTrendChartProps {
  data: MarketTrendPoint[];
  sixMonthChange: number;
  trend?: string;
}

export function MarketTrendChart({ data, sixMonthChange, trend }: MarketTrendChartProps) {
  const trendingUp = sixMonthChange >= 0;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        {trend && (
          <span className="text-xs font-medium text-muted">{trend}</span>
        )}
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            trendingUp
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400"
          }`}
        >
          {trendingUp ? "+" : ""}
          {sixMonthChange}% sur 6 mois
        </span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(8, 8, 16, 0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#6B7280" }}
            />
            <Area
              type="monotone"
              dataKey="interest"
              stroke="#06B6D4"
              strokeWidth={2}
              fill="url(#trendGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "#06B6D4", stroke: "#fff", strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
