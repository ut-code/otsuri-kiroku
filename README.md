# Otsuri Kiroku

Modern SvelteKit app running on Bun with experimental Remote Functions, Tailwind v4, DaisyUI, Prisma (SQLite), and Storybook-driven UI testing.

## 開発 (Development)

### セットアップ (Setup)

事前に Bun と Node.js をインストールしてください。
（アプリ実行は Bun。Prisma の CLI/Studio には Node.js が必要です。）

```sh
bun install --frozen-lockfile

# データベースの作成 / 反映 (SQLite)
bunx prisma db push
```

必要な環境変数は `.env` に設定します（コミットしないでください）。

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

### コマンド (Commands)

```sh
bun dev                 # 開発サーバー起動 (http://localhost:3000)
bun run build           # 本番ビルド (出力先: target/)
bun preview             # 本番ビルドのプレビュー

bun sync                # SvelteKit 同期（型/生成物の同期）
bun check               # 型 / Lint / Format の一括チェック
bun fix                 # 自動修正 (ESLint + Prettier)

# Storybook
bun storybook           # Storybook 起動 (http://localhost:6006)
bun build-storybook     # Storybook 本番ビルド

# Prisma
bunx prisma db push     # スキーマ反映
bunx prisma studio      # DB GUI を開く
bunx prisma generate    # Prisma Client 生成（必要に応じて）
```

注: 上記 Prisma コマンドの実行には Node.js が必要です。

### スタック (Stack)

- Bun（Node.js ではありません）
- SvelteKit + Svelte 5（Runes / async）
- Experimental Remote Functions（型安全なクライアント↔サーバー）
- TailwindCSS v4 + DaisyUI
- Prisma（SQLite）
- Storybook（相互作用テスト）

## デプロイ (Deployment)

```sh
bun run build
cd target
bun start
```

ビルド成果物は `target/` に出力され、Bun ランタイム上で動作します。
（アプリ実行に Node.js は不要ですが、Prisma の CLI/Studio には Node.js が必要です。）
