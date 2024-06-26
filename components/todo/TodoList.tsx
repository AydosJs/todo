"use client";

import React, { useEffect, useState } from "react";
import { ListItem } from "../InputComponent";
import {
  DndContext,
  DragOverEvent,
  MouseSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useSessionStorage } from "@uidotdev/usehooks";
import { Project } from "../Project/ProjectList";
import ToDoContainer from "./ToDoContainer";
import Filter from "./Filter";

export default function TodoList({
  list,
  projectId,
}: Readonly<{ list: ListItem[]; projectId: string }>) {
  const [_, setProjects] = useSessionStorage<Project[]>("projects", []);
  const [searchTerm] = useSessionStorage<string>("searchTerm", "");

  const [filterOption] = useSessionStorage<"all" | "todo" | "completed">(
    "filterOption",
    "all",
  );

  const [items, setItems] = useState({
    completedTodos: list.filter((todo) => todo.status === "completed"),
    unCompletedTodos: list.filter((todo) => todo.status === "uncompleted"),
  });

  const filteredUncompletedTodos = items.unCompletedTodos.filter(
    (todo: ListItem) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCompletedTodos = items.completedTodos.filter((todo: ListItem) =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const displayedUncompletedTodos =
    filterOption === "all" || filterOption === "todo"
      ? filteredUncompletedTodos
      : [];
  const displayedCompletedTodos =
    filterOption === "all" || filterOption === "completed"
      ? filteredCompletedTodos
      : [];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const { id } = active;
    const { id: overId } = over;

    if (!id || !overId) return;

    const activeContainer =
      active?.data.current?.type === "uncompleted"
        ? "unCompletedTodos"
        : "completedTodos";
    const overContainer =
      over?.data.current?.type !== "completed"
        ? "unCompletedTodos"
        : "completedTodos";

    if (activeContainer !== overContainer) {
      return;
    }

    const activeIndex = items[activeContainer].findIndex(
      (item) => item.id === active.id,
    );
    const overIndex = items[overContainer].findIndex(
      (item) => item.id === over.id,
    );

    if (activeIndex !== overIndex) {
      setItems((items) => ({
        ...items,
        [overContainer]: arrayMove(
          items[overContainer],
          activeIndex,
          overIndex,
        ),
      }));
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const { id } = active;
    const { id: overId } = over;

    if (!id || !overId) return;

    const activeContainer =
      active?.data.current?.type === "uncompleted"
        ? "unCompletedTodos"
        : "completedTodos";
    const overContainer =
      over?.data.current?.type !== "completed"
        ? "unCompletedTodos"
        : "completedTodos";
    if (
      activeContainer === overContainer ||
      !id ||
      !overId ||
      !active ||
      !over
    ) {
      return;
    }

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((item) => item?.id === id);
      const overIndex = overItems.findIndex((item) => item?.id === overId);

      let newIndex;

      if (overId in prev) {
        newIndex = overItems.length + 1;
      } else {
        const draggingRect = active.rect;

        if (draggingRect && draggingRect?.current?.initial?.top) {
          const isBelowLastItem =
            over &&
            overIndex === overItems.length - 1 &&
            draggingRect?.current?.initial?.top >
              over.rect.top + over.rect.height;

          const modifier = isBelowLastItem ? 1 : 0;
          newIndex =
            overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }
      }

      const movedItem = { ...items[activeContainer][activeIndex] };
      movedItem.status =
        overContainer === "unCompletedTodos" ? "uncompleted" : "completed";

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item?.id !== active?.id),
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          movedItem,
          ...prev[overContainer].slice(newIndex, prev[overContainer].length),
        ],
      };
    });
  };

  useEffect(() => {
    setItems({
      completedTodos: list.filter((todo) => todo.status === "completed"),
      unCompletedTodos: list.filter((todo) => todo.status === "uncompleted"),
    });
  }, [list]);

  useEffect(() => {
    setProjects((prevProjects) => {
      return prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              todos: [
                items["unCompletedTodos"],
                items["completedTodos"],
              ].flat(),
            }
          : project,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  return (
    <div>
      <Filter />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        {displayedUncompletedTodos.length > 0 && (
          <div className="flex flex-col space-y-3 text-xs">
            <div className="flex flex-row items-center justify-between border-b border-stone-800 py-2">
              <div className="flex items-center space-x-4">
                <span>ToDo</span>
                <span className="text-stone-500">
                  {displayedUncompletedTodos.length}{" "}
                  {displayedUncompletedTodos.length === 1 ? "item" : "items"}
                </span>
              </div>
              <span className="text-stone-500">Due</span>
            </div>

            <div>
              <ToDoContainer
                todos={displayedUncompletedTodos}
                projectId={projectId}
                id={"unCompletedTodos"}
              />
            </div>
          </div>
        )}

        {displayedCompletedTodos.length > 0 && (
          <div className="mt-6 flex flex-col space-y-4 text-xs">
            <div className="flex flex-row items-center justify-between border-b border-stone-800 py-2">
              <div className="flex items-center space-x-4">
                <span>Completed</span>
                <span className="text-stone-500">
                  {displayedCompletedTodos.length}{" "}
                  {displayedCompletedTodos.length === 1 ? "item" : "items"}
                </span>
              </div>
              <span className="text-stone-500">Due</span>
            </div>

            <div>
              <ToDoContainer
                todos={displayedCompletedTodos}
                projectId={projectId}
                id={"completedTodos"}
              />
            </div>
          </div>
        )}
      </DndContext>
    </div>
  );
}
