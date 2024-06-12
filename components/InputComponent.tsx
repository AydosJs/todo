"use client";
import { Input } from "@/components/ui/input";
import { useSessionStorage } from "@uidotdev/usehooks";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Project } from "./project/ProjectList";
import { v4 as uuidv4 } from "uuid";
import UploadFile from "./UploadFile";

export interface ListItem {
  id: string;
  text: string;
  status: "completed" | "uncompleted";
  createdAt: Date;
  updatedAt: Date;
}

export default function InputComponent({
  projectId,
}: Readonly<{ projectId: string }>) {
  const [_, setProjects] = useSessionStorage<Project[]>("projects", []);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() === "") {
      return;
    }

    const newTodo: ListItem = {
      id: uuidv4(),
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

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "f") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-row items-center space-x-2">
      <div className="relative w-full">
        <Plus
          className="absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-stone-50"
          onClick={handleAddTodo}
        />
        <Input
          ref={inputRef}
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

      <div>
        <UploadFile />
      </div>
    </div>
  );
}
