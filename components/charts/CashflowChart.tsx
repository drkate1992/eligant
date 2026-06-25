"use client";

import { Bar } from "react-chartjs-2";
import { CHART_TOOLTIP, AXIS } from "./register";
import type { MonthlyPoint } from "@/types";

export function CashflowChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <Bar
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Income",
            data: data.map((d) => d.credit),
            backgroundColor: "rgba(28,166,95,0.75)",
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: "Expenses",
            data: data.map((d) => d.debit),
            backgroundColor: "rgba(224,92,92,0.5)",
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "#a8b8cc",
              font: { size: 11 },
              boxWidth: 10,
              boxHeight: 10,
            },
          },
          tooltip: CHART_TOOLTIP,
        },
        scales: {
          x: AXIS,
          y: {
            ...AXIS,
            ticks: {
              ...AXIS.ticks,
              callback: (v) => "$" + Number(v) / 1000 + "k",
            },
          },
        },
      }}
    />
  );
}
