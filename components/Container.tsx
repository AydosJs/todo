"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ListItem } from "./InputComponent";
import TodoItem from "./TodoItem";
import { useDroppable } from "@dnd-kit/core";

export default function Container({
  todos,
  projectId,
  id,
}: Readonly<{
  todos: ListItem[];
  projectId: string;
  id: string;
}>) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={todos}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef}>
        {todos.map((todo) => (
          <TodoItem projectId={projectId} key={todo.id} item={todo} />
        ))}
      </div>
    </SortableContext>
  );
}
