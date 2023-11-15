# visual regression test tool

以下の css 削減における regression test ために作られました。

- <https://tickets.tools.misumi.jp/jira/browse/NEW_FE-4295>
- <https://github.com/misumi-org/order-web-my/pull/1349>

tests/visual/pages などへの配置も検討しましたが、自動テストとして手本になるようなものにならないことと、tests ディレクトリが 2023/5/29 現在存在しないこともあり、tests ではなく tools 以下に配置することにしました。

## Usage

```bash
# テスト対象の URL を以下のファイルに改行区切りで記載
touch urls.txt

# 修正前の状態で実行します
npm run test

# 修正後の状態で実行します
npm run test
```

画面キャプチャの画像は commit しないでください。

## テスト実行時の注意事項

playwright.config.ts で worker の数を 16 に設定していますが、これは実行する PC によっては多すぎます。
実行する PC のスペックに応じて調整してください。

また、npm run start している側の terminal の出力に気をつけてください。何らかの理由でリクエストがエラーになっていることがあります。
過去には「worker の数が多すぎて CPU 使用率が 100% に張り付き、ページのレスポンスが遅くなりすぎて
テストがタイムアウトし、その結果コネクションが切断され、API リクエストもキャンセルされてエラーになった」
などの事象が起きています。リソースが足りているか、実行時に充分確認した上で、
npm run start している側の terminal でエラーログが出力されていないか、気を付けてください。
