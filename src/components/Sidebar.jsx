import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ onMenuSelect, onDepartmentViewChange }) {
  const [expandedSections, setExpandedSections] = useState({
    departments: false,
    inpatients: true,
    outpatients: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // 部署ごとのビュー定義
  const departmentViews = [
    { id: 'pharmacy', label: '薬剤室' },
    { id: 'consultation', label: '相談室' },
    { id: 'reception', label: '受付' },
    { id: 'management', label: '経営企画' },
  ];

  const menuItems = {
    inpatients: {
      title: '入院',
      items: [
        { id: 'daily-by-year', label: '日毎（年度比較）' },
        { id: 'daily-by-dept', label: '日毎（科別）' },
        { id: 'monthly-by-year', label: '月毎（年度比較）' },
        { id: 'monthly-by-dept', label: '月別（科別）' },
      ],
    },
    outpatients: {
      title: '外来',
      items: [
        { id: 'daily-by-year', label: '日毎（年度比較）' },
        { id: 'daily-by-visit-type', label: '日毎（初再）' },
        { id: 'daily-by-dept', label: '日毎（科別）' },
        { id: 'monthly-by-year', label: '月毎（年度比較）' },
        { id: 'monthly-by-visit-type', label: '月毎（初再）' },
        { id: 'monthly-by-dept', label: '月別（科別）' },
      ],
    },
  };

  const handleItemClick = (type, subType, label) => {
    const title = `${menuItems[type].title} - ${label}`;
    onMenuSelect(type, subType, title);
  };

  const handleDepartmentClick = (departmentId, label) => {
    onDepartmentViewChange(departmentId, label);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>メニュー</h2>
      </div>
      <nav className="sidebar-nav">
        {/* 部署ビュー選択 */}
        <div className="menu-section department-views">
          <div
            className="section-header section-header-primary"
            onClick={() => toggleSection('departments')}
          >
            <span className="section-title">🏥 部署ビュー</span>
            <span className={`chevron ${expandedSections.departments ? 'expanded' : ''}`}>
              ▼
            </span>
          </div>
          {expandedSections.departments && (
            <ul className="menu-items">
              {departmentViews.map((dept) => (
                <li
                  key={dept.id}
                  className="menu-item department-item"
                  onClick={() => handleDepartmentClick(dept.id, dept.label)}
                >
                  {dept.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 個別グラフ選択 */}
        {Object.entries(menuItems).map(([key, section]) => (
          <div key={key} className="menu-section">
            <div
              className="section-header"
              onClick={() => toggleSection(key)}
            >
              <span className="section-title">{section.title}</span>
              <span className={`chevron ${expandedSections[key] ? 'expanded' : ''}`}>
                ▼
              </span>
            </div>
            {expandedSections[key] && (
              <ul className="menu-items">
                {section.items.map((item) => (
                  <li
                    key={item.id}
                    className="menu-item"
                    onClick={() => handleItemClick(key, item.id, item.label)}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
