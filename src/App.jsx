import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChartGrid from './components/ChartGrid';
import DateRangeSlider from './components/DateRangeSlider';
import ContextMenu from './components/ContextMenu';
import RightPanel from './components/RightPanel';
import { API_BASE_URL } from './config';
import './App.css';

function App() {
  // 部署ごとのデフォルトビュー定義
  const departmentViewConfigs = {
    pharmacy: [
      { id: 1, type: 'outpatients', subType: 'daily-by-year', title: '外来 - 日毎（年度比較）', department: null },
      { id: 2, type: 'outpatients', subType: 'monthly-by-year', title: '外来 - 月毎（年度比較）', department: null },
      { id: 3, type: 'inpatients', subType: 'daily-by-year', title: '入院 - 日毎（年度比較）', department: null },
      { id: 4, type: 'inpatients', subType: 'monthly-by-year', title: '入院 - 月毎（年度比較）', department: null },
    ],
    consultation: [
      { id: 1, type: 'outpatients', subType: 'daily-by-visit-type', title: '外来 - 日毎（初再）', department: null },
      { id: 2, type: 'outpatients', subType: 'monthly-by-visit-type', title: '外来 - 月毎（初再）', department: null },
      { id: 3, type: 'outpatients', subType: 'daily-by-dept', title: '外来 - 日毎（科別）', department: null },
      { id: 4, type: 'outpatients', subType: 'monthly-by-dept', title: '外来 - 月別（科別）', department: null },
    ],
    reception: [
      { id: 1, type: 'outpatients', subType: 'daily-by-year', title: '外来 - 日毎（年度比較）', department: null },
      { id: 2, type: 'outpatients', subType: 'daily-by-visit-type', title: '外来 - 日毎（初再）', department: null },
      { id: 3, type: 'outpatients', subType: 'monthly-by-year', title: '外来 - 月毎（年度比較）', department: null },
      { id: 4, type: 'outpatients', subType: 'monthly-by-visit-type', title: '外来 - 月毎（初再）', department: null },
    ],
    management: [
      { id: 1, type: 'outpatients', subType: 'monthly-by-year', title: '外来 - 月毎（年度比較）', department: null },
      { id: 2, type: 'inpatients', subType: 'monthly-by-year', title: '入院 - 月毎（年度比較）', department: null },
      { id: 3, type: 'outpatients', subType: 'monthly-by-dept', title: '外来 - 月別（科別）', department: null },
      { id: 4, type: 'inpatients', subType: 'monthly-by-dept', title: '入院 - 月別（科別）', department: null },
    ],
  };

  const [charts, setCharts] = useState([
    { id: 1, type: 'outpatients', subType: 'daily-by-year', title: '外来 - 日毎（年度比較）', department: null },
    { id: 2, type: 'inpatients', subType: 'daily-by-year', title: '入院 - 日毎（年度比較）', department: null },
    { id: 3, type: null, subType: null, title: '', department: null },
    { id: 4, type: null, subType: null, title: '', department: null },
  ]);

  const [currentView, setCurrentView] = useState('default');

  const [dateRange, setDateRange] = useState({
    start: '2023-01-01',
    end: '2024-12-31',
  });

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    chartId: null,
  });

  const [departments, setDepartments] = useState([]);
  const [availableDateRange, setAvailableDateRange] = useState({
    min: '2023-01-01',
    max: '2024-12-31',
  });

  // 診療科と日付範囲の取得
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/departments`)
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('診療科データ取得エラー:', err));

    fetch(`${API_BASE_URL}/api/date-range`)
      .then(res => res.json())
      .then(data => {
        setAvailableDateRange({
          min: data.minDate,
          max: data.maxDate,
        });
        setDateRange({
          start: data.minDate,
          end: data.maxDate,
        });
      })
      .catch(err => console.error('日付範囲取得エラー:', err));
  }, []);

  // 部署ビュー切り替え
  const handleDepartmentViewChange = (departmentId, label) => {
    const viewConfig = departmentViewConfigs[departmentId];
    if (viewConfig) {
      setCharts(viewConfig);
      setCurrentView(departmentId);
      // 通知メッセージ（オプション）
      console.log(`${label}のビューに切り替えました`);
    }
  };

  // メニューからグラフを選択した時の処理
  const handleMenuSelect = (type, subType, title) => {
    // どのエリアに表示するかを選択するダイアログを表示
    const areaId = prompt('表示エリアを選択してください (1-4):', '3');
    if (areaId && parseInt(areaId) >= 1 && parseInt(areaId) <= 4) {
      const newCharts = [...charts];
      newCharts[parseInt(areaId) - 1] = {
        id: parseInt(areaId),
        type,
        subType,
        title,
        department: null,
      };
      setCharts(newCharts);
      setCurrentView('custom');
    }
  };

  // 右クリックメニューを表示
  const handleContextMenu = (e, chartId) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      chartId,
    });
  };

  // コンテキストメニューを閉じる
  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // 診療科を選択してドリルダウン
  const handleDepartmentSelect = (department) => {
    const chart = charts.find(c => c.id === contextMenu.chartId);
    if (chart) {
      const newCharts = charts.map(c => 
        c.id === contextMenu.chartId 
          ? { ...c, department, title: `${c.title} - ${department}` }
          : c
      );
      setCharts(newCharts);
    }
    closeContextMenu();
  };

  // すべての診療科を表示（ドリルダウン解除）
  const handleShowAllDepartments = () => {
    const chart = charts.find(c => c.id === contextMenu.chartId);
    if (chart) {
      const newCharts = charts.map(c => 
        c.id === contextMenu.chartId 
          ? { ...c, department: null, title: c.title.split(' - ')[0] }
          : c
      );
      setCharts(newCharts);
    }
    closeContextMenu();
  };

  // グラフエリアをクリア
  const handleClearChart = () => {
    const newCharts = charts.map(c => 
      c.id === contextMenu.chartId 
        ? { id: c.id, type: null, subType: null, title: '', department: null }
        : c
    );
    setCharts(newCharts);
    closeContextMenu();
  };

  return (
    <div className="app" onClick={closeContextMenu}>
      <Sidebar 
        onMenuSelect={handleMenuSelect}
        onDepartmentViewChange={handleDepartmentViewChange}
      />
      <main className="main-content">
        <div className="toolbar">
          <h1>病院ダッシュボード</h1>
          <DateRangeSlider
            dateRange={dateRange}
            availableDateRange={availableDateRange}
            onDateRangeChange={setDateRange}
          />
        </div>
        <div className="content-wrapper">
          <div className="charts-section">
            <ChartGrid
              charts={charts}
              dateRange={dateRange}
              onContextMenu={handleContextMenu}
            />
          </div>
          <RightPanel dateRange={dateRange} />
        </div>
      </main>
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          departments={departments}
          onDepartmentSelect={handleDepartmentSelect}
          onShowAll={handleShowAllDepartments}
          onClear={handleClearChart}
        />
      )}
    </div>
  );
}

export default App;
