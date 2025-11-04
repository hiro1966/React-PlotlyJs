# 病院ダッシュボード

[![GitHub](https://img.shields.io/badge/GitHub-React--PlotlyJs-blue?logo=github)](https://github.com/hiro1966/React-PlotlyJs)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://react.dev/)
[![Plotly](https://img.shields.io/badge/Plotly.js-3.2.0-3F4F75?logo=plotly)](https://plotly.com/javascript/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

React + Plotly.js で作成された病院の入院・外来患者データを可視化するダッシュボードアプリケーションです。

## 🔗 GitHub リポジトリ
**https://github.com/hiro1966/React-PlotlyJs**

## 機能

### 1. グラフ表示
- **入院患者データ**
  - 日毎（年度比較）
  - 日毎（科別）
  - 月毎（年度比較）
  - 月別（科別）

- **外来患者データ**
  - 日毎（年度比較）
  - 日毎（初再診）
  - 日毎（科別）
  - 月毎（年度比較）
  - 月毎（初再診）
  - 月別（科別）

### 2. インタラクティブ機能
- **左側メニュー**: グループ化されたメニューからグラフを選択
- **4分割表示**: 最大4つのグラフを同時表示
- **日付範囲スライダー**: 全グラフ共通の日付範囲フィルタ
- **ホバー表示**: グラフにカーソルを合わせると詳細な値を表示
- **右クリックメニュー**: 診療科別のドリルダウン、グラフクリア機能
- **グラフエリア選択**: メニューから選択時に表示エリア（1-4）を指定可能

### 3. データ
- **テストデータ**: 2023年〜2024年の2年分のモックデータ
- **診療科**: 内科、小児科、整形外科
- **入院患者**: 約8,200件
- **外来患者**: 約35,600件

## 技術スタック

### フロントエンド
- React 19
- Vite
- Plotly.js
- CSS3

### バックエンド
- Node.js
- Express
- SQLite (better-sqlite3)

## セットアップ

### 前提条件
- Node.js 20.x 以上
- npm

### インストール

1. **リポジトリのクローン**
```bash
git clone https://github.com/hiro1966/React-PlotlyJs.git
cd React-PlotlyJs
```

2. **依存関係のインストール**
```bash
npm install
```

3. **データベースの初期化**
```bash
node server/initDatabase.js
```

> 📝 **注意**: テストデータベース（`database/hospital.db`）はリポジトリに含まれていますが、
> データを再生成したい場合は上記コマンドを実行してください。

## 起動方法

### 開発環境

2つのターミナルを開いて、それぞれで以下のコマンドを実行してください。

**ターミナル1: バックエンドAPIサーバー**
```bash
npm run server
```
- ポート 3001 で起動します

**ターミナル2: フロントエンド開発サーバー**
```bash
npm run dev
```
- ポート 5173 で起動します（デフォルト）
- ブラウザで http://localhost:5173 を開きます

## 使い方

### 基本操作

1. **グラフの表示**
   - 左側のメニューから項目をクリック
   - 表示エリア（1-4）を入力してEnterキー

2. **日付範囲の変更**
   - 上部の日付入力欄で開始日・終了日を設定
   - または、プリセットボタン（直近1ヶ月、3ヶ月、6ヶ月、1年、全期間）を使用

3. **ドリルダウン**
   - グラフを右クリック
   - メニューから診療科を選択してフィルタ
   - 「すべての診療科」で全体表示に戻る

4. **グラフのクリア**
   - グラフを右クリック
   - 「グラフをクリア」を選択

### グラフの種類

- **折れ線グラフ**: 年度比較、初再診比較
- **積み上げ棒グラフ**: 科別データ

## プロジェクト構造

```
hospital-dashboard/
├── database/
│   └── hospital.db              # SQLiteデータベース
├── server/
│   ├── api.js                   # ExpressAPIサーバー
│   └── initDatabase.js          # データベース初期化スクリプト
├── src/
│   ├── components/
│   │   ├── ChartContainer.jsx   # グラフコンテナコンポーネント
│   │   ├── ChartGrid.jsx        # 4分割グリッドレイアウト
│   │   ├── ContextMenu.jsx      # 右クリックメニュー
│   │   ├── DateRangeSlider.jsx  # 日付範囲スライダー
│   │   └── Sidebar.jsx          # 左側メニュー
│   ├── App.jsx                  # メインアプリケーション
│   ├── App.css                  # アプリケーションスタイル
│   └── main.jsx                 # エントリーポイント
├── package.json
└── README.md
```

## API エンドポイント

### 入院患者データ
- `GET /api/inpatients/daily-by-year` - 日別（年度比較）
- `GET /api/inpatients/daily-by-dept` - 日別（科別）
- `GET /api/inpatients/monthly-by-year` - 月別（年度比較）
- `GET /api/inpatients/monthly-by-dept` - 月別（科別）

### 外来患者データ
- `GET /api/outpatients/daily-by-year` - 日別（年度比較）
- `GET /api/outpatients/daily-by-visit-type` - 日別（初再診）
- `GET /api/outpatients/daily-by-dept` - 日別（科別）
- `GET /api/outpatients/monthly-by-year` - 月別（年度比較）
- `GET /api/outpatients/monthly-by-visit-type` - 月別（初再診）
- `GET /api/outpatients/monthly-by-dept` - 月別（科別）

### その他
- `GET /api/departments` - 診療科一覧
- `GET /api/date-range` - データの日付範囲

### クエリパラメータ
- `startDate`: 開始日（YYYY-MM-DD形式）
- `endDate`: 終了日（YYYY-MM-DD形式）
- `department`: 診療科名（フィルタ用）

## データベーススキーマ

### 入院患者テーブル (inpatients)
```sql
CREATE TABLE inpatients (
  patient_id TEXT NOT NULL,
  admission_date TEXT NOT NULL,
  discharge_date TEXT,
  department TEXT NOT NULL,
  ward_name TEXT NOT NULL
);
```

### 外来患者テーブル (outpatients)
```sql
CREATE TABLE outpatients (
  patient_id TEXT NOT NULL,
  appointment_date TEXT NOT NULL,
  appointment_time TEXT NOT NULL,
  arrival_time TEXT,
  department TEXT NOT NULL,
  slot_name TEXT NOT NULL,
  first_visit INTEGER NOT NULL
);
```

## 今後の拡張案

1. **Oracle ODBC接続対応**
   - `server/api.js` のデータベース接続部分を変更
   - Oracle接続用のドライバを追加

2. **追加機能**
   - グラフのエクスポート（PNG、PDF）
   - データテーブル表示
   - 複数のダッシュボードレイアウト保存
   - ユーザー認証

3. **パフォーマンス最適化**
   - データキャッシング
   - 仮想スクロール
   - 遅延ロード

## ライセンス

MIT
