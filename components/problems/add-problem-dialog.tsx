"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AddProblemDialog() {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("LeetCode");
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !topic) return;

    setLoading(true);

    try {
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          platform,
          difficulty,
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create problem");
      }

      setTitle("");
      setTopic("");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to add problem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            Add Problem
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Problem Name</Label>
            <Input
              placeholder="Two Sum"
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
            <Label>Difficulty</Label>
            <Input
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </div>

          <div>
            <Label>Topic</Label>
            <Input
              placeholder="Array"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Problem"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}