import type { ProblemStatus } from "@/shared/types/index"; // Adjusted path
import {
  AlertCircle,
  Edit3,
  HelpCircle,
  RefreshCw,
  SkipForward,
  CheckCircle as StatusCheckCircle,
} from "lucide-react";
import React, { type JSX } from "react"; // Import React for JSX.Element

export const getDifficultyColor = (
  difficulty: "Easy" | "Medium" | "Hard"
): string => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const getStatusIndicator = (
  status: ProblemStatus
): { color: string; icon: JSX.Element; text: string } => {
  switch (status) {
    case "Not Started":
      return {
        color: "bg-slate-400",
        icon: React.createElement(AlertCircle, {
          size: 14,
          className: "mr-1 text-slate-500",
        }),
        text: "Not Started",
      };
    case "Attempted":
      return {
        color: "bg-amber-400",
        icon: React.createElement(Edit3, {
          size: 14,
          className: "mr-1 text-amber-600",
        }),
        text: "Attempted",
      };
    case "Solved":
      return {
        color: "bg-green-500",
        icon: React.createElement(StatusCheckCircle, {
          size: 14,
          className: "mr-1 text-green-700",
        }),
        text: "Solved",
      };
    case "Solved with Help":
      return {
        color: "bg-sky-500",
        icon: React.createElement(HelpCircle, {
          size: 14,
          className: "mr-1 text-sky-700",
        }),
        text: "Solved w/ Help",
      };
    case "Review Later":
      return {
        color: "bg-purple-500",
        icon: React.createElement(RefreshCw, {
          size: 14,
          className: "mr-1 text-purple-700",
        }),
        text: "Review Later",
      };
    case "Skipped":
      return {
        color: "bg-gray-500",
        icon: React.createElement(SkipForward, {
          size: 14,
          className: "mr-1 text-gray-700",
        }),
        text: "Skipped",
      };
    default:
      return {
        color: "bg-slate-300",
        icon: React.createElement(AlertCircle, { size: 14 }),
        text: "Unknown",
      };
  }
};
