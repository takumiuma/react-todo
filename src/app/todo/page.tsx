"use client"; // クライアントコンポーネントであることを指定

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Todo, useTodoService } from "@/services/TodoService";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Todo must be at least 1 characters.",
  }),
  person: z.string().min(1, {
    message: "User must be at least 1 characters.",
  }),
});

export default function Page() {
  const { fetchTodos, createTodo, updateTodo, deleteTodo } = useTodoService();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo>({
    id: 0,
    title: "",
    person: "",
    done: false,
  });

  const getTodos = async () => {
    setTodos(await fetchTodos());
  };

  // 初期描画時にTodoリストを取得
  useEffect(() => {
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //　空の配列を第2引数に渡すことで初回のみ実行される

  const addTodo = async (values: { title: string; person: string }) => {
    await createTodo({
      id: undefined,
      title: values.title,
      person: values.person,
      done: false,
    });
    getTodos();
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const saveTodo = async () => {
    if (editingTodo) {
      await updateTodo({
        ...editingTodo,
      });
      setEditingTodo({
        id: 0,
        title: "",
        person: "",
        done: false,
      });
      getTodos();
    }
  };

  const toggleDone = async (todo: Todo) => {
    await updateTodo({
      ...todo,
      done: !todo.done,
    });
    getTodos();
  };

  const removeTodo = async (id: number) => {
    await deleteTodo(id);
    getTodos();
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      person: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await addTodo(values);
  };

  return (
    <div className="p-4">
      <div className="mt-4">
        <h1 className="text-2xl font-bold mb-4">Todo App</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Todo</FormLabel>
                  <FormControl>
                    {/* valueやonChangeを入れるとオーバーライドになって検証する値が取れないっぽい */}
                    <Input {...field} placeholder="New Todo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="person"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Person</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Person" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">register</Button>
          </form>
        </Form>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Person</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo: Todo) => (
              <TableRow key={todo.id}>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.person}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => toggleDone(todo)}
                    className={`px-2 py-1 rounded-md ${
                      todo.done ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                    }`}
                  >
                    {todo.done ? "Done" : "In progress"}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    {/* DialogTriggerはDialog内に配置しないとエラーになる */}
                    <DialogTrigger asChild>
                      <Button onClick={() => startEditing(todo)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                        <DialogDescription />
                      </DialogHeader>
                      <Input
                        value={editingTodo.title}
                        onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                        placeholder="Title"
                      />
                      <Input
                        value={editingTodo.person}
                        onChange={(e) => setEditingTodo({ ...editingTodo, person: e.target.value })}
                        placeholder="Person"
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={saveTodo}>Save</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => removeTodo(todo.id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
