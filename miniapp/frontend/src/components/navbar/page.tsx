'use client';
import { usePathname } from "next/navigation";

export default function NavigationPanel() {
  const pathName = usePathname();
  
  return (
    <>
      { pathName !=="/error-page" &&
      <footer id="footer">
        <a id="footer_text" className="tap-btn" href="/" style={{ textDecoration: 'none' }}>
          🪙<br />Tap
        </a>
        <a id="footer_text" className="ref-btn" href="ref-page" style={{ textDecoration: 'none' }}>
          👨‍💼<br />Ref
        </a>
        <a id="footer_text" className="task-btn" href="task-page" style={{ textDecoration: 'none' }}>
          📝<br />Task
        </a>
      </footer>
      }
    </>
)}
