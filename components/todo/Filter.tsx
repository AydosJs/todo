"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSessionStorage } from "@uidotdev/usehooks";

export default function Filter() {
  const [filterOption, setFilterOption] = useSessionStorage<
    "all" | "todo" | "completed"
  >("filterOption", "all");

  const [searchTerm, setSearchTerm] = useSessionStorage<string>(
    "searchTerm",
    "",
  );

  return (
    <div className="my-4 flex flex-row items-center justify-between">
      <ToggleGroup defaultValue={filterOption} type="single">
        <ToggleGroupItem
          className={`${filterOption === "all" ? "!bg-stone-800/50 !text-white" : "bg-none opacity-30"} h-auto p-2 px-3 text-xs hover:bg-stone-800/50 hover:text-white hover:opacity-100`}
          onClick={() => setFilterOption("all")}
          value="all"
        >
          All
        </ToggleGroupItem>
        <ToggleGroupItem
          className={`${filterOption === "todo" ? "!bg-stone-800/50 !text-white" : "bg-none opacity-30"} h-auto p-2 px-3 text-xs hover:bg-stone-800/50 hover:text-white hover:opacity-100`}
          onClick={() => setFilterOption("todo")}
          value="ToDo"
        >
          ToDo
        </ToggleGroupItem>
        <ToggleGroupItem
          className={`${filterOption === "completed" ? "!bg-stone-800/50 !text-white" : "bg-none opacity-30"} h-auto p-2 px-3 text-xs hover:bg-stone-800/50 hover:text-white hover:opacity-100`}
          onClick={() => setFilterOption("completed")}
          value="Completed"
        >
          Completed
        </ToggleGroupItem>
      </ToggleGroup>

      <div>
        <input
          type="text"
          value={searchTerm ?? ""}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks..."
          className="rounded border border-stone-800 bg-[#131313] p-2 text-xs font-normal text-white placeholder:text-xs placeholder:font-normal placeholder:text-white/30"
        />
      </div>
    </div>
  );
}
