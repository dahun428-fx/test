# ect-api model generator

## ect-api model generator とは

- ect-api model generator は API モデル生成支援ツールです。
  generate したファイルは API 外部設計書と照合して必要に応じて手直ししてください。

## はじめに

1. npm install 実行

## generate 手順

1. order-web-my リポジトリと同階層である ect-api-docs ディレクトリ に generate 対象の API 外部設計書を置く。
2. 既に generate 済のファイルがあれば上書きされてしまうため、どこかに待避しておく
3. npm run generate 実行

## Usage

```
npm run generate
```
