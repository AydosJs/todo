"use client";
import Link from "next/link";
import { ArrowDownToLine, Plus } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSessionStorage } from "@uidotdev/usehooks";
import { Project } from "./Project/ProjectList";
import { useState } from "react";

export default function CreateProject() {
  const [projects] = useSessionStorage<Project[]>("projects", []);
  const [loading, setLoading] = useState<boolean>(false);

  const downloadProject = () => {
    setLoading(true);

    if (loading) {
      alert("Please wait for the current download to finish.");
      return;
    }

    const project = projects[0];
    const projectJson = JSON.stringify(project, null, 2);
    const blob = new Blob([projectJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.projectName}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="z-5 fixed bottom-5 right-5 flex flex-col items-center justify-center space-y-2">
      {projects.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild className="">
              <button
                disabled={loading}
                onClick={downloadProject}
                className="rounded-full bg-stone-700 p-3 opacity-50 hover:bg-stone-800 hover:opacity-100 disabled:cursor-not-allowed"
              >
                <ArrowDownToLine className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download Project as a JSON file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="">
            <Link target="_blank" href="/">
              <button className="rounded-full bg-stone-700 p-4 hover:bg-stone-800">
                <Plus className="size-5" />
              </button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create Project</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
