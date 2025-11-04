import ChartContainer from './ChartContainer';
import './ChartGrid.css';

function ChartGrid({ charts, dateRange, onContextMenu }) {
  return (
    <div className="chart-grid">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="chart-area"
          onContextMenu={(e) => onContextMenu(e, chart.id)}
        >
          {chart.type ? (
            <ChartContainer
              type={chart.type}
              subType={chart.subType}
              title={chart.title}
              department={chart.department}
              dateRange={dateRange}
            />
          ) : (
            <div className="empty-chart">
              <p>左側のメニューからグラフを選択してください</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ChartGrid;
