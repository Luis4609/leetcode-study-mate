// src/features/Problem/constants.ts
import type { ProblemStatus } from '@/shared/types'; // Adjusted path

export const problemStatuses: ProblemStatus[] = [
  'Not Started', 
  'Attempted', 
  'Solved', 
  'Solved with Help', 
  'Review Later', 
  'Skipped'
];
