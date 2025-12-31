# 開発環境用
FROM node:20.11.0

# 作業ディレクトリ
WORKDIR /usr/src/app

# package.jsonとpackage-lock.jsonをコピー（キャッシュ効率化）
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースをコピー
COPY . .

# Next.jsの開発サーバーポート
EXPOSE 3000

# 開発サーバー起動
CMD ["sh", "-c", "if [ -f package.json ]; then npm run dev; else sleep infinity; fi"]
