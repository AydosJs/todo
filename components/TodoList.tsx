"use client";

import React, { useEffect, useState } from "react";
import { ListItem } from "./InputComponent";
import {
  DndContext,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import Container from "./Container";

export default function TodoList({
  list,
  projectId,
}: Readonly<{ list: ListItem[]; projectId: string }>) {
  const [items, setItems] = useState({
    completedTodos: list.filter((todo) => todo.status === "completed"),
    unCompletedTodos: list.filter((todo) => todo.status === "uncompleted"),
  });

  useEffect(() => {
    setItems({
      completedTodos: list.filter((todo) => todo.status === "completed"),
      unCompletedTodos: list.filter((todo) => todo.status === "uncompleted"),
    });
  }, [list]);

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        // onDragOver={onDragOver}
      >
        <div className="mt-6 flex flex-col space-y-3 text-xs">
          <div className="flex flex-row items-center justify-between border-b border-stone-800 py-2">
            <div className="flex items-center space-x-4">
              <span>ToDo</span>
              <span className="text-stone-500"></span>
            </div>
            <span className="text-stone-500">Due</span>
          </div>

          <div>
            <Container
              todos={items.unCompletedTodos}
              projectId={projectId}
              id={"unCompletedTodos"}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col space-y-4 text-xs">
          <div className="flex flex-row items-center justify-between border-b border-stone-800 py-2">
            <div className="flex items-center space-x-4">
              <span>Completed</span>
              <span className="text-stone-500">items</span>
            </div>
            <span className="text-stone-500">Due</span>
          </div>

          <div>
            <Container
              todos={items.completedTodos}
              projectId={projectId}
              id={"completedTodos"}
            />
          </div>
        </div>
      </DndContext>
    </div>
  );
}
