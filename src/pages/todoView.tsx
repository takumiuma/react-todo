"use client"; // クライアントコンポーネントであることを指定

import { useState, useEffect } from "react";
import { Todo, useTodoService } from "@/services/TodoService";
import Modal from "@/components/Modal";

export function TodoView() {
  // export default function TodoView({ initialTodos }: TodoViewProps) {
  const { fetchTodos, createTodo, updateTodo, deleteTodo } = useTodoService();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo>({
    id: 0, // リクエスト時には使用しない
    title: "",
    person: "",
    done: false, // リクエスト時には使用しない
  });
  const [editingTodo, setEditingTodo] = useState<Todo>({
    id: 0,
    title: "",
    person: "",
    done: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTodos = async () => {
    setTodos(await fetchTodos());
  };

  // 初期描画時にTodoリストを取得
  useEffect(() => {
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //　空の配列を第2引数に渡すことで初回のみ実行される

  const addTodo = async () => {
    await createTodo({
      id: undefined,
      title: newTodo.title,
      person: newTodo.person,
      done: false,
    });
    setNewTodo({
      id: 0,
      title: "",
      person: "",
      done: false,
    });
    getTodos();
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
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
      setIsModalOpen(false);
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <input
        type="text"
        value={newTodo.title}
        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        placeholder="New Todo"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        value={newTodo.person}
        onChange={(e) => setNewTodo({ ...newTodo, person: e.target.value })}
        placeholder="Person"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <button
        onClick={addTodo}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        登録
      </button>
      <div className="mt-4">
        <div className="flex justify-between p-2 border-b border-gray-300 font-bold">
          <span className="w-1/4">Title</span>
          <span className="w-1/4">Person</span>
          <span className="w-1/4">Status</span>
          <span className="w-1/4 flex justify-end">Actions</span>
        </div>
        <ul>
          {todos.map((todo: Todo) => (
            <li key={todo.id} className="flex justify-between p-2 border-b border-gray-300">
              <span className="w-1/4">{todo.title}</span>
              <span className="w-1/4">{todo.person}</span>
              <span className="w-1/4">
                <button
                  onClick={() => toggleDone(todo)}
                  className={`px-2 py-1 rounded-md ${
                    todo.done ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  {todo.done ? "Done" : "In progress"}
                </button>
              </span>
              <div className="w-1/4 flex justify-end space-x-2">
                <button
                  onClick={() => startEditing(todo)}
                  className="text-blue-500 hover:text-blue-700"
                >
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
                </button>
                <button
                  onClick={() => removeTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
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
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
        <input
          type="text"
          value={editingTodo.title}
          onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
          placeholder="Title"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={editingTodo.person}
          onChange={(e) => setEditingTodo({ ...editingTodo, person: e.target.value })}
          placeholder="Person"
          className="w-full p-2 mb-4 border border-gray-300 rounded-md"
        />
        <button
          onClick={saveTodo}
          className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          保存
        </button>
      </Modal>
    </div>
  );
}
