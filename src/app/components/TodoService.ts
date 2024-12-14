import axios from "axios";

const domain = "http://localhost:8080";

interface ResponseTodo {
  id: { value: number | null };
  title: { value: string };
  person: { value: string };
  done: { value: boolean };
}

interface RequestTodo {
  id: number | undefined;
  title: string;
  person: string;
  done: boolean;
}

export interface Todo {
  id: number | null;
  title: string;
  person: string;
  done: boolean;
}

// ResponseTodo[]からTodo[]に変換する関数
const convertResponseToTodos = (responseTodos: ResponseTodo[]): Todo[] => {
  return responseTodos.map((todo: ResponseTodo) => ({
    id: todo.id.value,
    title: todo.title.value,
    person: todo.person.value,
    done: todo.done.value,
  }));
};

// 初期のTodoリストを取得する関数
export async function fetchInitialTodos(): Promise<Todo[]> {
  try {
    const response = await axios.get("/api/todos");
    return convertResponseToTodos(response.data.todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
}

/**
 * クライアントコンポーネントで使う関数
 */
// 最新のTodoリストを取得する関数
const fetchTodos = async () => {
  try {
    const response = await axios.get(`${domain}/v1/todos`);
    return convertResponseToTodos(response.data.todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

// Todoを追加する関数
const createTodo = async (newTodo: RequestTodo) => {
  try {
    await axios.post(`${domain}/v1/todos`, newTodo);
  } catch (error) {
    console.error("Error adding todo:", error);
  }
};

export const useTodoService = () => ({
  fetchTodos,
  createTodo,
});
