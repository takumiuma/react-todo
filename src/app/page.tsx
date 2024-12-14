// サーバーコンポーネント。初期描画時にサーバーサイドでデータを取得する。

import TodoView from "./components/TodoView";

// getServerSidePropsはapp/でサポートされてないようなので、後々別ディレクトレクトりに作成する
// Read more: https://nextjs.org/docs/app/building-your-application/data-fetching
// import { Todo, fetchInitialTodos } from "./components/TodoService";

// export async function getServerSideProps() {
//   const initialTodos: Todo[] = await fetchInitialTodos();
//   return {
//     props: {
//       initialTodos,
//     },
//   };
// }

// interface PageProps {
//   initialTodos: Todo[];
// }

export default function Page() {
  // export default function Page(pageProps: PageProps) {
  return (
    <div>
      <TodoView />
      {/* <TodoView initialTodos={pageProps.initialTodos} /> */}
    </div>
  );
}
