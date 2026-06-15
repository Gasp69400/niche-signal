"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { RadarDimension } from "@/types/market-report";

export function OpportunityRadar({ data }: { data: RadarDimension[] }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mx-auto h-80 w-full max-w-lg">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "#6B7280", fontSize: 10 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 10]}
              tick={{ fill: "#6B7280", fontSize: 9 }}
              axisLine={false}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
