"use client";

import { useState } from "react";
import { Paperclip } from "lucide-react";
import { Project } from "./project/ProjectList";
import { useSessionStorage } from "@uidotdev/usehooks";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function UploadFile() {
  const [_, setProjects] = useSessionStorage<Project[]>("projects", []);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      if (typeof json !== "object" || Array.isArray(json)) {
        throw new Error("Uploaded JSON is not a valid project object.");
      }

      setProjects([json]);
      setError(null);
    } catch (err) {
      setError(
        "Failed to upload file. Please ensure it is a valid JSON object representing a project.",
      );
    }
  };

  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="">
            <div className="relative overflow-hidden">
              <button className="w-fill h-auto rounded border border-stone-800 bg-[#131313] p-3.5 text-xs text-white">
                <Paperclip className="size-4" />
              </button>

              <input
                type="file"
                accept=".json"
                className="absolute right-0 top-0 h-full w-full cursor-pointer opacity-0"
                onChange={handleFileUpload}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Upload Project</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
