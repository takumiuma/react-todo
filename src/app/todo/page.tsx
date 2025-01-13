"use client"; // クライアントコンポーネントであることを指定

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Todo, useTodoService } from "@/services/TodoService";
import { User, useUserService } from "@/services/UserService";

const formTodoSchema = z.object({
  title: z.string().min(1, {
    message: "Todo must be at least 1 characters.",
  }),
  user: z.string({
    required_error: "Please select a User.",
  }),
});

const formUserSchema = z.object({
  name: z.string().min(1, {
    message: "User must be at least 1 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phoneNumber: z.string().min(1, {
    message: "Phone number must be at least 1 characters.",
  }),
});

export default function Page() {
  const router = useRouter();

  const { fetchTodos, createTodo, updateTodo, deleteTodo } = useTodoService();
  const [todos, setTodos] = useState<Todo[]>([]);
  const { fetchUsers, registUser } = useUserService();
  const [users, setUsers] = useState<User[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo>({
    id: 0,
    title: "",
    person: "",
    done: false,
  });

  const getTodos = async () => {
    setTodos(await fetchTodos());
  };

  const getUsers = async () => {
    setUsers(await fetchUsers());
  };

  // 初期描画時にTodoリストを取得
  useEffect(() => {
    getTodos();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //　空の配列を第2引数に渡すことで初回のみ実行される

  const addTodo = async (values: { title: string; user: string }) => {
    await createTodo({
      id: undefined,
      title: values.title,
      person: values.user,
      done: false,
    });
    getTodos();
  };

  const addUser = async (values: { user: string }) => {
    await registUser({
      id: undefined,
      name: values.user,
      email: "",
      phoneNumber: "",
    });
    getUsers();
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

  const todoForm = useForm<z.infer<typeof formTodoSchema>>({
    resolver: zodResolver(formTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  const userForm = useForm<z.infer<typeof formUserSchema>>({
    resolver: zodResolver(formUserSchema),
    defaultValues: {
      name: "",
    },
  });

  // submitHandlerの定義
  const onSubmitTodo = async (values: z.infer<typeof formTodoSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await addTodo(values);
  };

  const onSubmitUser = async (values: z.infer<typeof formUserSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <div className="p-4">
      <div className="mt-4">
        <div className="flex justify-between mb-4">
          <span className="text-2xl font-bold">Todo App</span>
          <Button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-600">
            tailwind cssのみで作ったページを開く
          </Button>
        </div>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <div className="text-xl font-bold px-4 pb-4">Todo Registration</div>
            <Form {...todoForm}>
              <form onSubmit={todoForm.handleSubmit(onSubmitTodo)} className="space-y-8 px-4">
                <FormField
                  control={todoForm.control}
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
                  control={todoForm.control}
                  name="user"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Select User</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? users.find((user) => user.name === field.value)?.name
                                : "Select user"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search User..." />
                            <CommandList>
                              <CommandEmpty>No User found.</CommandEmpty>
                              <CommandGroup>
                                {users.map((user) => (
                                  <CommandItem
                                    value={user.name}
                                    key={user.id}
                                    onSelect={() => {
                                      todoForm.setValue("user", user.name);
                                    }}
                                  >
                                    {user.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        user.name === field.name ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">register</Button>
                </div>
              </form>
            </Form>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            {/* 担当者登録 */}
            <div className="text-xl font-bold px-4 pb-4">User Registration</div>
            <Form {...userForm}>
              <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-8 px-4">
                <FormField
                  control={userForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="User Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone Number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">register</Button>
                </div>
              </form>
            </Form>
          </ResizablePanel>
        </ResizablePanelGroup>
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
