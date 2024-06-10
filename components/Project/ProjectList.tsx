"use client";
import InputComponent, { ListItem } from "@/components/InputComponent";
import TodoList from "@/components/TodoList";
import { useSessionStorage } from "@uidotdev/usehooks";
import { useState } from "react";
import ProjectTitle from "./ProjectTitle";

export interface Project {
  id: number;
  projectName: string;
  createdAt: Date;
  updatedAt: Date;
  todos: ListItem[];
}

export default function ProjectList() {
  const [projects, setProjects] = useSessionStorage<Project[]>("projects", []);
  const [isAddingProject, setIsAddingProject] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");

  const handleProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNewProjectName(event.target.value);
  };

  const handleProjectNameKeyDown = (
    event: React.KeyboardEvent<HTMLHeadingElement>,
  ) => {
    if (event.key === "Enter") {
      handleAddProject();
    }
  };

  const handleAddProject = () => {
    if (newProjectName.trim() === "") {
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      projectName: newProjectName.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      todos: [],
    };

    setProjects([...projects, newProject]);
    setIsAddingProject(false);
    setNewProjectName("");
  };

  return (
    <div className="flex w-full flex-col space-y-20">
      <div>
        {isAddingProject ? (
          <input
            className="w-full bg-transparent text-3xl first-letter:uppercase placeholder:opacity-30"
            value={newProjectName}
            onChange={handleProjectNameChange}
            onKeyDown={handleProjectNameKeyDown}
            placeholder="Add Project..."
          />
        ) : (
          <h1 className="text-3xl opacity-30 first-letter:uppercase focus:opacity-100">
            {newProjectName}
          </h1>
        )}
      </div>

      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  );
}

export function ProjectItem({ project }: Readonly<{ project: Project }>) {
  return (
    <div className="flex w-full flex-col">
      <ProjectTitle projectId={project.id} projectName={project.projectName} />

      <InputComponent projectId={project.id} />

      {project.todos.length > 0 && (
        <TodoList projectId={project.id} list={project.todos} />
      )}
    </div>
  );
}
