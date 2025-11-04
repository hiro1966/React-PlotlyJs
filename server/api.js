import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// データベース接続
const dbPath = path.join(__dirname, '../database/hospital.db');
const db = new Database(dbPath);

// ミドルウェア
app.use(cors());
app.use(express.json());

// 入院患者データ取得 - 日別（年度比較）
app.get('/api/inpatients/daily-by-year', (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: '開始日と終了日を指定してください' });
    }
    
    // 前年度の同じ期間を計算
    const startYear = parseInt(startDate.substring(0, 4));
    const prevYearStart = `${startYear - 1}${startDate.substring(4)}`;
    const prevYearEnd = `${startYear - 1}${endDate.substring(4)}`;
    
    // 指定期間と前年度の期間のデータを取得
    let query = `
      SELECT 
        admission_date as date,
        strftime('%Y', admission_date) as year,
        strftime('%m-%d', admission_date) as monthDay,
        department,
        COUNT(*) as count
      FROM inpatients
      WHERE (
        (admission_date >= ? AND admission_date <= ?)
        OR (admission_date >= ? AND admission_date <= ?)
      )
    `;
    
    const params = [startDate, endDate, prevYearStart, prevYearEnd];
    
    if (department) {
      query += ` AND department = ?`;
      params.push(department);
    }
    
    query += ` GROUP BY admission_date, year, monthDay, department ORDER BY year, admission_date`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 入院患者データ取得 - 日別（科別）
app.get('/api/inpatients/daily-by-dept', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        admission_date as date,
        department,
        COUNT(*) as count
      FROM inpatients
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND admission_date >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND admission_date <= ?`;
      params.push(endDate);
    }
    
    query += ` GROUP BY admission_date, department ORDER BY admission_date, department`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 入院患者データ取得 - 月別（年度比較）
app.get('/api/inpatients/monthly-by-year', (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: '開始日と終了日を指定してください' });
    }
    
    // 前年度の同じ期間を計算
    const startYear = parseInt(startDate.substring(0, 4));
    const prevYearStart = `${startYear - 1}${startDate.substring(4)}`;
    const prevYearEnd = `${startYear - 1}${endDate.substring(4)}`;
    
    // 指定期間と前年度の期間のデータを取得
    let query = `
      SELECT 
        strftime('%Y-%m', admission_date) as month,
        strftime('%Y', admission_date) as year,
        strftime('%m', admission_date) as monthOnly,
        department,
        COUNT(*) as count
      FROM inpatients
      WHERE (
        (admission_date >= ? AND admission_date <= ?)
        OR (admission_date >= ? AND admission_date <= ?)
      )
    `;
    
    const params = [startDate, endDate, prevYearStart, prevYearEnd];
    
    if (department) {
      query += ` AND department = ?`;
      params.push(department);
    }
    
    query += ` GROUP BY month, year, monthOnly, department ORDER BY year, month`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 入院患者データ取得 - 月別（科別）
app.get('/api/inpatients/monthly-by-dept', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        strftime('%Y-%m', admission_date) as month,
        department,
        COUNT(*) as count
      FROM inpatients
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND admission_date >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND admission_date <= ?`;
      params.push(endDate);
    }
    
    query += ` GROUP BY month, department ORDER BY month, department`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 外来患者データ取得 - 日別（年度比較）
app.get('/api/outpatients/daily-by-year', (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: '開始日と終了日を指定してください' });
    }
    
    // 前年度の同じ期間を計算
    const startYear = parseInt(startDate.substring(0, 4));
    const prevYearStart = `${startYear - 1}${startDate.substring(4)}`;
    const prevYearEnd = `${startYear - 1}${endDate.substring(4)}`;
    
    // 指定期間と前年度の期間のデータを取得
    let query = `
      SELECT 
        appointment_date as date,
        strftime('%Y', appointment_date) as year,
        strftime('%m-%d', appointment_date) as monthDay,
        department,
        COUNT(*) as count
      FROM outpatients
      WHERE (
        (appointment_date >= ? AND appointment_date <= ?)
        OR (appointment_date >= ? AND appointment_date <= ?)
      )
    `;
    
    const params = [startDate, endDate, prevYearStart, prevYearEnd];
    
    if (department) {
      query += ` AND department = ?`;
      params.push(department);
    }
    
    query += ` GROUP BY appointment_date, year, monthDay, department ORDER BY year, appointment_date`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 外来患者データ取得 - 日別（初再診）
app.get('/api/outpatients/daily-by-visit-type', (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    let query = `
      SELECT 
        appointment_date as date,
        CASE WHEN first_visit = 1 THEN '初診' ELSE '再診' END as visit_type,
        department,
        COUNT(*) as count
      FROM outpatients
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND appointment_date >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND appointment_date <= ?`;
      params.push(endDate);
    }
    
    if (department) {
      query += ` AND department = ?`;
      params.push(department);
    }
    
    query += ` GROUP BY appointment_date, visit_type, department ORDER BY appointment_date, visit_type`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 外来患者データ取得 - 日別（科別）
app.get('/api/outpatients/daily-by-dept', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        appointment_date as date,
        department,
        COUNT(*) as count
      FROM outpatients
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND appointment_date >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND appointment_date <= ?`;
      params.push(endDate);
    }
    
    query += ` GROUP BY appointment_date, department ORDER BY appointment_date, department`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 外来患者データ取得 - 月別（年度比較）
app.get('/api/outpatients/monthly-by-year', (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: '開始日と終了日を指定してください' });
    }
    
    // 前年度の同じ期間を計算
    const startYear = parseInt(startDate.substring(0, 4));
    const prevYearStart = `${startYear - 1}${startDate.substring(4)}`;
    const prevYearEnd = `${startYear - 1}${endDate.substring(4)}`;
    
    // 指定期間と前年度の期間のデータを取得
    let query = `
      SELECT 
        strftime('%Y-%m', appointment_date) as month,
        strftime('%Y', appointment_date) as year,
        strftime('%m', appointment_date) as monthOnly,
        department,
        COUNT(*) as count
      FROM outpatients
      WHERE (
        (appointment_date >= ? AND appointment_date <= ?)
        OR (appointment_date >= ? AND appointment_date <= ?)
      )
    `;
    
    const params = [startDate, endDate, prevYearStart, prevYearEnd];
    
    if (department) {
      query += ` AND department = ?`;
      params.push(department);
    }
    
    query += ` GROUP BY month, year, monthOnly, department ORDER BY year, month`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 外来患者データ取得 - 月別（初再診）
app.get('/api/outpatients/monthly-by-visit-type', (req, res) => {
  try {
    const { startDate, endDate, department } = req.query;
    
    let query = `
      SELECT 
        strftime('%Y-%m', appointment_date) as month,
        CASE WHEN first_visit = 1 THEN '初診' ELSE '再診' END as visit_type,
        department,
        COUNT(*) as count
      FROM outpatients
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND appointment_date >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND appointment_date <= ?`;
      params.push(endDate);
    }
    
    if (department) {
      query += ` AND department = ?`;
      params.push(department);
    }
    
    query += ` GROUP BY month, visit_type, department ORDER BY month, visit_type`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 外来患者データ取得 - 月別（科別）
app.get('/api/outpatients/monthly-by-dept', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        strftime('%Y-%m', appointment_date) as month,
        department,
        COUNT(*) as count
      FROM outpatients
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND appointment_date >= ?`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND appointment_date <= ?`;
      params.push(endDate);
    }
    
    query += ` GROUP BY month, department ORDER BY month, department`;
    
    const stmt = db.prepare(query);
    const results = stmt.all(...params);
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 診療科一覧取得
app.get('/api/departments', (req, res) => {
  try {
    const query = `
      SELECT DISTINCT department FROM (
        SELECT department FROM inpatients
        UNION
        SELECT department FROM outpatients
      ) ORDER BY department
    `;
    
    const stmt = db.prepare(query);
    const results = stmt.all();
    
    res.json(results.map(r => r.department));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// 日付範囲取得
app.get('/api/date-range', (req, res) => {
  try {
    const query = `
      SELECT 
        MIN(date) as minDate,
        MAX(date) as maxDate
      FROM (
        SELECT admission_date as date FROM inpatients
        UNION ALL
        SELECT appointment_date as date FROM outpatients
      )
    `;
    
    const stmt = db.prepare(query);
    const result = stmt.get();
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'データ取得エラー' });
  }
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`APIサーバーがポート ${PORT} で起動しました`);
});

// プロセス終了時にデータベース接続をクローズ
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});
