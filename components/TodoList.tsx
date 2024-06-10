"use client";

import React from "react";
import TodoItem from "@/components/TodoItem";
import { ListItem } from "./InputComponent";

export default function TodoList({
  list,
  projectId,
}: Readonly<{ list: ListItem[]; projectId: number }>) {
  const unCompatedTodos = list
    .filter((todo) => todo.status === "uncompleted")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const completedTodos = list
    .filter((todo) => todo.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <>
      {unCompatedTodos.length > 0 && (
        <div className="mt-6 flex flex-col space-y-4 text-xs">
          <div className="flex flex-row items-center justify-between border-b border-stone-800 py-2">
            <div className="flex items-center space-x-4">
              <span>ToDo</span>
              <span className="text-stone-500">
                {unCompatedTodos.length} items
              </span>
            </div>
            <span className="text-stone-500">Due</span>
          </div>

          {unCompatedTodos.map((todo) => (
            <TodoItem projectId={projectId} key={todo.id} item={todo} />
          ))}
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

          {completedTodos.map((todo) => (
            <TodoItem projectId={projectId} key={todo.id} item={todo} />
          ))}
        </div>
      )}
    </>
  );
}
