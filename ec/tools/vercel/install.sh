#!/bin/bash
# vercel npm install 用スクリプト(vercel では１コマンドしかinstall用スクリプトを指定できないため、1回でinstallするスクリプトを作成)
npm ci
npm --prefix tools/config-generator ci
npm --prefix tools/cors-proxy ci
