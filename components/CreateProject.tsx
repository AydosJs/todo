"use client";
import Link from "next/link";
import { Plus } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreateProject() {
  return (
    <div className="z-5 fixed bottom-5 right-5">
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
