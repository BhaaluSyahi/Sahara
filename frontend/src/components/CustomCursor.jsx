import { useEffect, useRef, useState } from 'react';
import '../styles/CustomCursor.css';

// Seedling SVG (default cursor)
const Seedling = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22V12" stroke="#2e7d32" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 12C12 12 8 10 8 6C8 3.8 9.8 2 12 2C14.2 2 16 3.8 16 6C16 10 12 12 12 12Z"
      fill="#4caf50" opacity="0.85"/>
    <path d="M12 16C12 16 9 15 7 13C6 12 6 10.5 7 9.5C8 8.5 9.5 8.5 10.5 9.5C11.5 10.5 12 16 12 16Z"
      fill="#66bb6a" opacity="0.7"/>
  </svg>
);

// Tree SVG (on click) — fuller, more natural tree
const Tree = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10.5" y="15" width="3" height="7" rx="1" fill="#795548"/>
    <ellipse cx="12" cy="9" rx="7" ry="7" fill="#388e3c" opacity="0.9"/>
    <ellipse cx="12" cy="7" rx="5" ry="5" fill="#4caf50" opacity="0.85"/>
    <ellipse cx="9" cy="11" rx="4" ry="3.5" fill="#388e3c" opacity="0.8"/>
    <ellipse cx="15" cy="11" rx="4" ry="3.5" fill="#2e7d32" opacity="0.8"/>
  </svg>
);

function CustomCursor() {
  const cursorRef = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
      if (!visible) setVisible(true);
    };

    const click = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 600);
    };

    const hide = () => setVisible(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', click);
    window.addEventListener('mouseleave', hide);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', click);
      window.removeEventListener('mouseleave', hide);
    };
  }, [visible]);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor${clicked ? ' custom-cursor--clicked' : ''}${visible ? '' : ' custom-cursor--hidden'}`}
    >
      {clicked ? <Tree /> : <Seedling />}
    </div>
  );
}

export default CustomCursor;
