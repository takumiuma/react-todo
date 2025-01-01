// サーバーコンポーネント。初期描画時にサーバーサイドでデータを取得する。

import { TodoView } from "@/pages/todoView";

// getServerSidePropsはapp/でサポートされてないようなので、後々別ディレクトレクトりに作成する
// Read more: https://nextjs.org/docs/app/building-your-application/data-fetching

export default function Page() {
  return (
    <div>
      {/* pages router */}
      <TodoView />
    </div>
  );
}
