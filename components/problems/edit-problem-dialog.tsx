"use client";
import { Problem } from "@/types/problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  problem: Problem;
}

export default function EditProblemDialog({ problem }: Props) {
  const [title, setTitle] = useState(problem.title);
  const [platform, setPlatform] = useState(problem.platform);
  const [topic, setTopic] = useState(problem.topic);
  const [difficulty, setDifficulty] = useState(problem.difficulty);
  const [revisionDate, setRevisionDate] = useState(
    problem.revisionDate
        ? new Date(problem.revisionDate).toISOString().split("T")[0]
        : ""
  );

  const handleUpdate = async () => {
    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          platform,
          topic,
          difficulty,
          revisionDate,
        }),
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
            <Button variant="outline" size="sm" />
        }
      >
        Edit
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Problem</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Problem Name</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <Label>Platform</Label>
            <Input
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          </div>

          <div>
            <Label>Topic</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <Label>Difficulty</Label>
            <Input
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value as "Easy" | "Medium" | "Hard")
              }
            />
          </div>
          <div>
            <Label>Revision Date</Label>

            <Input
            type="date"
            value={revisionDate}
            onChange={(e) => setRevisionDate(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleUpdate}
          >
            Update Problem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}