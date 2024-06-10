"use client";
import { Input } from "@/components/ui/input";
import { useSessionStorage } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Project } from "./Project/ProjectList";

export interface ListItem {
  id: number;
  text: string;
  status: "completed" | "uncompleted";
  createdAt: Date;
  updatedAt: Date;
}

export default function InputComponent({
  projectId,
}: Readonly<{ projectId: number }>) {
  const [_, setProjects] = useSessionStorage<Project[]>("projects", []); // Access setProjects here
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTodo: ListItem = {
      id: Date.now(),
      text: inputValue.trim(),
      status: "uncompleted",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, todos: [...project.todos, newTodo] }
          : project,
      ),
    );
    setInputValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <div className="relative w-full">
      <Plus
        className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
        onClick={handleAddTodo}
      />
      <Input
        className="h-auto w-full border-stone-800 bg-[#131313] p-3.5 pl-10 text-xs text-white"
        type="text"
        placeholder="Add ToDo"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <p className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center space-x-1 text-sm">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-stone-900 px-1.5 font-mono font-medium text-white/50 opacity-100">
          <span className="text-[8px] text-xs">⌘</span>
        </kbd>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-stone-900 px-1.5 font-mono font-medium text-white/50 opacity-100">
          <span className="text-xs">F</span>
        </kbd>
      </p>
    </div>
  );
}
