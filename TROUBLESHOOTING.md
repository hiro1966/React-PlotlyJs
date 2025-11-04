# トラブルシューティングガイド

## よくある問題と解決方法

### 1. グラフに "エラー: Failed to fetch" と表示される

**症状**: グラフエリアに "エラー: Failed to fetch" というメッセージが表示され、グラフが表示されない。

**原因**: フロントエンドからバックエンドAPIへの接続に失敗している。

**解決方法**:
1. **ブラウザをリロード**: F5キーまたはCtrl+R (Mac: Cmd+R) でページをリロードする
2. **キャッシュクリア**: Ctrl+Shift+R (Mac: Cmd+Shift+R) で強制リロード
3. **バックエンドサーバーの確認**:
   ```bash
   # バックエンドが起動しているか確認
   curl http://localhost:3001/api/departments
   # 結果: ["内科","小児科","整形外科"] が返ってくればOK
   ```

4. **Viteプロキシの確認**:
   ```bash
   # プロキシ経由でAPIにアクセスできるか確認
   curl http://localhost:5173/api/departments
   # 結果: ["内科","小児科","整形外科"] が返ってくればOK
   ```

### 2. "Blocked request" エラーが表示される

**症状**: "This host is not allowed" というエラーメッセージが表示される。

**原因**: Viteのセキュリティ設定で、アクセス元のホストが許可されていない。

**解決方法**:
`vite.config.js` の `allowedHosts` にホストを追加してください:

```javascript
server: {
  allowedHosts: [
    'your-host-name.sandbox.novita.ai',
    '.sandbox.novita.ai'
  ],
}
```

### 3. ポート番号が変わってしまう

**症状**: Viteサーバーが5173ではなく、5174や5175などの別のポートで起動する。

**原因**: ポート5173が既に使用されている。

**解決方法**:
```bash
# ポート5173を使用しているプロセスを確認
lsof -ti:5173

# プロセスを停止
kill -9 $(lsof -ti:5173)

# サーバーを再起動
npm run dev
```

### 4. データが表示されない

**症状**: グラフは表示されるが、データが空で何も表示されない。

**原因**: データベースが初期化されていない、または日付範囲が適切でない。

**解決方法**:
1. **データベースの再初期化**:
   ```bash
   node server/initDatabase.js
   ```

2. **日付範囲の確認**: 上部の日付範囲スライダーで「全期間」ボタンをクリック

3. **データの確認**:
   ```bash
   # データベースを直接確認
   sqlite3 database/hospital.db "SELECT COUNT(*) FROM inpatients;"
   sqlite3 database/hospital.db "SELECT COUNT(*) FROM outpatients;"
   ```

### 5. サーバーが起動しない

**症状**: `npm run server` または `npm run dev` を実行してもサーバーが起動しない。

**原因**: 
- 依存関係がインストールされていない
- ポートが既に使用されている
- Node.jsのバージョンが古い

**解決方法**:
1. **依存関係の再インストール**:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. **Node.jsのバージョン確認**:
   ```bash
   node --version
   # v20.x 以上が必要
   ```

3. **ポートの確認**:
   ```bash
   # バックエンド (3001)
   lsof -ti:3001 | xargs kill -9 2>/dev/null
   
   # フロントエンド (5173)
   lsof -ti:5173 | xargs kill -9 2>/dev/null
   ```

### 6. 右クリックメニューが表示されない

**症状**: グラフを右クリックしてもコンテキストメニューが表示されない。

**原因**: ブラウザのデフォルトの右クリックメニューが表示されている。

**解決方法**:
- グラフの中心部分を右クリックする
- ブラウザのコンソールでエラーを確認する（F12キー）

### 7. グラフが表示エリアからはみ出る

**症状**: グラフが4分割エリアに収まらず、レイアウトが崩れる。

**原因**: ブラウザのウィンドウサイズが小さすぎる。

**解決方法**:
- ブラウザウィンドウを最大化する
- 推奨解像度: 1920x1080以上

## デバッグ方法

### ブラウザのコンソールを確認

1. F12キーを押して開発者ツールを開く
2. "Console" タブを選択
3. エラーメッセージを確認

### ネットワークタブでAPI呼び出しを確認

1. F12キーを押して開発者ツールを開く
2. "Network" タブを選択
3. ページをリロード
4. `/api/` で始まるリクエストを確認
5. ステータスコードが200であればOK、それ以外はエラー

### サーバーログの確認

**バックエンド**:
```bash
tail -f server.log
```

**フロントエンド**:
```bash
tail -f frontend.log
```

## サーバーの再起動

完全にリセットしたい場合:

```bash
# すべてのプロセスを停止
pkill -f "node server/api.js"
pkill -f "vite"

# ログをクリア
rm -f server.log frontend.log

# バックエンド起動
cd /home/user/webapp/hospital-dashboard
nohup npm run server > server.log 2>&1 &

# フロントエンド起動
nohup npm run dev > frontend.log 2>&1 &

# 起動確認
tail -f server.log
tail -f frontend.log
```

## 技術的な詳細

### API通信の仕組み

1. ブラウザからフロントエンド（ポート5173）にアクセス
2. フロントエンドから `/api/*` へのリクエスト
3. Viteプロキシが `http://localhost:3001` に転送
4. バックエンドAPIがデータを返す
5. フロントエンドがPlotly.jsでグラフ描画

### ファイル構成

```
フロントエンド (port 5173)
  ├─ src/config.js (API_BASE_URL = '')
  ├─ vite.config.js (proxy設定)
  └─ src/components/ChartContainer.jsx (API呼び出し)

バックエンド (port 3001)
  ├─ server/api.js (Express API)
  └─ database/hospital.db (SQLite)
```

## まだ問題が解決しない場合

1. **GitHubのIssueを確認**: https://github.com/hiro1966/React-PlotlyJs/issues
2. **新しいIssueを作成**: 問題の詳細とエラーメッセージを記載
3. **ログファイルを添付**: `server.log` と `frontend.log` の内容

## 参考リンク

- [Vite公式ドキュメント](https://vitejs.dev/)
- [React公式ドキュメント](https://react.dev/)
- [Plotly.js公式ドキュメント](https://plotly.com/javascript/)
- [Express公式ドキュメント](https://expressjs.com/)
