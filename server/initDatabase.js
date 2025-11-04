import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// データベースファイルのパス
const dbPath = path.join(__dirname, '../database/hospital.db');
const db = new Database(dbPath);

// テーブル作成
function createTables() {
  // 入院患者テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS inpatients (
      patient_id TEXT NOT NULL,
      admission_date TEXT NOT NULL,
      discharge_date TEXT,
      department TEXT NOT NULL,
      ward_name TEXT NOT NULL
    )
  `);

  // 外来患者テーブル
  db.exec(`
    CREATE TABLE IF NOT EXISTS outpatients (
      patient_id TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      arrival_time TEXT,
      department TEXT NOT NULL,
      slot_name TEXT NOT NULL,
      first_visit INTEGER NOT NULL
    )
  `);

  console.log('テーブルが作成されました');
}

// テストデータ生成
function generateTestData() {
  const departments = ['内科', '小児科', '整形外科'];
  const wards = ['A棟', 'B棟', 'C棟'];
  const slots = ['午前', '午後', '夜間'];
  
  // 入院患者のテストデータ（過去2年分）
  const inpatientInsert = db.prepare(`
    INSERT INTO inpatients (patient_id, admission_date, discharge_date, department, ward_name)
    VALUES (?, ?, ?, ?, ?)
  `);

  // 2023年のデータ
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2023, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2023, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // 1日あたり5-15人の入院患者
      const patientsPerDay = Math.floor(Math.random() * 11) + 5;
      for (let i = 0; i < patientsPerDay; i++) {
        const department = departments[Math.floor(Math.random() * departments.length)];
        const ward = wards[Math.floor(Math.random() * wards.length)];
        const stayDays = Math.floor(Math.random() * 30) + 3;
        const dischargeDate = new Date(date);
        dischargeDate.setDate(dischargeDate.getDate() + stayDays);
        const dischargeDateStr = dischargeDate.toISOString().split('T')[0];
        
        inpatientInsert.run(
          `IP-2023-${month}-${day}-${i}`,
          dateStr,
          dischargeDateStr,
          department,
          ward
        );
      }
    }
  }

  // 2024年のデータ（若干増加傾向）
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2024, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2024, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // 1日あたり7-18人の入院患者（2023年より増加）
      const patientsPerDay = Math.floor(Math.random() * 12) + 7;
      for (let i = 0; i < patientsPerDay; i++) {
        const department = departments[Math.floor(Math.random() * departments.length)];
        const ward = wards[Math.floor(Math.random() * wards.length)];
        const stayDays = Math.floor(Math.random() * 30) + 3;
        const dischargeDate = new Date(date);
        dischargeDate.setDate(dischargeDate.getDate() + stayDays);
        const dischargeDateStr = dischargeDate.toISOString().split('T')[0];
        
        inpatientInsert.run(
          `IP-2024-${month}-${day}-${i}`,
          dateStr,
          dischargeDateStr,
          department,
          ward
        );
      }
    }
  }

  console.log('入院患者データが挿入されました');

  // 外来患者のテストデータ
  const outpatientInsert = db.prepare(`
    INSERT INTO outpatients (patient_id, appointment_date, appointment_time, arrival_time, department, slot_name, first_visit)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // 2023年のデータ
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2023, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2023, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // 1日あたり30-60人の外来患者
      const patientsPerDay = Math.floor(Math.random() * 31) + 30;
      for (let i = 0; i < patientsPerDay; i++) {
        const department = departments[Math.floor(Math.random() * departments.length)];
        const slot = slots[Math.floor(Math.random() * slots.length)];
        const hour = Math.floor(Math.random() * 8) + 9; // 9:00-17:00
        const minute = Math.floor(Math.random() * 60);
        const appointmentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const arrivalHour = hour + Math.floor(Math.random() * 2) - 1;
        const arrivalMinute = minute + Math.floor(Math.random() * 30);
        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
        const firstVisit = Math.random() < 0.3 ? 1 : 0; // 30%が初診
        
        outpatientInsert.run(
          `OP-2023-${month}-${day}-${i}`,
          dateStr,
          appointmentTime,
          arrivalTime,
          department,
          slot,
          firstVisit
        );
      }
    }
  }

  // 2024年のデータ（若干増加傾向）
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(2024, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(2024, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // 1日あたり35-70人の外来患者（2023年より増加）
      const patientsPerDay = Math.floor(Math.random() * 36) + 35;
      for (let i = 0; i < patientsPerDay; i++) {
        const department = departments[Math.floor(Math.random() * departments.length)];
        const slot = slots[Math.floor(Math.random() * slots.length)];
        const hour = Math.floor(Math.random() * 8) + 9;
        const minute = Math.floor(Math.random() * 60);
        const appointmentTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const arrivalHour = hour + Math.floor(Math.random() * 2) - 1;
        const arrivalMinute = minute + Math.floor(Math.random() * 30);
        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
        const firstVisit = Math.random() < 0.3 ? 1 : 0;
        
        outpatientInsert.run(
          `OP-2024-${month}-${day}-${i}`,
          dateStr,
          appointmentTime,
          arrivalTime,
          department,
          slot,
          firstVisit
        );
      }
    }
  }

  console.log('外来患者データが挿入されました');
}

// データベース初期化実行
try {
  createTables();
  
  // 既存データをクリア
  db.exec('DELETE FROM inpatients');
  db.exec('DELETE FROM outpatients');
  
  generateTestData();
  
  // データ件数確認
  const inpatientCount = db.prepare('SELECT COUNT(*) as count FROM inpatients').get();
  const outpatientCount = db.prepare('SELECT COUNT(*) as count FROM outpatients').get();
  
  console.log(`\n初期化完了:`);
  console.log(`- 入院患者: ${inpatientCount.count} 件`);
  console.log(`- 外来患者: ${outpatientCount.count} 件`);
  
} catch (error) {
  console.error('エラーが発生しました:', error);
} finally {
  db.close();
}
