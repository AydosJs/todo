"use client";

import { useSessionStorage } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { Project } from "./ProjectList";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectTitle({
  projectName,
  projectId,
}: Readonly<{
  projectName: string;
  projectId: string;
}>) {
  const [projects, setProjects] = useSessionStorage<Project[]>("projects", []); // Access setProjects here

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(projectName);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handleEditSave = () => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, projectName: editedName }
          : project,
      ),
    );
    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleEditSave();
    }
  };

  const handleDeleteProject = () => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId),
    );
  };

  useEffect(() => {
    if (projects && projects.length > 0) {
      document.title = projects[0].projectName || "Create Next App";
    }
  }, [projects]);

  return (
    <div className="group mb-6 flex flex-row items-center justify-between space-x-2">
      {isEditing ? (
        <input
          type="text"
          className="w-full bg-transparent text-3xl first-letter:uppercase"
          value={editedName}
          onChange={handleEditChange}
          onBlur={handleEditSave}
          onKeyDown={handleKeyDown}
          onFocus={(e) => e.target.select()}
        />
      ) : (
        <h1
          className="text-3xl first-letter:uppercase"
          onClick={handleEditStart}
        >
          {projectName}
        </h1>
      )}

      <AlertDialog>
        <AlertDialogTrigger className="rounded-md opacity-0 transition-all hover:!opacity-100 group-hover/project:opacity-50">
          <Trash2 className="size-4" />
        </AlertDialogTrigger>
        <AlertDialogContent className="border-stone-900 bg-stone-950 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none bg-transparent text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
