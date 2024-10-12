# Verse Closet

![Deploy workflow](https://github.com/mtsgi/verse-closet/actions/workflows/deploy.yml/badge.svg)

## 開発

### Setup

パッケージをインストールします

```bash
npm install
```

### Development Server

`http://localhost:3000` で開発サーバーが起動します

```bash
npm run dev -- --host
```

### Production

GitHub Pagesでホスティング可能なSPAとしてビルドします

```bash
npm run build -- --preset github_pages
```
