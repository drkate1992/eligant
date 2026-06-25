"use client";

import { Line } from "react-chartjs-2";
import { CHART_TOOLTIP, AXIS } from "./register";
import type { MonthlyPoint } from "@/types";

export function ActivityChart({ data }: { data: MonthlyPoint[] }) {
  return (
    <Line
      data={{
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Credits",
            data: data.map((d) => d.credit),
            borderColor: "#1ca65f",
            backgroundColor: "rgba(28,166,95,0.12)",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#1ca65f",
          },
          {
            label: "Debits",
            data: data.map((d) => d.debit),
            borderColor: "#e05c5c",
            backgroundColor: "rgba(224,92,92,0.08)",
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: "#e05c5c",
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
