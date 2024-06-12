"use client";
import { useSessionStorage } from "@uidotdev/usehooks";

import { ListItem } from "../InputComponent";
import NoProject from "../NoProject";
import CreateProject from "../CreateProject";
import { ProjectItem } from "@/components/Project/ProjectItem";

export interface Project {
  id: string;
  projectName: string;
  createdAt: Date;
  updatedAt: Date;
  todos: ListItem[];
}

export default function ProjectList() {
  const [projects] = useSessionStorage<Project[]>("projects", []);

  return (
    <div className="flex h-full w-full flex-col space-y-20">
      {projects.length > 0 && <CreateProject />}

      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}

      {projects.length === 0 && <NoProject />}
    </div>
  );
}
