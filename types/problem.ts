export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
  id: number;
  title: string;
  platform: string;
  difficulty: Difficulty;
  topic: string;
  link: string | null;
  solved: boolean;
  favorite: boolean;
  revisionDate: string | null;
  revisionCount: number;
  maxRevisions: number;
  solvedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
