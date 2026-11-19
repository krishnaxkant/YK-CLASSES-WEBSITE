import { useState, useEffect } from "react";
import {
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import YksatClosedNotice from "../components/YksatClosedNotice";

const BACKEND_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
).replace(/\/$/, "");

export default function YKSAT() {
  const [admissionsOpen, setAdmissionsOpen] = useState(null);
  const [closedMessage, setClosedMessage] = useState("");
  const [yksatFeePaise, setYksatFeePaise] = useState(20000);

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
          if (Number.isSafeInteger(data.acstRegistrationFeePaise)) {
            setYksatFeePaise(data.acstRegistrationFeePaise);
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
      <main className="fees-page" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center", color: "#64748b", padding: "40px 20px" }}>
          <p style={{ fontWeight: 600, fontSize: "15px" }}>Loading YKSAT Information...</p>
        </div>
      </main>
    );
  }

  if (admissionsOpen === false) {
    return <YksatClosedNotice closedMessage={closedMessage} />;
  }
  return (
    <main className="fees-page">
      {/* 3D Hero Section - Identical Structure to ACST */}
      <section className="fees-hero">
        <div className="container">
          <div className="fees-hero-badge-wrap">
            <span className="eyebrow eyebrow-acst-pulse">
              <Sparkles size={14} /> SCHOLARSHIP CUM APTITUDE TEST (YKSAT)
            </span>
          </div>

          <h1>
            Take the YKSAT. Unlock Up to <span className="accent-red">100% Scholarship.</span>
          </h1>

          <p className="fees-hero-subtitle">
            Y.K. Classes Scholarship Cum Aptitude Test (YKSAT) is the official gateway
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

      {/* 3D 4-Step YKSAT Roadmap - Explaining Phase 1 & Phase 2 Workflow */}
      <section className="fees-process-section">
        <div className="container">
          <div className="fees-process-heading">
            <span className="eyebrow">HOW YKSAT WORKS</span>
            <h2>Two-Phase Pathway to <span className="accent-blue">Scholarships &amp; Exciting Rewards</span></h2>
            <p>Complete workflow: Phase-1 registration se Phase-2 eligibility aur topper exciting rewards tak.</p>
          </div>

          <div className="fees-process-grid">
            <div className="fees-process-card">
              <div className="process-card-step">01</div>
              <div className="process-card-content">
                <h3>Register for Phase-1</h3>
                <p>Pehle YKSAT Phase-I ke liye register karein aur scheduled date par offline test dein.</p>
              </div>
            </div>

            <div className="fees-process-card">
              <div className="process-card-step">02</div>
              <div className="process-card-content">
                <h3>Clear Phase-1 Exam</h3>
                <p>Phase-1 clear karne ke baad hi aap officially YKSAT Phase-II registration ke liye eligible honge.</p>
              </div>
            </div>

            <div className="fees-process-card">
              <div className="process-card-step">03</div>
              <div className="process-card-content">
                <h3>Phase-1 Merit Admission</h3>
                <p>Nahi toh Phase-1 score ke aadhar par merit scholarship mil jayegi aur us hisaab se direct admission mil jayega.</p>
              </div>
            </div>

            <div className="fees-process-card">
              <div className="process-card-step">04</div>
              <div className="process-card-content">
                <h3>Phase-2 Exciting Rewards</h3>
                <p>Phase-2 qualify karne aur admission lene par toppers ko up to 100% fee waiver aur exciting rewards (Laptop, Tablet, Smartphone) milenge!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Phase-1 & Phase-2 Scholarship Tables */}
      <section className="container yksat-tables-section" id="yksat-scholarship-slabs">
        <div className="fees-section-heading">
          <div>
            <span className="eyebrow">MERIT EVALUATION &amp; SLABS</span>
            <h2>YKSAT Scholarship Criteria</h2>
          </div>
        </div>

        <div className="yksat-tables-grid">
          {/* Phase-1 Percentage Table */}
          <div className="yksat-table-card">
            <div>
              <div className="yksat-table-header">
                <span className="eyebrow" style={{ color: "#071b49" }}>PHASE - I (PERCENTAGE BASIS)</span>
                <h3>Phase-1 Scholarship Slabs</h3>
                <p>Merit tuition fee waiver based on student's YKSAT Phase-I aggregate score.</p>
              </div>

              <div className="yksat-table-responsive">
                <table className="yksat-custom-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Score in YKSAT-I</th>
                      <th>Tuition Fee Scholarship</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Category A</strong></td>
                      <td>Above 91%</td>
                      <td><span className="badge-waiver"><CheckCircle2 size={13} /> 90% Scholarship</span></td>
                    </tr>
                    <tr>
                      <td><strong>Category B</strong></td>
                      <td>81% – 90%</td>
                      <td><span className="badge-waiver"><CheckCircle2 size={13} /> 80% Scholarship</span></td>
                    </tr>
                    <tr>
                      <td><strong>Category C</strong></td>
                      <td>71% – 80%</td>
                      <td><span className="badge-waiver"><CheckCircle2 size={13} /> 70% Scholarship</span></td>
                    </tr>
                    <tr>
                      <td><strong>Category D</strong></td>
                      <td>61% – 70%</td>
                      <td><span className="badge-waiver"><CheckCircle2 size={13} /> 60% Scholarship</span></td>
                    </tr>
                    <tr>
                      <td><strong>Category E</strong></td>
                      <td>51% – 60%</td>
                      <td><span className="badge-waiver"><CheckCircle2 size={13} /> 50% Scholarship</span></td>
                    </tr>
                    <tr>
                      <td><strong>Category F</strong></td>
                      <td>41% – 50%</td>
                      <td><span className="badge-waiver"><CheckCircle2 size={13} /> 40% Scholarship</span></td>
                    </tr>
                    <tr>
                      <td><strong>Category G</strong></td>
                      <td>31% – 40%</td>
                      <td><span className="badge-waiver"><CheckCircle2 size={13} /> 30% Scholarship</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="yksat-table-footer-note">
              * Phase-1 scholarship applies to Tuition Fee for eligible regular classroom courses upon qualifying.
            </div>
          </div>

          {/* Phase-2 Rank Table */}
          <div className="yksat-table-card featured-phase2">
            <div>
              <div className="yksat-table-header">
                <span className="eyebrow" style={{ color: "#e31837" }}>PHASE - II (RANK BASIS - TOP 20)</span>
                <h3>Phase-2 Rank Waivers &amp; Rewards</h3>
                <p>Comprehensive fee exemptions for Top 20 ranks + Exciting Topper Rewards.</p>
              </div>

              <div className="yksat-table-responsive">
                <table className="yksat-custom-table">
                  <thead>
                    <tr>
                      <th>Rank Slabs</th>
                      <th>Tuition</th>
                      <th>Infra</th>
                      <th>Exam</th>
                      <th>Adm.</th>
                      <th>Reg.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Rank 1 – 2</strong></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                    </tr>
                    <tr>
                      <td><strong>Rank 3 – 5</strong></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                    </tr>
                    <tr>
                      <td><strong>Rank 6 – 10</strong></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                    </tr>
                    <tr>
                      <td><strong>Rank 11 – 15</strong></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                    </tr>
                    <tr>
                      <td><strong>Rank 16 – 20</strong></td>
                      <td><span className="badge-free-all">100% Free</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                      <td><span className="badge-charge-sm">Charge</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="yksat-table-footer-note">
              🎁 <strong>Exciting Rewards:</strong> Rank 1 (Laptop), Rank 2 (Tablet), Rank 3 (Smartphone) for Class 9th &amp; 11th toppers (&gt;90% score) on taking admission.
            </div>
          </div>
        </div>

        {/* Conditions for Rewards and Scholarships */}
        <div className="yksat-conditions-card">
          <div className="yksat-conditions-header">
            <span className="eyebrow" style={{ color: "#e31837" }}>TERMS &amp; GUIDELINES</span>
            <h3>Conditions for Rewards and Scholarships</h3>
            <p>Please review the official regulations governing YKSAT scholarships, rank fee waivers, and topper rewards.</p>
          </div>

          <div className="yksat-conditions-grid">
            <div className="yksat-condition-item">
              <span className="yksat-condition-num">1</span>
              <div>
                <strong>Regular Classroom Course Mandatory:</strong> To be eligible for reward and scholarship, it is mandatory to join our Regular Classroom course (Scholarship is not valid for already enrolled students).
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">2</span>
              <div>
                <strong>Epic Rewards for Class 9th &amp; 11th:</strong> Chance to win Laptop, Tablet and Smartphone for 1st, 2nd &amp; 3rd Rank students (&gt;90% score) from Class 9th and 11th in Phase II Exam.
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">3</span>
              <div>
                <strong>Non-Refundable Fee:</strong> Scholarship test fee once paid is strictly non-refundable.
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">4</span>
              <div>
                <strong>Felicitation Ceremony at Palwal:</strong> Rewards to the Toppers will be presented in a felicitation program held by Y.K. Classes at Palwal City (Date will be finalized after declaration of YKSAT Phase-II result).
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">5</span>
              <div>
                <strong>Phase-I Scholarship Basis:</strong> Students qualified in YKSAT Phase-I exam will be awarded scholarships based on their performance in Phase-I (as mentioned in Table 1).
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">6</span>
              <div>
                <strong>Rank-Based Rewards on Phase-II Only:</strong> Stimulating rewards and rank-based scholarship will be given solely on the basis of YKSAT-II Rank (as mentioned in Table 2).
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">7</span>
              <div>
                <strong>One-Year Validity:</strong> Scholarship based on YKSAT is valid only for a One-Year Classroom program.
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">8</span>
              <div>
                <strong>Minimum 30% Score Requirement:</strong> A minimum 30% score is required to avail the rank-based scholarship.
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">9</span>
              <div>
                <strong>Management Prerogative:</strong> Y.K. Classes reserves the right to make any changes at any time in offering scholarships &amp; rewards without any prior notice. Management decision will be final.
              </div>
            </div>

            <div className="yksat-condition-item">
              <span className="yksat-condition-num">10</span>
              <div>
                <strong>Official Tie-Breaker Rule:</strong> If students secure equal aggregate marks, higher rank will be awarded by comparing subject scores in strict priority: <strong>Maths &gt; Physics &gt; Chemistry &gt; Biology &gt; MAT</strong>. If all subject scores are equal, the younger student (lower age) will be given the higher rank.
              </div>
            </div>
          </div>
        </div>

        {/* YKSAT Promo Banner - Matching ACST fee promo without View Syllabus button */}
        <div className="acst-fee-promo" style={{ marginTop: "24px" }}>
          <div className="acst-fee-promo-copy">
            <span className="acst-fee-promo-label">YKSAT SCHOLARSHIP</span>
            <h4>Register for YKSAT Phase-I &amp; unlock tuition discounts.</h4>
            <p>
              YKSAT Phase-I registration is ₹{Math.round(yksatFeePaise / 100)}. Use an available coupon during registration to save on your fee. Your YKSAT Phase-I score can also unlock tuition-fee discounts.
            </p>

            <div className="acst-fee-promo-actions">
              <Link className="acst-fee-promo-link" to="/yksat/courses">
                Register Now <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Contact & Support Banner - Identical Structure to ACST */}
      <section className="container fees-contact">
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
