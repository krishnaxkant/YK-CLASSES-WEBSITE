import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight, Sparkles, ArrowRight, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { courses } from "../data/courseData";
import YksatClosedNotice from "../components/YksatClosedNotice";

const BACKEND_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
).replace(/\/$/, "");

export default function YksatCourses() {
  const [admissionsOpen, setAdmissionsOpen] = useState(null);
  const [closedMessage, setClosedMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${BACKEND_BASE_URL}/api/public/yksat/status`)
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

  if (admissionsOpen === null) {
    return (
      <main className="fees-page yksat-courses-page" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", color: "#64748b", padding: "40px 20px" }}>
          <p style={{ fontWeight: 600, fontSize: "15px" }}>Loading YKSAT Programs...</p>
        </div>
      </main>
    );
  }

  if (admissionsOpen === false) {
    return <YksatClosedNotice closedMessage={closedMessage} />;
  }

  return (
    <main className="fees-page yksat-courses-page">
      <div className="container" style={{ paddingTop: "28px" }}>
        <Link className="course-back-link" to="/yksat" style={{ marginBottom: "20px", display: "inline-flex" }}>
          <ArrowLeft size={16} /> Back to YKSAT Overview
        </Link>
      </div>

      {/* Course Cards Grid - Exact identical layout as ACST */}
      <section className="container fees-courses" id="all-courses" style={{ paddingTop: "8px" }}>
        <div className="fees-section-heading">
          <div>
            <span className="eyebrow">YKSAT ELIGIBLE PROGRAMS</span>
            <h2>
              Select Your Course{" "}
              <span className="yksat-next-class-highlight">
                (In which class you are coming in next year)
              </span>
            </h2>
          </div>

          <p>Choose your program below to view fee structure, scholarship slabs &amp; register online.</p>
        </div>

        <div className="fees-grid">
          {courses.map((course, index) => {
            const isEpicReward =
              course.slug === "class-9-foundation" ||
              course.slug === "class-11-jee" ||
              course.slug === "class-11-neet";

            return (
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
                    {isEpicReward ? (
                      <span className="fees-badge-scholarship epic-rewards-badge">
                        <Sparkles size={12} /> Epic Rewards Eligible
                      </span>
                    ) : (
                      <span className="fees-badge-scholarship">
                        <Sparkles size={12} /> YKSAT Eligible
                      </span>
                    )}
                  </div>
                  <p className="fees-program-title">{course.program}</p>
                  <p className="fees-card-desc">{course.description}</p>
                </div>

                <div className="fees-card-footer">
                  <Link className="fees-card-link" to={`/yksat/admission/${course.slug}`}>
                    <span>Register for YKSAT &amp; View Details</span>
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3D Contact & Support Banner */}
      <section className="container fees-contact" style={{ marginTop: "40px", marginBottom: "60px" }}>
        <div className="fees-contact-copy">
          <span className="eyebrow">NEED COUNSELING?</span>
          <h2>Have questions about YKSAT or course selection?</h2>
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
