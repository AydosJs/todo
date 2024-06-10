"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ListItem } from "./InputComponent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useSessionStorage } from "@uidotdev/usehooks";
import { Project } from "./Project/ProjectList";

dayjs.extend(relativeTime);

export default function TodoItem({
  projectId,
  item,
}: Readonly<{ item: Readonly<ListItem>; projectId: number }>) {
  const [_, setProjects] = useSessionStorage<Project[]>("projects", []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.text);

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleEditSave = () => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              todos: project.todos.map((t) =>
                t.id === item.id ? { ...t, text: editedTitle } : t,
              ),
            }
          : project,
      ),
    );
    setIsEditing(false);
  };

  const handleCheckboxChange = () => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              todos: project.todos.map((t) =>
                t.id === item.id
                  ? {
                      ...t,
                      status:
                        t.status === "completed" ? "uncompleted" : "completed",
                    }
                  : t,
              ),
            }
          : project,
      ),
    );
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex w-fit flex-row items-center space-x-3">
        <Checkbox
          className="rounded-full border-2 border-white"
          checked={item.status === "completed"}
          onCheckedChange={handleCheckboxChange}
        />
        {isEditing ? (
          <input
            type="text"
            className="w-fill border-0 bg-transparent text-sm first-letter:uppercase"
            value={editedTitle}
            onChange={handleEditChange}
            onBlur={handleEditSave}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleEditSave();
              }
            }}
          />
        ) : (
          <span
            className="text-sm first-letter:uppercase"
            onClick={handleEditStart}
          >
            {item.text}
          </span>
        )}
      </div>
      <div className="flex flex-row items-center space-x-2">
        <span className="text-stone-400">
          {dayjs(item.createdAt).fromNow()}
        </span>
      </div>
    </div>
  );
}
