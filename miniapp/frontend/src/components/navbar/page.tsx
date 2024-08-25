'use client';
import { usePathname } from "next/navigation";

export default function NavigationPanel() {
  const pathName = usePathname();
  
  return (
    <>
      { pathName !=="/error-page" &&
      <footer className="footer">
        <a className="tap-btn" href="/" style={{ textDecoration: 'none' }}>
          🪙<br />Tap
        </a>
        <a className="ref-btn" href="ref-page" style={{ textDecoration: 'none' }}>
          👨‍💼<br />Ref
        </a>
        <a className="task-btn" href="task-page" style={{ textDecoration: 'none' }}>
          📝<br />Task
        </a>
      </footer>
      }
    </>
)}
