"use client";

import { Doughnut } from "react-chartjs-2";
import { CHART_TOOLTIP } from "./register";
import type { CategorySlice } from "@/types";

export function SpendingDonut({ data }: { data: CategorySlice[] }) {
  return (
    <Doughnut
      data={{
        labels: data.map((d) => d.label),
        datasets: [
          {
            data: data.map((d) => d.amount),
            backgroundColor: data.map((d) => d.color),
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        plugins: {
          legend: { display: false },
          tooltip: {
            ...CHART_TOOLTIP,
            callbacks: {
              label: (ctx) => ` $${Number(ctx.parsed).toLocaleString()}`,
            },
          },
        },
      }}
    />
  );
}
