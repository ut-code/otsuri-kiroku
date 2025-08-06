# お釣り記録

## 開発

### 環境構築

事前に Bun と Node.js をインストールしてください。 (npm は不要)

```sh
bun install
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
