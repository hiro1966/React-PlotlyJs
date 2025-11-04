import { useEffect, useRef } from 'react';
import './ContextMenu.css';

function ContextMenu({ x, y, departments, onDepartmentSelect, onShowAll, onClear }) {
  const menuRef = useRef(null);

  useEffect(() => {
    // メニューが画面外に出ないように調整
    if (menuRef.current) {
      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      
      if (rect.right > window.innerWidth) {
        menu.style.left = `${x - rect.width}px`;
      }
      
      if (rect.bottom > window.innerHeight) {
        menu.style.top = `${y - rect.height}px`;
      }
    }
  }, [x, y]);

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-section">
        <div className="context-menu-header">診療科でフィルタ</div>
        <div className="context-menu-item" onClick={onShowAll}>
          <span>すべての診療科</span>
        </div>
        {departments.map((dept) => (
          <div
            key={dept}
            className="context-menu-item"
            onClick={() => onDepartmentSelect(dept)}
          >
            <span>{dept}</span>
          </div>
        ))}
      </div>
      <div className="context-menu-divider"></div>
      <div className="context-menu-section">
        <div className="context-menu-item danger" onClick={onClear}>
          <span>グラフをクリア</span>
        </div>
      </div>
    </div>
  );
}

export default ContextMenu;
