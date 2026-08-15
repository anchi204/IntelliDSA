export interface Problem {
  id: number;
  title: string;
  platform: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  solved: boolean;
  favorite: boolean;
  revisionDate: string;
  revisionCount: number;
  maxRevisions: number;
}