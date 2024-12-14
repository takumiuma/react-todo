"use client"; // クライアントコンポーネントであることを指定

import { useState, useEffect } from "react";
import { Todo, useTodoService } from "../components/TodoService";

// interface TodoViewProps {
//   initialTodos: Todo[];
// }

export default function TodoView() {
  // export default function TodoView({ initialTodos }: TodoViewProps) {
  const { fetchTodos, createTodo } = useTodoService();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [assignPerson, setAssignPerson] = useState("");

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
      id: 0,
      title: newTodoTitle,
      person: assignPerson,
      done: false,
    });
    setNewTodoTitle(""); // 入力欄をリセット
    setAssignPerson(""); // 入力欄をリセット
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
      <button
        onClick={addTodo}
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        登録
      </button>
      <div className="mt-4">
        <div className="flex justify-between p-2 border-b border-gray-300 font-bold">
          <span className="w-1/3">Title</span>
          <span className="w-1/3">Person</span>
          <span className="w-1/3">Status</span>
        </div>
        <ul>
          {todos.map((todo: Todo) => (
            <li key={todo.id} className="flex justify-between p-2 border-b border-gray-300">
              <span className="w-1/3">{todo.title}</span>
              <span className="w-1/3">{todo.person}</span>
              <span className="w-1/3">{todo.done ? "Done" : "In progress"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
