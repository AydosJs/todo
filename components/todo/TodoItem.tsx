"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ListItem } from "../InputComponent";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useSessionStorage } from "@uidotdev/usehooks";
import { Project } from "../Project/ProjectList";
import { Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

dayjs.extend(relativeTime);

export default function TodoItem({
  projectId,
  item,
}: Readonly<{ item: Readonly<ListItem>; projectId: string }>) {
  const [_, setProjects] = useSessionStorage<Project[]>("projects", []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item?.text);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item?.id,
      data: {
        type: item.status,
        item,
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

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
                t.id === item?.id ? { ...t, text: editedTitle } : t,
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
                t.id === item?.id
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

  const handleDeleteItem = () => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              todos: project.todos.filter((t) => t.id !== item?.id),
            }
          : project,
      ),
    );
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="group relative flex flex-row items-center justify-between space-x-2"
    >
      <div className="flex w-full flex-row items-center space-x-3">
        <Checkbox
          className="rounded-full border-2 border-white"
          checked={item.status === "completed"}
          onCheckedChange={handleCheckboxChange}
        />
        {isEditing ? (
          <input
            type="text"
            className="w-full border-0 bg-transparent text-sm first-letter:uppercase"
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
            className={`w-full text-sm first-letter:uppercase ${item.status === "completed" ? "line-through" : ""}`}
            onClick={handleEditStart}
          >
            {item.text}
          </span>
        )}
      </div>
      <div className="flex flex-row items-center space-x-2 divide-x">
        <span className="text-nowrap text-stone-400">
          {dayjs(item.createdAt).fromNow()}
        </span>
        <button
          onClick={handleDeleteItem}
          className="hidden pl-1 transition-all group-hover:block"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
