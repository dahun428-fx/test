# order-web-my/ec

## 参考資料

- welcome Guide
  <https://tickets.tools.misumi.jp/confluence/pages/viewpage.action?spaceKey=V5&title=Welcome+Guide>
- 知識の泉
  <https://tickets.tools.misumi.jp/confluence/pages/viewpage.action?pageId=103032998>
- 開発ルール（差分）
  <https://tickets.tools.misumi.jp/confluence/pages/viewpage.action?pageId=113573658>

## ローカル環境構築

### はじめに

1. Node.js バージョン管理ツールでは、nvm-windows また Volta[https://volta.sh/] が使えます。

   - Node.js: 18.17.0
   - npm 9.6.7 (Node.js 18.17.0 に同梱されています)

   ①- nvm-windows の version は任意。

   ```bash
   nvm list available    # install 可能な node.js のバージョンリスト
   nvm install <version> # node.js の install
   nvm use <version>     # 指定のバージョンの node.js の利用設定
   # 以下は not windows の場合のみ必要
   nvm alias default 18.17.0 <version>
   ```

   ②- Volta の Node.js、npm の設定は、`package.json` に記載しております。

   ```json
   "volta": {
      "node": "18.17.0",
      "npm": "9.6.7"
   }
   ```

   ```shell
   curl https://get.volta.sh | bash   # Voltaをインストール
   volta install node@<version> # バージョンを指定して Node.js の install
   volta pin node@<version> # 特定のバージョンの Node.js をプロジェクトに固定する。
   ```

1. アプリ + 各ツール群の必要箇所で npm ci しておく。(★ の箇所)

   ```js
   ec                        // ★ order-web-my アプリのec配下
   ├── tools
   │   ├── config-generator // ★ config自動生成ツール
   │   ├── cors-proxy               // ★ 別ドメインのサーバー参照
   │   ├── ect-api-model-generator  // ★ エクセルファイルからapiモデルを生成
   ...
   ```

### 環境設定を変更する(2 箇所)

1. ec 配下に .env.local ファイルを作成する。(.env と同じ箇所などに)
   $ cp .env.local.example .env.local #サンプルファイルから .env.local を複製

2. src/tools/cors-proxy 配下に .env.local ファイルを作成する。(.env と同じ箇所などに)
   $ cp .env.local.example .env.local#サンプルファイルから
   .env.local を複製したのち Basic auth user name と Basic auth password を記載する。（stg0 と一緒の ID とパスワード）
   ※わからなかったら知っていそうな人に聞いてください。

## アプリを起動する

両方起動してください:

```bash
npm run dev
```

```bash
cd tools/cors-proxy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 各種 npm scripts 紹介

```bash
npm run start # ローカルサーバ起動
npm run build # アプリのビルド
npm run lint # コードフォーマット
npm run generate # config ファイルを生成
npm run generate:config # config ファイルを生成
npm run storybook # storybook の起動
build-storybook # storybook をビルド
npm run stylelint-check # stylelint と prettier でルール競合があるかをチェック
```

## Tools

### ect-api-model-generator

Read the followings:

- tools/ect-api-model-generator/README.md

## セルフチェックリスト

```md
- [ ] npm run lint がエラーなく完了する
- [ ] npm run build && npm run build:mobile がエラーなく完了する
- [ ] Storybook が起動できる、かつブラウザで参照したときにコンソールエラーが出ていない
- [ ] 入力可能な文字列が dangerouslySetInnerHTML にセットされていない (過去実際にあったセキュリティリスク事案です)
- [ ] (mobile 開発の場合) 幅 360 でレイアウト崩れがないこと
- [ ] (みらい PJ の開発の場合) !! Make sure that the merged file is facing "develop-mirai". マージの向き先が確実に "develop-mirai" であることを確認する !!
```

## windows を利用する際の注意点

```bash
npm run lint
```

を実行すると、windws ではシングルクオーテーションを正しく引数として認識できないため、ダブルクオー
テーションを使う必要があるので
package.json の scripts を以下のように書き換えが必要。

```json
"lint": "next lint && eslint --fix \"{config,tools}/**/*.{ts,tsx}\" && prettier -w . && stylelint --fix \"src/**/*.{css,scss,sass}\""
```

## コンポーネント作成時の注意点

コンポーネントを１から作成する前に、一度 storybook を確認するようにしましょう。
既に使いまわしされているコンポーネントがある可能性がある為です。
storybook とは UI のカタログを作るツールで、各 component の UI や props に応じた挙動の確認、component 単位でドキュメントを用意することを可能にしてくれます。

以下コマンドで起動可能です。

```bash
npm run storybook
```
