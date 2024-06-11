"use client";

import React, { useEffect, useState } from "react";
import TodoItem from "@/components/TodoItem";
import { ListItem } from "./InputComponent";
import {
  DndContext,
  DragOverEvent,
  MouseSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

export default function TodoList({
  list,
  projectId,
}: Readonly<{ list: ListItem[]; projectId: string }>) {
  // console.log("list", list);
  const [unCompletedTodos, setUnCompletedTodos] = useState(
    list.filter((todo) => todo.status === "uncompleted"),
  );
  const [completedTodos, setCompletedTodos] = useState(
    list.filter((todo) => todo.status === "completed"),
  );

  useEffect(() => {
    setUnCompletedTodos(list.filter((todo) => todo.status === "uncompleted"));
    setCompletedTodos(list.filter((todo) => todo.status === "completed"));
  }, [list]);

  const getTaskPos = (id: string, tasks: ListItem[]) =>
    tasks.findIndex((t) => t.id === id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const {
      active: { id: activeId },
    } = event; // Get active item ID

    if (active && over && active.id === over.id) return;
    if (over) {
      if (
        over.data.current?.type === "uncompleted" &&
        active?.data.current?.type === "completed"
      ) {
        // Moved from "completed" to "uncompleted"
        setCompletedTodos((tasks) => tasks.filter((t) => t.id !== activeId));
        setUnCompletedTodos((tasks) => {
          const newPos = getTaskPos(String(over.id), tasks);
          const item = completedTodos.find((t) => t.id === activeId)!;
          item.status = "uncompleted";
          const newArr = [item, ...tasks];

          return arrayMove(newArr, 0, newPos);
        });
      } else if (
        over.data.current?.type === "completed" &&
        active?.data.current?.type === "uncompleted"
      ) {
        // Moved from "uncompleted" to "completed"
        setUnCompletedTodos((tasks) => tasks.filter((t) => t.id !== activeId));
        setCompletedTodos((tasks) => {
          const newPos = getTaskPos(String(over.id), tasks);
          const item = unCompletedTodos.find((t) => t.id === activeId)!;
          item.status = "completed";
          const newArr = [item, ...tasks];
          return arrayMove(newArr, 0, newPos);
        });

        return;
      }

      const isCompleted = completedTodos.some((todo) => todo.id === activeId);
      if (isCompleted) {
        setCompletedTodos((tasks) => {
          const originalPos = getTaskPos(String(active.id), tasks);
          const newPos = getTaskPos(String(over.id), tasks);
          return arrayMove(tasks, originalPos, newPos);
        });
      } else {
        setUnCompletedTodos((tasks) => {
          const originalPos = getTaskPos(String(active.id), tasks);
          const newPos = getTaskPos(String(over.id), tasks);
          return arrayMove(tasks, originalPos, newPos);
        });
      }
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      onActivation: (event) => console.log("onActivation", event),
      activationConstraint: { distance: 5 },
    }),
  );

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (active && over && active.id === over.id) return;

    const isActiveTask = active.data.current?.type === over?.data.current?.type;
    if (isActiveTask) return;

    // if (over?.data.current?.type === "completed" && over) {
    //   setCompletedTodos((tasks) => {
    //     const originalPos = getTaskPos(String(active.id), tasks);
    //     const newPos = getTaskPos(String(over.id), tasks);
    //     return arrayMove(tasks, originalPos, newPos);
    //   });
    // } else if (over) {
    //   setUnCompletedTodos((tasks) => {
    //     const originalPos = getTaskPos(String(active.id), tasks);
    //     const newPos = getTaskPos(String(over.id), tasks);
    //     return arrayMove(tasks, originalPos, newPos);
    //   });
    // }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        onDragOver={onDragOver}
      >
        {unCompletedTodos.length > 0 && (
          <div className="mt-6 flex flex-col space-y-3 text-xs">
            <div className="flex flex-row items-center justify-between border-b border-stone-800 py-2">
              <div className="flex items-center space-x-4">
                <span>ToDo</span>
                <span className="text-stone-500">
                  {unCompletedTodos.length} items
                </span>
              </div>
              <span className="text-stone-500">Due</span>
            </div>

            <SortableContext id="123" items={unCompletedTodos}>
              {unCompletedTodos.map((todo) => (
                <TodoItem projectId={projectId} key={todo.id} item={todo} />
              ))}
            </SortableContext>
          </div>
        )}

        {completedTodos.length > 0 && (
          <div className="mt-6 flex flex-col space-y-4 text-xs">
            <div className="flex flex-row items-center justify-between border-b border-stone-800 py-2">
              <div className="flex items-center space-x-4">
                <span>Completed</span>
                <span className="text-stone-500">
                  {completedTodos.length} items
                </span>
              </div>
              <span className="text-stone-500">Due</span>
            </div>

            <SortableContext id="321" items={completedTodos}>
              {completedTodos.map((todo) => (
                <TodoItem projectId={projectId} key={todo.id} item={todo} />
              ))}
            </SortableContext>
          </div>
        )}
      </DndContext>
    </div>
  );
}
