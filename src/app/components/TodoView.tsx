"use client"; // クライアントコンポーネントであることを指定

import { useState, useEffect } from "react";
import { Todo, useTodoService } from "../components/TodoService";

// interface TodoViewProps {
//   initialTodos: Todo[];
// }

export default function TodoView() {
  // export default function TodoView({ initialTodos }: TodoViewProps) {
  const { fetchTodos, createTodo, updateTodo, deleteTodo } = useTodoService();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [assignPerson, setAssignPerson] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

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
      title: newTodoTitle,
      person: assignPerson,
      done: false,
    });
    setNewTodoTitle(""); // 入力欄をリセット
    setAssignPerson(""); // 入力欄をリセット
    getTodos(); // 最新のTodoリストを取得
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodoTitle(todo.title);
    setAssignPerson(todo.person);
  };

  const saveTodo = async () => {
    if (editingTodo) {
      await updateTodo({
        ...editingTodo,
        title: newTodoTitle,
        person: assignPerson,
      });
      setEditingTodo(null);
      setNewTodoTitle(""); // 入力欄をリセット
      setAssignPerson(""); // 入力欄をリセット
      getTodos(); // 最新のTodoリストを取得
    }
  };

  const removeTodo = async (id: number) => {
    await deleteTodo(id);
    getTodos(); // 最新のTodoリストを取得
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="New Todo"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        value={assignPerson}
        onChange={(e) => setAssignPerson(e.target.value)}
        placeholder="Person"
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />
      {editingTodo ? (
        <button
          onClick={saveTodo}
          className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Save
        </button>
      ) : (
        <button
          onClick={addTodo}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          登録
        </button>
      )}
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
              <span className="w-1/4">{todo.done ? "Done" : "In progress"}</span>
              <div className="w-1/4 flex justify-end space-x-2">
                <button
                  onClick={() => startEditing(todo)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
