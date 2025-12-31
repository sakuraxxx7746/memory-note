# プロジェクト ガイドライン（Copilot用）

## 使用技術

- Next.js App Router（TypeScript）
- すべてのページはclientページとして使用する
- Supabase をバックエンドとして使用
- Supabase クライアント：`lib/supabase/client.ts`
<!-- - Supabase 型定義：`src/types/supabase.ts` -->

## アーキテクチャ規約

- データ取得（fetch）は hooks (`hooks`) に分離する
- DB アクセス（クエリ処理）は `lib/api` にまとめる
- UI は `components` に配置
- ページは `app/**/page.tsx` に置く

## UI

- 指示がない限り、Tailwind CSS Shadcn UI でUIを作成する
- Shadcn UIはcomponents/uiにあるものを使用する
- フォームは react-hook-form + zod を使用する

## Copilot への指示

- 必ずこの構造と規約に沿ってコードを生成すること
- 既存の型定義・クライアントコードを参照すること
- Supabase クエリは型定義付きで生成すること
- 必要に応じて改善提案も行うこと
