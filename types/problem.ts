export type Difficulty = "Easy" | "Medium" | "Hard";
export type RevisionResult = "EASY" | "OKAY" | "STRUGGLED" | "FAILED";
export interface Problem {
 id:number; title:string; platform:string; difficulty:Difficulty; topic:string; link:string|null;
 solved:boolean; attempted:boolean; attemptCount:number; favorite:boolean; revisionEnabled:boolean;
 revisionDate:string|null; revisionCount:number; maxRevisions:number; revisionIntervalDays:number;
 solvedAt:string|null; notes:string|null; createdAt:string; updatedAt:string;
 lastAttempt?:{solved:boolean;attemptedAt:string}|null;
 lastRevision?:{result:RevisionResult;revisedAt:string;nextRevisionDate:string|null}|null;
}