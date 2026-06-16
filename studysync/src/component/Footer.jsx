import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <h2>STUDYSYNC</h2>
          <p>Build discipline. Track progress. Stay consistent.</p>
        </div>

        <div className="footer-motivation">
          <p>🔥 “Discipline is doing it even when you don’t feel like it.”</p>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} StudySync</span>
          <span>Made for students who refuse to quit 🚀</span>
        </div>

      </div>
    </footer>
  );
}