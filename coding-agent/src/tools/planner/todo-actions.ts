import { tool } from "ai";
import type { SingleTodo, Todos, UpdateTodoStatus } from "../../types/tool-types";
import { SingleTodoSchema, TodosSchema, UpdateTodoStatusSchema } from "../../types/tool-types"
import z from "zod";

function createTodo({ id, priority, status, todo }: SingleTodo): SingleTodo {
  return {
    id,
    priority,
    status,
    todo,
  };
}

function createAllTodos(todos: SingleTodo[]): Todos {
  return {
    todos,
  };
}

function getNextPendingTodo(todos: SingleTodo[]): SingleTodo|null{
    return todos.find(
        t => t.status === "ongoing" || t.status === "not completed"
    ) || null
}

function updateTodoStatus({ id, status, todos }: UpdateTodoStatus): Todos{
    return{
        todos: todos.todos.map(
            t => t.id === id ? {...t, status} : t
        )
    }
}

function areAllTodosCompleted(todos: Todos): boolean{
    return todos.todos.every(t => t.status === "completed") ? true : false
}


export const createTodoTool = tool({
    description: "creates a todo",
    inputSchema: SingleTodoSchema,
    outputSchema: SingleTodoSchema,
    execute: createTodo
})

export const createAllTodosTool = tool({
    description: "compiles all the single todos and creates all the todos",
     inputSchema: z.array(SingleTodoSchema),
     outputSchema: TodosSchema,
     execute: createAllTodos
})

export const getNextPendingTodoTool = tool({
    description: "get the next pending or not completed todo",
    inputSchema: z.array(SingleTodoSchema),
    outputSchema: SingleTodoSchema || null,
    execute: getNextPendingTodo
})

export const updateTodoStatusTool = tool({
    description: "get the respective todo using the id and update its status",
    inputSchema: UpdateTodoStatusSchema,
    outputSchema: TodosSchema,
    execute: updateTodoStatus,    
})

export const checkIfAllTodosAreCompletedTool = tool({
    description: "checks if all the todos are completed or not. returns true/false",
    inputSchema: TodosSchema,
    execute: areAllTodosCompleted
})
