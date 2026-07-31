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

export default function AddProblemDialog({
    onProblemAdded,
  }: {
    onProblemAdded: () => void;
  }) {
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");


  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          platform,
          topic,
          difficulty,
        }),
      });

      const data = await res.json();

      console.log(data);

      setTitle("");
      setPlatform("");
      setTopic("");
      onProblemAdded();
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Dialog>
      <DialogTrigger
        render={<Button />}
        >
        Add Problem
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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
              placeholder="LeetCode"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
          </div>

          <div>
            <div>
              <Label>Topic</Label>
              <Input
                placeholder="Array"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <Label>Difficulty</Label>
              <Input
                placeholder="Easy"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              />
            </div>
            <Input
              placeholder="Array"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <Button 
            className="w-full"
            onClick={handleSubmit}
          >
            Save Problem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}