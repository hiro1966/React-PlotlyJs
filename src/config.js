// API設定
// Viteのプロキシを使用するため、相対パスを使用
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export { API_BASE_URL };
