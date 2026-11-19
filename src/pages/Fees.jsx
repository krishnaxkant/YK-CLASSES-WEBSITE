import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Zap,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { courses } from "../data/courseData";
import AcstClosedNotice from "../components/AcstClosedNotice";

const BACKEND_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
).replace(/\/$/, "");

export default function Fees() {
  const [admissionsOpen, setAdmissionsOpen] = useState(null);
  const [closedMessage, setClosedMessage] = useState("");

  useEffect(() => {
    let active = true;

    fetch(`${BACKEND_BASE_URL}/api/public/admission-status`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data && typeof data.admissionsOpen === "boolean") {
          setAdmissionsOpen(data.admissionsOpen);
          if (data.closedMessage) {
            setClosedMessage(data.closedMessage);
          }
        } else {
          setAdmissionsOpen(true);
        }
      })
      .catch(() => {
        if (active) setAdmissionsOpen(true);
      });

    return () => {
      active = false;
    };
  }, []);

  if (admissionsOpen === false) {
    return <AcstClosedNotice closedMessage={closedMessage} />;
  }

  return (
    <main className="fees-page">
      {/* 3D Hero Section */}
      <section className="fees-hero">
        <div className="container">
          <div className="fees-hero-badge-wrap">
            <span className="eyebrow eyebrow-acst-pulse">
              <Sparkles size={14} /> ADMISSION CUM SCHOLARSHIP TEST (ACST 2026-27)
            </span>
          </div>

          <h1>
            Take the ACST. Unlock Up to <span className="accent-red">100% Scholarship.</span>
          </h1>

          <p className="fees-hero-subtitle">
            Y.K. Classes Admission Cum Scholarship Test (ACST) is the official gateway
            to merit-based tuition fee waivers on our Foundation, Board Mastery, and
            JEE/NEET target programs.
          </p>

          {/* 3D Value Propositions */}
          <div className="fees-hero-stats-row">
            <div className="fees-hero-stat-card">
              <div className="fees-stat-icon-wrap icon-red">
                <Award size={22} />
              </div>
              <div className="fees-stat-copy">
                <strong>Up to 100% Scholarship</strong>
                <span>Merit-based tuition waiver</span>
              </div>
            </div>

            <div className="fees-hero-stat-card">
              <div className="fees-stat-icon-wrap icon-blue">
                <Zap size={22} />
              </div>
              <div className="fees-stat-copy">
                <strong>Targeted Batches</strong>
                <span>Class 8th to 12th &amp; Droppers</span>
              </div>
            </div>

            <div className="fees-hero-stat-card">
              <div className="fees-stat-icon-wrap icon-navy">
                <ShieldCheck size={22} />
              </div>
              <div className="fees-stat-copy">
                <strong>Transparent Policy</strong>
                <span>Direct admission &amp; score audit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D 4-Step ACST Roadmap */}
      <section className="fees-process-section">
        <div className="container">
          <div className="fees-process-heading">
            <span className="eyebrow">HOW ACST WORKS</span>
            <h2>Simple 4-Step Pathway to <span className="accent-blue">Your Scholarship</span></h2>
            <p>From online registration to joining the batch — streamlined and seamless.</p>
          </div>

          <div className="fees-process-grid">
            <div className="fees-process-card">
              <div className="process-card-step">01</div>
              <div className="process-card-content">
                <h3>Select Course</h3>
                <p>Choose your class and competitive focus (JEE, NEET, or Foundation).</p>
              </div>
            </div>

            <div className="fees-process-card">
              <div className="process-card-step">02</div>
              <div className="process-card-content">
                <h3>Register Online</h3>
                <p>Fill the student details, apply any coupon, and complete ₹100 registration fee.</p>
              </div>
            </div>

            <div className="fees-process-card">
              <div className="process-card-step">03</div>
              <div className="process-card-content">
                <h3>Take the ACST</h3>
                <p>Appear for the aptitude &amp; concept evaluation on the scheduled test date.</p>
              </div>
            </div>

            <div className="fees-process-card">
              <div className="process-card-step">04</div>
              <div className="process-card-content">
                <h3>Unlock Scholarship</h3>
                <p>Your test score automatically unlocks tuition discounts up to 100% for the year.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Course Cards Grid */}
      <section className="container fees-courses" id="all-courses">
        <div className="fees-section-heading">
          <div>
            <span className="eyebrow">ACST ELIGIBLE PROGRAMS</span>
            <h2>Explore Courses &amp; Register for ACST</h2>
          </div>

          <p>Choose your program below to view fee structure, scholarship slabs &amp; register online.</p>
        </div>

        <div className="fees-grid">
          {courses.map((course, index) => (
            <article className="fees-card" key={course.slug}>
              <div className="fees-card-top">
                <span className="fees-number">
                  #{String(index + 1).padStart(2, "0")}
                </span>
                <span className="fees-category">{course.category}</span>
              </div>

              <div className="fees-card-content">
                <div className="fees-card-title-wrap">
                  <h3>{course.className}</h3>
                  <span className="fees-badge-scholarship">
                    <Sparkles size={12} /> ACST Eligible
                  </span>
                </div>
                <p className="fees-program-title">{course.program}</p>
                <p className="fees-card-desc">{course.description}</p>
              </div>

              <div className="fees-card-footer">
                <Link className="fees-card-link" to={`/admission/${course.slug}`}>
                  <span>Register for ACST &amp; View Details</span>
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3D Contact & Support Banner */}
      <section className="container fees-contact">
        <div className="fees-contact-copy">
          <span className="eyebrow">NEED COUNSELING?</span>
          <h2>Have questions about ACST or course selection?</h2>
          <p>
            Connect directly with Y.K. Classes academic counselors to understand
            the syllabus, test format, and the best program for your target.
          </p>
        </div>

        <div className="fees-contact-actions">
          <Link className="button button-red fees-cta-btn" to="/#contact">
            <span>Talk to an Academic Counselor</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
