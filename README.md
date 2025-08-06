# Aida

## 開発

### 環境構築

事前に Bun と Node.js と NPM をインストールしてください。

```sh
bun install
bunx prisma db push # データベースを更新 / 作成
```

### コマンド

```sh
bun dev # 開発用サーバーを起動
bun sync # コード生成の動機
bun check # すべてのチェックを実行
bun fix # フォーマット修正
```

### スタック

- Svelte (+ Async)
- SvelteKit (+ Remote Functions)
- Bun
- TailwindCSS
- DaisyUI

## デプロイ

### コマンド

```sh
bun run build # ビルド
cd target; bun start # サーバー起動
```
