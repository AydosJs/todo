"use client";

import InputComponent from "../InputComponent";
import TodoList from "../TodoList";
import { Project } from "./ProjectList";
import ProjectTitle from "./ProjectTitle";

export function ProjectItem({ project }: Readonly<{ project: Project }>) {
  return (
    <div className="group/project flex w-full flex-col rounded-lg border border-stone-800/0 p-8 hover:border-stone-800/50">
      <ProjectTitle projectId={project.id} projectName={project.projectName} />

      <InputComponent projectId={project.id} />

      {project.todos.length > 0 && (
        <TodoList projectId={project.id} list={project.todos} />
      )}
    </div>
  );
}
