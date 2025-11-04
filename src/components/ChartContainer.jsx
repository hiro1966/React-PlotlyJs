import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { API_BASE_URL } from '../config';
import './ChartContainer.css';

function ChartContainer({ type, subType, title, department, dateRange }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [type, subType, department, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
      });

      if (department) {
        params.append('department', department);
      }

      const url = `${API_BASE_URL}/api/${type}/${subType}?${params}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (!data || data.length === 0) {
      return { data: [], layout: {} };
    }

    // データを整形してPlotlyのフォーマットに変換
    const plotData = [];
    const layout = {
      title: '',
      autosize: true,
      margin: { l: 60, r: 30, t: 40, b: 60 },
      hovermode: 'closest',
      showlegend: true,
      legend: { orientation: 'h', y: -0.2 },
    };

    // 年度比較の場合
    if (subType.includes('by-year')) {
      const yearGroups = {};

      data.forEach(item => {
        const year = item.year;
        const dateStr = item.date || item.month;
        
        // 日付から月/日を抽出
        let xValue;
        if (subType.includes('daily')) {
          // 日毎の場合: MM-DD形式に変換
          const date = new Date(dateStr);
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          xValue = `${month}-${day}`;
        } else {
          // 月毎の場合: YYYY-MM から MM に変換
          const parts = dateStr.split('-');
          xValue = parts[1]; // 月のみ（01-12）
        }

        if (!yearGroups[year]) {
          yearGroups[year] = { values: {} };
        }

        // 同じ月/日のデータを集計（複数年度の場合）
        if (!yearGroups[year].values[xValue]) {
          yearGroups[year].values[xValue] = 0;
        }
        yearGroups[year].values[xValue] += item.count;
      });

      // データをソートして配列に変換
      Object.entries(yearGroups).forEach(([year, group]) => {
        const sortedKeys = Object.keys(group.values).sort();
        const xValues = sortedKeys;
        const yValues = sortedKeys.map(key => group.values[key]);

        plotData.push({
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines+markers',
          name: `${year}年`,
          line: { width: 2 },
          marker: { size: 6 },
        });
      });

      layout.xaxis = { 
        title: subType.includes('daily') ? '月-日' : '月',
        tickangle: -45
      };
      layout.yaxis = { title: '患者数' };
    }
    // 科別の場合（積み上げ棒グラフ）
    else if (subType.includes('by-dept')) {
      const deptGroups = {};

      data.forEach(item => {
        const dept = item.department;
        const xValue = item.date || item.month;

        if (!deptGroups[dept]) {
          deptGroups[dept] = { x: [], y: [] };
        }

        deptGroups[dept].x.push(xValue);
        deptGroups[dept].y.push(item.count);
      });

      Object.entries(deptGroups).forEach(([dept, values]) => {
        plotData.push({
          x: values.x,
          y: values.y,
          type: 'bar',
          name: dept,
        });
      });

      layout.barmode = 'stack';
      layout.xaxis = { title: subType.includes('daily') ? '日付' : '月' };
      layout.yaxis = { title: '患者数' };
    }
    // 初再診の場合
    else if (subType.includes('by-visit-type')) {
      const visitTypeGroups = {};

      data.forEach(item => {
        const visitType = item.visit_type;
        const xValue = item.date || item.month;

        if (!visitTypeGroups[visitType]) {
          visitTypeGroups[visitType] = { x: [], y: [] };
        }

        visitTypeGroups[visitType].x.push(xValue);
        visitTypeGroups[visitType].y.push(item.count);
      });

      Object.entries(visitTypeGroups).forEach(([visitType, values]) => {
        plotData.push({
          x: values.x,
          y: values.y,
          type: 'scatter',
          mode: 'lines+markers',
          name: visitType,
          line: { width: 2 },
          marker: { size: 6 },
        });
      });

      layout.xaxis = { title: subType.includes('daily') ? '日付' : '月' };
      layout.yaxis = { title: '患者数' };
    }

    return { data: plotData, layout };
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>{title}</h3>
        </div>
        <div className="chart-loading">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h3>{title}</h3>
        </div>
        <div className="chart-error">エラー: {error}</div>
      </div>
    );
  }

  const { data: plotData, layout } = prepareChartData();

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-content">
        {plotData.length > 0 ? (
          <Plot
            data={plotData}
            layout={layout}
            config={{
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
            }}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        ) : (
          <div className="chart-no-data">データがありません</div>
        )}
      </div>
    </div>
  );
}

export default ChartContainer;
