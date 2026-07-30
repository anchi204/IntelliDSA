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
            <Input placeholder="LeetCode" />
          </div>

          <div>
            <Label>Topic</Label>
            <Input placeholder="Array" />
          </div>

          <Button className="w-full">
            Save Problem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}