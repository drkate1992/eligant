"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

export const CHART_TOOLTIP = {
  backgroundColor: "#162132",
  borderColor: "rgba(28,166,95,0.25)",
  borderWidth: 1,
  titleColor: "#eef3f0",
  bodyColor: "#a8b8cc",
  padding: 10,
  cornerRadius: 8,
};

export const AXIS = {
  grid: { color: "rgba(255,255,255,0.04)" },
  ticks: { color: "#6a7f96", font: { size: 11 } },
};
