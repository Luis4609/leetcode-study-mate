// src/hooks/useProblemModalManager.ts
import { useState, useCallback } from "react";
import type { LeetCodeProblem } from "@/shared/types";

export interface ProblemPath {
  topicId: string;
  subTopicId: string;
  problemName: string;
}

export function useProblemModalManager() {
  const [isProblemModalOpen, setIsProblemModalOpen] = useState<boolean>(false);
  const [currentProblemInModal, setCurrentProblemInModal] =
    useState<LeetCodeProblem | null>(null);
  const [currentProblemPath, setCurrentProblemPath] =
    useState<ProblemPath | null>(null);

  const openProblemModal = useCallback(
    (problem: LeetCodeProblem, topicId: string, subTopicId: string) => {
      setCurrentProblemInModal(problem);
      setCurrentProblemPath({ topicId, subTopicId, problemName: problem.name });
      setIsProblemModalOpen(true);
    },
    []
  );

  const closeProblemModal = useCallback(() => {
    setIsProblemModalOpen(false);
    // It's good practice to clear these on close to avoid stale data if the modal reopens quickly
    // setCurrentProblemInModal(null);
    // setCurrentProblemPath(null);
    // However, the modal might need the data while it's closing (e.g., for animations).
    // If ProblemDetailModal handles its display based on `isOpen` and uses `problem` prop
    // only when open, then clearing immediately is fine.
    // Let's clear them after a short delay or rely on the modal component's behavior.
    // For simplicity now, we'll clear them. If animations are an issue, adjust.
    setTimeout(() => {
        setCurrentProblemInModal(null);
        setCurrentProblemPath(null);
    }, 300); // Adjust delay as needed for modal close animation
  }, []);

  return {
    isProblemModalOpen,
    currentProblemInModal,
    currentProblemPath,
    openProblemModal,
    closeProblemModal,
  };
}