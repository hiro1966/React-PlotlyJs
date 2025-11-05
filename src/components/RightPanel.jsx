import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { API_BASE_URL } from '../config';
import './RightPanel.css';

function RightPanel({ dateRange }) {
  const [stats, setStats] = useState({
    totalInpatients: 0,
    totalOutpatients: 0,
    avgDailyInpatients: 0,
    avgDailyOutpatients: 0,
  });

  const [bedOccupancy, setBedOccupancy] = useState({
    occupied: 0,
    available: 0,
    total: 120,
  });

  const TOTAL_BEDS = 120;

  useEffect(() => {
    fetchStats();
    fetchBedOccupancy();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      // 入院患者数を取得
      const inpatientsRes = await fetch(
        `${API_BASE_URL}/api/inpatients/daily-by-year?startDate=${dateRange.start}&endDate=${dateRange.end}`
      );
      const inpatientsData = await inpatientsRes.json();

      // 外来患者数を取得
      const outpatientsRes = await fetch(
        `${API_BASE_URL}/api/outpatients/daily-by-year?startDate=${dateRange.start}&endDate=${dateRange.end}`
      );
      const outpatientsData = await outpatientsRes.json();

      // 統計を計算
      const totalIn = inpatientsData.reduce((sum, item) => sum + item.count, 0);
      const totalOut = outpatientsData.reduce((sum, item) => sum + item.count, 0);

      // 日数を計算
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      setStats({
        totalInpatients: totalIn,
        totalOutpatients: totalOut,
        avgDailyInpatients: (totalIn / days).toFixed(1),
        avgDailyOutpatients: (totalOut / days).toFixed(1),
      });
    } catch (error) {
      console.error('統計データ取得エラー:', error);
    }
  };

  const fetchBedOccupancy = async () => {
    try {
      // 最新日の入院患者数を取得（病床利用数として使用）
      const res = await fetch(
        `${API_BASE_URL}/api/inpatients/daily-by-year?startDate=${dateRange.end}&endDate=${dateRange.end}`
      );
      const data = await res.json();
      
      const occupied = data.reduce((sum, item) => sum + item.count, 0);
      const available = TOTAL_BEDS - occupied;

      setBedOccupancy({
        occupied,
        available: available > 0 ? available : 0,
        total: TOTAL_BEDS,
      });
    } catch (error) {
      console.error('病床利用率データ取得エラー:', error);
    }
  };

  // 円グラフデータ
  const pieData = [{
    values: [bedOccupancy.occupied, bedOccupancy.available],
    labels: ['使用中', '空床'],
    type: 'pie',
    hole: 0.4,
    marker: {
      colors: ['#e74c3c', '#95a5a6'],
    },
    textinfo: 'label+percent',
    hovertemplate: '%{label}: %{value}床<br>%{percent}<extra></extra>',
  }];

  const pieLayout = {
    title: '',
    showlegend: true,
    legend: { orientation: 'h', y: -0.1 },
    margin: { l: 20, r: 20, t: 20, b: 40 },
    height: 250,
  };

  // 横棒グラフデータ（サンプル）
  const barData = [{
    y: ['内科', '小児科', '整形外科'],
    x: [45, 38, 52],
    type: 'bar',
    orientation: 'h',
    marker: {
      color: ['#3498db', '#2ecc71', '#f39c12'],
    },
    hovertemplate: '%{y}: %{x}人<extra></extra>',
  }];

  const barLayout = {
    title: '',
    xaxis: { title: '患者数' },
    margin: { l: 80, r: 20, t: 20, b: 40 },
    height: 200,
  };

  const occupancyRate = ((bedOccupancy.occupied / bedOccupancy.total) * 100).toFixed(1);

  return (
    <div className="right-panel">
      {/* 数値統計パネル */}
      <div className="stats-panel">
        <h3 className="panel-title">📊 統計サマリー</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">入院患者（合計）</div>
            <div className="stat-value">{stats.totalInpatients.toLocaleString()}</div>
            <div className="stat-sub">平均 {stats.avgDailyInpatients}/日</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">外来患者（合計）</div>
            <div className="stat-value">{stats.totalOutpatients.toLocaleString()}</div>
            <div className="stat-sub">平均 {stats.avgDailyOutpatients}/日</div>
          </div>
          <div className="stat-card highlight">
            <div className="stat-label">病床利用率</div>
            <div className="stat-value-large">{occupancyRate}%</div>
            <div className="stat-sub">
              {bedOccupancy.occupied}/{bedOccupancy.total}床
            </div>
          </div>
        </div>
      </div>

      {/* 円グラフパネル */}
      <div className="chart-panel">
        <h3 className="panel-title">🛏️ 病床利用状況</h3>
        <Plot
          data={pieData}
          layout={pieLayout}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
          style={{ width: '100%' }}
        />
      </div>

      {/* 横棒グラフパネル */}
      <div className="chart-panel">
        <h3 className="panel-title">📈 診療科別（当日）</h3>
        <Plot
          data={barData}
          layout={barLayout}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default RightPanel;
