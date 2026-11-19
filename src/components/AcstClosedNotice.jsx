import { Link } from "react-router-dom";
import {
  Clock,
  ShieldAlert,
  Award,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Building2
} from "lucide-react";

export default function AcstClosedNotice({ closedMessage, courseName }) {
  return (
    <main className="acst-closed-page">
      <div className="container">
        {/* Top Hero Banner */}
        <div className="acst-closed-hero">
          <div className="acst-closed-badge-wrap">
            <span className="eyebrow acst-closed-eyebrow">
              <Clock size={14} /> ADMISSIONS NOTICE
            </span>
          </div>

          <h1>
            ACST Registrations Are <span className="accent-red">Currently Closed</span>
          </h1>

          <p className="acst-closed-subtitle">
            {courseName
              ? `Online ACST registration for ${courseName} is currently not accepting new online submissions.`
              : "Y.K. Classes Admission Cum Scholarship Test (ACST) online registration portal is currently paused."}
          </p>

          {/* Admin Notice Box if provided */}
          {closedMessage && (
            <div className="acst-closed-admin-alert">
              <ShieldAlert size={22} className="alert-icon" />
              <div>
                <strong>Official Institute Notice:</strong>
                <p>{closedMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* 2 Primary Alternatives Section */}
        <section className="acst-closed-alternatives-section">
          <div className="acst-closed-section-title">
            <span className="eyebrow">AVAILABLE SCHOLARSHIP & ADMISSION PATHWAYS</span>
            <h2>How You Can Still Join &amp; Win Scholarships</h2>
            <p>
              Online ACST band hone par bhi aapke paas scholarship pane aur admission lene ke 2 active raste hain:
            </p>
          </div>

          <div className="acst-closed-alternatives-grid">
            {/* Card 1: Direct Offline Admission & Local Scholarship Test */}
            <article className="acst-alternative-card featured-offline-card">
              <div className="alternative-card-header">
                <span className="alternative-pill red-pill">
                  <Sparkles size={13} /> RECOMMENDED · DIRECT INSTITUTE WALK-IN
                </span>
                <div className="alternative-icon-box red-icon">
                  <GraduationCap size={28} />
                </div>
              </div>

              <div className="alternative-card-content">
                <h3>Visit Institute &amp; Take Local Scholarship Test</h3>
                <p>
                  Aap Y.K. Classes institute center par directly visit karke direct offline admission
                  le sakte hain. Scholarship pane ke liye aap on-campus <strong>Local Scholarship Admission Test</strong> de
                  sakte hain aur instant merit discount grab kar sakte hain!
                </p>

                <ul className="alternative-benefits-list">
                  <li>
                    <CheckCircle2 size={16} />
                    <span><strong>Local Scholarship Test:</strong> Center par test dekar up to 100% scholarship unlock karein</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} />
                    <span><strong>1-on-1 Academic Counseling:</strong> Senior faculty se personal guidance aur batch selection</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} />
                    <span><strong>Immediate Seat Confirmation:</strong> Offline spot registration for Foundation, JEE &amp; NEET</span>
                  </li>
                </ul>
              </div>

              <div className="alternative-card-footer">
                <a href="/#contact" className="button button-red alternative-btn">
                  <span>Visit Institute / Contact Desk</span>
                  <ArrowRight size={17} />
                </a>
              </div>
            </article>

            {/* Card 2: YKSAT (Y.K. Student Aptitude Test) */}
            <article className="acst-alternative-card">
              <div className="alternative-card-header">
                <span className="alternative-pill blue-pill">
                  <Award size={13} /> APTITUDE BENCHMARK
                </span>
                <div className="alternative-icon-box blue-icon">
                  <Award size={28} />
                </div>
              </div>

              <div className="alternative-card-content">
                <h3>Check YKSAT Announcements</h3>
                <p>
                  Y.K. Student Aptitude Test (YKSAT) hamara dedicated testing platform hai jahan
                  academic aptitude, analytical thinking aur entrance benchmark evaluation schedule kiye jaate hain.
                </p>

                <ul className="alternative-benefits-list">
                  <li>
                    <CheckCircle2 size={16} />
                    <span><strong>Upcoming Testing Dates:</strong> Check announcement schedule for upcoming aptitude drives</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} />
                    <span><strong>Concept &amp; Logic Benchmarking:</strong> Evaluate your preparation readiness</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} />
                    <span><strong>Class 8th to 12th &amp; Droppers:</strong> Standardized assessment for competitive exams</span>
                  </li>
                </ul>
              </div>

              <div className="alternative-card-footer">
                <Link to="/yksat" className="button button-blue alternative-btn">
                  <span>Explore YKSAT Portal</span>
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* Center Location & Helpline Box */}
        <section className="acst-closed-center-card">
          <div className="center-card-main">
            <div className="center-card-icon">
              <Building2 size={26} />
            </div>
            <div className="center-card-copy">
              <span className="eyebrow">OFFLINE ADMISSIONS DESK</span>
              <h3>Y.K. Classes Institute Center &amp; Helpdesk</h3>
              <p>
                Opposite Indusind Bank, New Colony Road, Agra Chowk, Palwal - 121102, Haryana
              </p>
              <div className="center-meta-tags">
                <span>Working Hours: Mon – Sun (9:00 AM – 7:00 PM)</span>
                <span>Walk-in Spot Admissions Active</span>
              </div>
            </div>
          </div>

          <div className="center-card-actions">
            <a href="tel:9518641228" className="button button-red call-btn">
              <PhoneCall size={18} />
              <span>Call Admissions: 9518641228</span>
            </a>
            <a href="mailto:ykclassespalwal@gmail.com" className="button button-outline email-btn">
              <Mail size={18} />
              <span>ykclassespalwal@gmail.com</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
