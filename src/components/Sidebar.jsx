import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ onMenuSelect }) {
  const [expandedSections, setExpandedSections] = useState({
    inpatients: true,
    outpatients: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

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

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>メニュー</h2>
      </div>
      <nav className="sidebar-nav">
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
