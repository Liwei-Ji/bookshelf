# 知識資源操作指南

本文件說明如何為書架上的書本新增知識學習資源。

---

## 目錄結構

```
public/knowledge/{book-slug}/
├── summary.json        ← 必要，定義所有知識內容
├── podcast.m4a         ← 選用，NotebookLM 語音
├── video.mp4           ← 選用，NotebookLM 影片
└── slides/             ← 選用，NotebookLM 簡報圖片
    ├── 01.png
    └── 02.png
```

`book-slug` 命名規則：書名小寫，空格換成 `-`，例如 `prompt-engineering`。

---

## 方式 A：Agent 生成文字分析

適用於**頁數少、檔案小**的書本。

### 1. 對 Agent 下指令

```
請使用 .agents/skills/SKILL.md 的規則，
分析 public/pdfs/{書名}.pdf，
depth = quick，
結果儲存到 public/knowledge/{book-slug}/summary.json
```

> `depth = quick` 只生成概覽 + 80/20 精華 + 一頁摘要  
> `depth = full` 生成完整十部分分析（大型書可能會截斷）

### 2. 審核 summary.json 內容品質

### 3. 在 books.json 加上 knowledgePath

```json
{
  "id": "7",
  "url": "pdfs/Prompt Engineering.pdf",
  "title": "Prompt Engineering",
  "knowledgePath": "knowledge/prompt-engineering/summary.json"
}
```

### 4. 推送

```bash
git add public/knowledge/{book-slug}/ public/pdfs/books.json
git commit -m "feat: add knowledge for {書名}"
git push origin main
```

---

## 方式 B：NotebookLM 產出物

適用於**頁數多、內容龐大**的書本，或需要語音、簡報等多媒體資源。

### 1. 建立資料夾並放入檔案

```bash
mkdir -p public/knowledge/{book-slug}/slides
```

將 NotebookLM 的產出物放入：
- 語音 → `podcast.m4a`
- 影片 → `video.mp4`
- 簡報 → `slides/01.png`, `slides/02.png`, ...

### 2. 建立 summary.json

```json
{
  "meta": {
    "bookTitle": "書名",
    "generatedAt": "ISO 8601 時間",
    "depth": "none",
    "language": "zh-TW"
  },
  "resources": [
    {
      "type": "audio",
      "label": "Podcast 語音摘要",
      "url": "knowledge/{book-slug}/podcast.m4a"
    },
    {
      "type": "slides",
      "label": "重點簡報 (PDF)",
      "url": "knowledge/{book-slug}/slides.pdf"
    },
    {
      "type": "slides",
      "label": "重點簡報 (圖片版)",
      "images": [
        "knowledge/{book-slug}/slides/01.png",
        "knowledge/{book-slug}/slides/02.png"
      ]
    },
    {
      "type": "video",
      "label": "影片解說",
      "url": "knowledge/{book-slug}/video.mp4"
    }
  ]
}
```

> 只放你有的資源類型，沒有的可以省略。

### 3. 在 books.json 加上 knowledgePath

（同方式 A 的步驟 3）

### 4. 推送

```bash
git add public/knowledge/{book-slug}/ public/pdfs/books.json
git commit -m "feat: add NotebookLM resources for {書名}"
git push origin main
```

---

## 方式 A + B 混合

同一本書可以同時包含 Agent 文字分析和 NotebookLM 產出物。  
`summary.json` 裡同時有 `part1_overview` 等欄位和 `resources` 欄位即可。

前端會自動顯示兩個 Tab：💡 知識要點 ／ 🎧 學習資源。

---

## resource type 對照

| type | 對應元素 | 檔案格式 |
|------|---------|---------|
| `audio` | `<audio>` 播放器 | `.m4a`, `.mp3` |
| `video` | `<video>` 播放器 | `.mp4` |
| `slides` | 圖片輪播或內嵌文件 | `.png`, `.jpg`, `.pdf` (直接顯示), `.ppt` (連結) |

---

## 注意事項
- GitHub Pages 單檔上限 **100MB**，repo 建議不超過 **1GB**
 
