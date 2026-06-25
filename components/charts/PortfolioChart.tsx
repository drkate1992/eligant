"use client";

import { Line } from "react-chartjs-2";
import { CHART_TOOLTIP, AXIS } from "./register";

export function PortfolioChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Portfolio Value",
            data: values,
            borderColor: "#1ca65f",
            backgroundColor: "rgba(28,166,95,0.12)",
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: CHART_TOOLTIP },
        scales: {
          x: AXIS,
          y: {
            ...AXIS,
            ticks: {
              ...AXIS.ticks,
              callback: (v) => "$" + (Number(v) / 1000).toFixed(0) + "k",
            },
          },
        },
      }}
    />
  );
}
