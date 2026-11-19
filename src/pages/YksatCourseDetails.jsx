import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  MapPin,
  Award,
  BookOpen,
  FileText,
  Trophy,
  Gift,
  Layers,
  X,
} from "lucide-react";
import { courses, formatCurrency } from "../data/courseData";
import { CourseSpecificSyllabus, CourseSpecificExamPattern } from "../components/AcstSyllabusAndPattern";
import YksatClosedNotice from "../components/YksatClosedNotice";

const BACKEND_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
).replace(/\/$/, "");

function formatBatchDate(value, includeTime = false) {
  if (!value) return "To be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "To be announced";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    ...(includeTime ? { timeStyle: "short" } : {}),
  }).format(date);
}

function NotFound() {
  return (
    <main className="course-details-page">
      <section className="container course-not-found">
        <span className="eyebrow">COURSE NOT FOUND</span>
        <h1>We couldn't find this course.</h1>
        <p>Please return to YKSAT Courses and choose one of the available programs.</p>
        <Link className="button button-red" to="/yksat/courses">
          <ArrowLeft size={17} /> Back to YKSAT Courses
        </Link>
      </section>
    </main>
  );
}

export default function YksatCourseDetails() {
  const { courseSlug } = useParams();

  // Batch schedules and fee plans from backend
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [batchesError, setBatchesError] = useState("");
  const [feePlans, setFeePlans] = useState([]);
  const [feePlansLoading, setFeePlansLoading] = useState(true);
  const [feePlansError, setFeePlansError] = useState("");
  const [feeAcademicYear, setFeeAcademicYear] = useState("");

  // Dedicated YKSAT Admission Status & Fee
  const [admissionsOpen, setAdmissionsOpen] = useState(true);
  const [closedMessage, setClosedMessage] = useState("");
  const [yksatFeePaise, setYksatFeePaise] = useState(20000);
  const [statusLoading, setStatusLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // 'syllabus' | 'pattern' | null

  // Close modal on Escape key press and lock background scroll
  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveModal(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModal]);

  // Dedicated YKSAT Coupons
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponPricing, setCouponPricing] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageType, setCouponMessageType] = useState("");
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [couponsError, setCouponsError] = useState("");

  // Dedicated Dynamic YKSAT Scholarship Slabs
  const [scholarshipSlabs, setScholarshipSlabs] = useState([]);
  const [scholarshipLoading, setScholarshipLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    schoolName: "",
    phase: "Phase-I (Offline Pen & Paper / OMR Test)",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);
  const [formError, setFormError] = useState("");

  const course = courses.find((item) => item.slug === courseSlug);

  // 1. Fetch YKSAT Admission Status & Fee
  useEffect(() => {
    let isCurrent = true;
    async function loadYksatStatus() {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/public/yksat/status`);
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.success && isCurrent) {
          setAdmissionsOpen(result.admissionsOpen !== false);
          if (result.closedMessage) setClosedMessage(result.closedMessage);
          if (Number.isSafeInteger(result.acstRegistrationFeePaise)) {
            setYksatFeePaise(result.acstRegistrationFeePaise);
          }
        }
      } catch (err) {
        // Fallback to defaults
      } finally {
        if (isCurrent) setStatusLoading(false);
      }
    }
    loadYksatStatus();
    return () => { isCurrent = false; };
  }, []);

  // 2. Fetch Active YKSAT Coupons
  useEffect(() => {
    let isCurrent = true;
    async function loadActiveCoupons() {
      setCouponsLoading(true);
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/public/yksat/active-coupons`);
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.success && Array.isArray(result.coupons) && isCurrent) {
          setActiveCoupons(result.coupons);
        }
      } catch (err) {
        if (isCurrent) setCouponsError("Unable to load coupons.");
      } finally {
        if (isCurrent) setCouponsLoading(false);
      }
    }
    loadActiveCoupons();
    return () => { isCurrent = false; };
  }, []);

  // 3. Fetch Dynamic YKSAT Scholarship Policy
  useEffect(() => {
    let isCurrent = true;
    async function loadScholarship() {
      setScholarshipLoading(true);
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/public/yksat/scholarship`);
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.success && result.scholarship?.slabs && isCurrent) {
          setScholarshipSlabs(result.scholarship.slabs);
        }
      } catch (err) {
        // Fallback to default slabs
      } finally {
        if (isCurrent) setScholarshipLoading(false);
      }
    }
    loadScholarship();
    return () => { isCurrent = false; };
  }, []);

  // Load YKSAT dedicated batch schedule
  useEffect(() => {
    let isCurrent = true;
    async function loadBatches() {
      setBatchesLoading(true);
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/public/yksat/batches`);
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.success && Array.isArray(result.batches)) {
          if (isCurrent) setBatches(result.batches);
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        if (isCurrent) setBatchesLoading(false);
      }
    }
    loadBatches();
    return () => { isCurrent = false; };
  }, []);

  // Load fee plans
  useEffect(() => {
    let isCurrent = true;
    async function loadFeePlans() {
      setFeePlansLoading(true);
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/public/fee-plans`);
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.success && Array.isArray(result.feePlans)) {
          if (isCurrent) {
            setFeePlans(result.feePlans);
            setFeeAcademicYear(result.academicYear || "");
          }
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        if (isCurrent) setFeePlansLoading(false);
      }
    }
    loadFeePlans();
    return () => { isCurrent = false; };
  }, []);

  if (!course) return <NotFound />;

  if (admissionsOpen === false) {
    return <YksatClosedNotice closedMessage={closedMessage} courseName={course.className} />;
  }

  const isEpicReward =
    course.slug === "class-9-foundation" ||
    course.slug === "class-11-jee" ||
    course.slug === "class-11-neet";

  const courseBatches = batches.filter((batch) =>
    (batch.className || "").trim().toLowerCase() === course.className.trim().toLowerCase() &&
    (batch.courseName || "").trim().toLowerCase() === course.program.trim().toLowerCase()
  );

  const courseFeePlans = feePlans.filter((plan) =>
    (plan.course?.className || "").trim().toLowerCase() === course.className.trim().toLowerCase() &&
    (plan.course?.courseName || "").trim().toLowerCase() === course.program.trim().toLowerCase()
  );

  const weekendBatch = courseBatches.find(
    (batch) => (batch.batchType || batch.batch_type || "").trim().toLowerCase() === "weekend"
  );
  const regularBatch = courseBatches.find(
    (batch) => (batch.batchType || batch.batch_type || "").trim().toLowerCase() === "regular"
  );

  const getPublishedBatchStart = (batch) => {
    if (batchesLoading) return "Loading...";
    const dateVal = batch?.startsOn || batch?.starts_on;
    if (dateVal) return formatBatchDate(dateVal);
    return "Announced per batch";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();
    if (!normalizedCode || couponLoading) return;

    setCouponLoading(true);
    setCouponMessage("");
    setCouponMessageType("");
    setCouponApplied(false);
    setCouponPricing(null);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/public/yksat/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode: normalizedCode }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || "This coupon code could not be verified for YKSAT.");
      }

      setCouponPricing({
        couponCode: result.couponCode,
        baseFeePaise: result.baseFeePaise,
        discountPaise: result.discountPaise,
        finalFeePaise: result.finalFeePaise,
      });
      setCouponApplied(true);
      setCouponMessage(result.message || "YKSAT coupon applied successfully!");
      setCouponMessageType("success");
    } catch (error) {
      setCouponApplied(false);
      setCouponPricing(null);
      setCouponMessage(error.message || "Unable to verify this YKSAT coupon.");
      setCouponMessageType("error");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!admissionsOpen) {
      setFormError(closedMessage || "YKSAT registrations are currently closed by institute administration.");
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setFormError("Please fill all required student details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/public/yksat-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          courseSlug: course.slug,
          courseName: `${course.className} — ${course.program}`,
          couponCode: couponApplied && couponPricing ? couponPricing.couponCode : undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration submission failed.");
      }

      setRegistrationResult({
        applicationNumber: data.applicationNumber,
        rollNumber: data.rollNumber,
        candidateName: data.candidateName,
        courseName: data.courseName,
        examPhase: data.phase,
        phone: data.phone,
        email: data.email,
        registrationFee: data.registrationFee || (couponPricing ? `₹${Math.round(couponPricing.finalFeePaise / 100)}` : `₹${Math.round(yksatFeePaise / 100)}`),
        delivery: data.delivery,
      });
    } catch (err) {
      setFormError(err.message || "Registration submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic YKSAT Phase-1 Scholarship Slabs
  const displaySlabs = scholarshipSlabs.length > 0 ? scholarshipSlabs.map((s, idx) => {
    const nextMin = idx === 0 ? null : scholarshipSlabs[idx - 1].minimumPercentage - 1;
    const range = idx === 0 ? `Above ${s.minimumPercentage}%` : s.minimumPercentage > 0 ? `${s.minimumPercentage}% to ${nextMin}%` : `${nextMin || 30}% or Below`;
    const discount = s.discountPercentage > 0 ? `${s.discountPercentage}% Tuition Fee` : "No Scholarship";
    return { range, discount, label: s.label || `Category ${String.fromCharCode(65 + idx)}` };
  }) : [
    { range: "Above 91%", discount: "100% Tuition Fee", label: "Category A" },
    { range: "81% to 90%", discount: "75% Tuition Fee", label: "Category B" },
    { range: "71% to 80%", discount: "50% Tuition Fee", label: "Category C" },
    { range: "61% to 70%", discount: "40% Tuition Fee", label: "Category D" },
    { range: "51% to 60%", discount: "30% Tuition Fee", label: "Category E" },
    { range: "41% to 50%", discount: "20% Tuition Fee", label: "Category F" },
    { range: "31% to 40%", discount: "10% Tuition Fee", label: "Category G" },
    { range: "30% or Below", discount: "No Scholarship", label: "Category H" },
  ];

  return (
    <main className="course-details-page yksat-details-page">
      {/* 3D Course Hero Header */}
      <section className="course-detail-hero">
        <div className="container">
          <Link className="course-back-link" to="/yksat/courses">
            <ArrowLeft size={16} /> Back to YKSAT Courses
          </Link>

          <span className="eyebrow">YKSAT COURSE DETAILS</span>
          <p className="course-detail-category">{course.category}</p>
          <h1>
            {course.className}
            <span>{course.program}</span>
          </h1>
          <p className="course-detail-description">{course.description}</p>

          {/* Epic Rewards Hero Banner for Class 9th & 11th */}
          {isEpicReward && (
            <div className="yksat-epic-hero-badge">
              <Trophy size={18} className="text-warning" />
              <span>
                <strong>Phase-II Epic Rewards Eligible:</strong> Top 3 ranks in this class win a Laptop, Tablet, or Smartphone on admission!
              </span>
            </div>
          )}

          <div className="course-detail-facts">
            <div>
              <CalendarDays size={19} />
              <span>
                <small>Weekend Batch starts from</small>
                <strong>{getPublishedBatchStart(weekendBatch)}</strong>
              </span>
            </div>
            <div>
              <CalendarDays size={19} />
              <span>
                <small>Regular Batch starts from</small>
                <strong>{getPublishedBatchStart(regularBatch)}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Fee Section - Exact match to ACST */}
      <section className="container course-fee-section">
        <div className="course-detail-section-heading">
          <span className="eyebrow">FEE DETAILS</span>
          <h2>Plan your learning journey.</h2>
          <p>Clear, transparent fee details for the academic year.</p>
        </div>

        <div className="course-fee-layout">
          {feePlansLoading ? (
            <div className="course-fee-state-card">
              <div className="course-fee-state-top">
                <span className="course-fee-status-pill">
                  <Clock3 size={13} /> LOADING
                </span>
              </div>
              <div className="course-fee-state-body">
                <div className="course-fee-state-icon">
                  <Clock3 size={26} />
                </div>
                <div>
                  <h3>Loading fee details</h3>
                  <p>Please wait while we fetch the latest fee structure from the institute database.</p>
                </div>
              </div>
            </div>
          ) : courseFeePlans.length === 0 ? (
            <div className="course-fee-state-card">
              <div className="course-fee-state-top">
                <span className="course-fee-status-pill">
                  <Sparkles size={13} /> OFFICIAL FEE ANNOUNCEMENT
                </span>
                <span className="course-fee-year-pill">
                  {feeAcademicYear ? `Academic Year ${feeAcademicYear}` : "Academic Year 2026–27"}
                </span>
              </div>

              <div className="course-fee-state-body">
                <div className="course-fee-state-icon">
                  <IndianRupee size={28} />
                </div>
                <div>
                  <h3>Fee Details &amp; Installment Schedules</h3>
                  <p>
                    Is course ka comprehensive fee structure, flexible installment plans aur scholarship concessions
                    institute counseling desk par directly available hain. Transparent fee quotation aur targeted batch enrollment ke liye hamare academic desk se sampark karein.
                  </p>
                </div>
              </div>

              <div className="course-fee-highlights-row">
                <div className="fee-highlight-item">
                  <CheckCircle2 size={16} />
                  <span>Flexible Installment Plans Available</span>
                </div>
                <div className="fee-highlight-item">
                  <CheckCircle2 size={16} />
                  <span>Up to 100% Scholarship via YKSAT Phase-I</span>
                </div>
                <div className="fee-highlight-item">
                  <CheckCircle2 size={16} />
                  <span>Personal Academic Counseling</span>
                </div>
              </div>

              <div className="course-fee-state-actions">
                <a href="tel:9518641228" className="button button-red">
                  <PhoneCall size={16} />
                  <span>Enquire Fee on Call: 9518641228</span>
                </a>
                <a href="/#contact" className="button button-outline">
                  <MapPin size={16} />
                  <span>Visit Palwal Center Desk</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ) : (
            courseFeePlans.map((plan) => (
              <article className="course-fee-card course-fee-plan-card" key={plan.id}>
                <div className="course-fee-card-heading">
                  <span className="course-fee-icon">
                    <IndianRupee size={20} />
                  </span>
                  <div className="course-fee-heading-copy">
                    <span className="course-fee-batch-label">
                      {plan.batchType === "weekend" ? "WEEKEND BATCH" : "REGULAR BATCH"}
                    </span>
                    <h3>{plan.batchType === "weekend" ? "Weekend Batch" : "Regular Batch"}</h3>
                    <p>Academic Year: {plan.academicYear}</p>
                  </div>
                </div>

                <div className="course-tuition-total">
                  <span>Total tuition fee</span>
                  <strong>{formatCurrency(Number(plan.tuitionFeePaise) / 100)}</strong>
                </div>

                <div className="course-installment-heading">
                  <span>INSTALLMENT SCHEDULE</span>
                  <span>{(plan.installments || []).length} payments</span>
                </div>

                <div className="course-installments">
                  {(plan.installments || []).map((installment) => {
                    const days = Number(installment.days_after_enrollment);
                    const dueText = days === 0 ? "On enrollment" : `${days} days after enrollment`;
                    return (
                      <div className="course-installment-row" key={installment.id}>
                        <span className="course-installment-meta">
                          <strong>{installment.label || `Installment ${installment.installment_number}`}</strong>
                          <small>{dueText}</small>
                        </span>
                        <strong className="course-installment-amount">
                          {formatCurrency(Number(installment.amount_paise) / 100)}
                        </strong>
                      </div>
                    );
                  })}
                </div>

                <div className="course-fee-row course-registration-row">
                  <span>
                    <FileText size={15} /> Admission registration fee
                  </span>
                  <strong>{formatCurrency(Number(plan.registrationFeePaise) / 100)}</strong>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Promo Banner - Exact match */}
        <div className="acst-fee-promo">
          <div className="acst-fee-promo-copy">
            <span className="acst-fee-promo-label">YKSAT SCHOLARSHIP</span>
            <h4>Register for YKSAT Phase-I &amp; unlock tuition discounts.</h4>
            <p>
              YKSAT Phase-I registration is ₹{Math.round(yksatFeePaise / 100)}. Merit in Phase-I unlocks tuition discounts up to 100% and qualifies students for Phase-II epic rewards.
            </p>

            <div className="acst-fee-promo-actions">
              <a className="acst-fee-promo-link" href="#yksat-form">
                Register Now <ArrowRight size={16} />
              </a>
              <button
                type="button"
                className="acst-fee-promo-secondary-btn"
                onClick={() => setActiveModal("syllabus")}
              >
                <BookOpen size={16} /> View YKSAT Syllabus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Left Column (Scholarship & Syllabus), Right Column (Registration & Exam Pattern) */}
      <section className="acst-section" id="yksat-registration">
        <div className="container">
          <div className="acst-section-heading">
            <span className="eyebrow">Y.K. SCHOLARSHIP &amp; ADMISSION TEST</span>
            <h2>Score better. <span>Pay less.</span></h2>
            <p>Take the YKSAT Phase-I and earn merit tuition waivers and exciting rewards.</p>
          </div>

          <div className="acst-content-grid">
            {/* Left Column */}
            <div className="acst-left-column">
              {/* Slabs Card */}
              <article className="acst-scholarship-card">
                <div className="acst-card-heading">
                  <span className="acst-heading-icon"><Sparkles size={20} /></span>
                  <div>
                    <h3>YKSAT Phase-I Scholarship Slabs</h3>
                    <p>Your Phase-I score determines your tuition fee waiver percentage.</p>
                  </div>
                </div>

                <div className="acst-slab-table-wrap">
                  <table className="acst-slab-table">
                    <thead>
                      <tr>
                        <th>Phase-I Score</th>
                        <th>Tuition Fee Scholarship</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displaySlabs.map((slab) => (
                        <tr key={slab.label}>
                          <td>
                            <strong>{slab.range}</strong>{" "}
                            <span style={{ fontSize: "11px", color: "#64748b" }}>({slab.label})</span>
                          </td>
                          <td className={slab.discount.includes("No") ? "no-discount" : "discount-value"}>
                            {slab.discount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="acst-scholarship-note">
                  <ShieldCheck size={18} />
                  <p>
                    Phase-I scholarship applies directly to tuition fees. Students scoring &gt;90% in Phase-I become eligible for Phase-II exciting rewards.
                  </p>
                </div>

                {/* Phase-2 Rewards Callout */}
                {isEpicReward && (
                  <div className="yksat-phase2-callout-box">
                    <div className="phase2-callout-head">
                      <Gift size={18} />
                      <strong>Phase-II Epic Rewards ({course.className}):</strong>
                    </div>
                    <ul className="phase2-reward-bullets">
                      <li><strong>Rank 1 &amp; 2:</strong> 100% Free 1-Year Coaching + HP / Dell Laptop</li>
                      <li><strong>Rank 3 to 5:</strong> 75% Tuition Fee Off + Android Tablet</li>
                      <li><strong>Rank 6 to 10:</strong> 50% Tuition Fee Off + 5G Smartphone</li>
                    </ul>
                  </div>
                )}
              </article>

              {/* Interactive Action Buttons: Syllabus & Exam Pattern Modals */}
              <div className="acst-modal-actions-group">
                <button
                  type="button"
                  className="acst-action-modal-btn"
                  onClick={() => setActiveModal("syllabus")}
                >
                  <div className="acst-action-modal-btn-left">
                    <div className="acst-action-icon-circle">
                      <BookOpen size={20} />
                    </div>
                    <div className="acst-action-btn-text">
                      <strong>YKSAT Examination Syllabus</strong>
                      <span>Official subject topics &amp; curriculum breakdown</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="acst-action-chevron" />
                </button>

                <button
                  type="button"
                  className="acst-action-modal-btn"
                  onClick={() => setActiveModal("pattern")}
                >
                  <div className="acst-action-modal-btn-left">
                    <div className="acst-action-icon-circle icon-pattern">
                      <Layers size={20} />
                    </div>
                    <div className="acst-action-btn-text">
                      <strong>Format &amp; Pattern of Exam</strong>
                      <span>Question count, duration, format &amp; marking scheme</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="acst-action-chevron" />
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="acst-right-column">
              {/* Registration Form Card */}
              <article className="acst-form-card" id="yksat-form" tabIndex="-1">
                <div className="acst-form-topline">
                  <span className="acst-registration-badge">
                    <CheckCircle2 size={14} /> YKSAT REGISTRATION
                  </span>
                  <div className="acst-form-price">
                    {couponApplied && couponPricing ? (
                      <>
                        <span className="acst-original-price">
                          ₹{Math.round(couponPricing.baseFeePaise / 100)}/-
                        </span>
                        <strong className="acst-form-price-amount">
                          ₹{Math.round(couponPricing.finalFeePaise / 100)}/-
                        </strong>
                        <span>YKSAT registration fee</span>
                        <span className="acst-savings-label">
                          You save ₹{Math.round(couponPricing.discountPaise / 100)}
                        </span>
                      </>
                    ) : (
                      <>
                        <strong className="acst-form-price-amount">
                          ₹{Math.round(yksatFeePaise / 100)}/-
                        </strong>
                        <span>YKSAT registration fee</span>
                      </>
                    )}
                  </div>
                </div>

                <h3>YKSAT Registration Form</h3>
                <p className="acst-form-intro">
                  Enter student details to register for the upcoming YKSAT Phase-I offline examination.
                </p>

                {registrationResult ? (
                  <div className="acst-payment-success premium" role="status" aria-live="polite">
                    <div className="acst-success-glow" />
                    <div className="acst-success-icon">
                      <CheckCircle2 size={38} strokeWidth={2.5} />
                    </div>

                    <div className="acst-success-content">
                      <span className="acst-success-eyebrow">REGISTRATION CONFIRMED</span>
                      <h3>Application Submitted Successfully!</h3>
                      <p>
                        Congratulations! Your YKSAT Phase-I seat for <strong>{registrationResult.courseName}</strong> has been booked.
                      </p>

                      <div className="acst-success-notice">
                        <Sparkles size={19} />
                        <span>
                          <strong>Application No: {registrationResult.applicationNumber}</strong>
                          <br />
                          Your admit card and sitting plan will be shared on mobile <strong>{registrationResult.phone}</strong> and email. Registration fee of {registrationResult.registrationFee} is payable at center or during test verification.
                        </span>
                      </div>

                      <span className="acst-success-thankyou">
                        Thank you for choosing Y.K. Classes!
                      </span>

                      <button
                        type="button"
                        className="button button-red"
                        style={{ marginTop: "16px", width: "100%", justifyContent: "center" }}
                        onClick={() => setRegistrationResult(null)}
                      >
                        Register Another Candidate
                      </button>
                    </div>
                  </div>
                ) : !admissionsOpen ? (
                  <div className="acst-closed-admin-alert" style={{ margin: "20px 0", padding: "18px", borderRadius: "12px", background: "#fef2f2", border: "1.5px solid #fecaca" }}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <ShieldCheck size={22} style={{ color: "#dc2626", flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong style={{ color: "#991b1b", display: "block", marginBottom: "6px", fontSize: "15px" }}>
                          YKSAT Registrations Currently Closed
                        </strong>
                        <p style={{ color: "#b91c1c", margin: "0 0 10px 0", fontSize: "13.5px", lineHeight: "1.5" }}>
                          {closedMessage || "Sorry, YKSAT registrations are currently closed by institute administration."}
                        </p>
                        <p style={{ color: "#7f1d1d", margin: 0, fontSize: "12.5px" }}>
                          Please contact our Palwal Center helpline at <strong>+91 70157 37287</strong> for offline walk-in inquiry or upcoming test dates.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Dedicated YKSAT Coupon Box */}
                    <div className="acst-coupon-box">
                      <label htmlFor="yksat-coupon-code">Have a YKSAT coupon code?</label>
                      <div className="acst-active-coupons">
                        <h5>Available YKSAT Coupons</h5>
                        {couponsLoading ? (
                          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>Loading active coupons...</p>
                        ) : couponsError ? (
                          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>{couponsError}</p>
                        ) : activeCoupons.length === 0 ? (
                          <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>No active coupons available right now</p>
                        ) : (
                          <div className="acst-active-coupons-list">
                            {activeCoupons.map((coupon) => (
                              <button
                                type="button"
                                className="acst-active-coupon-item clickable-coupon-pill"
                                key={coupon.code}
                                onClick={() => {
                                  setCouponCode(coupon.code);
                                  setCouponApplied(false);
                                  setCouponPricing(null);
                                  setCouponMessage(`Selected coupon: ${coupon.code}. Click "Apply" to activate.`);
                                  setCouponMessageType("info");
                                }}
                                title={`Click to use code ${coupon.code}`}
                              >
                                <strong>{coupon.code}</strong>
                                <span>
                                  {coupon.discountType === "fixed"
                                    ? `₹${coupon.discountValue} OFF`
                                    : `${coupon.discountValue}% OFF`}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="acst-coupon-entry">
                        <input
                          id="yksat-coupon-code"
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponApplied(false);
                            setCouponPricing(null);
                            setCouponMessage("");
                            setCouponMessageType("");
                          }}
                          placeholder="Enter coupon code (e.g. YKSAT50)"
                          autoComplete="off"
                          spellCheck="false"
                          disabled={couponLoading}
                        />
                        <button
                          className="acst-coupon-apply"
                          type="button"
                          onClick={applyCoupon}
                          disabled={!couponCode.trim() || couponApplied || couponLoading}
                        >
                          {couponLoading ? "Checking..." : couponApplied ? "Applied ✓" : "Apply"}
                        </button>
                      </div>

                      {couponMessage && (
                        <p
                          className={`acst-coupon-message ${couponMessageType}`}
                          role="status"
                          aria-live="polite"
                          style={{ marginTop: "8px", fontSize: "12px" }}
                        >
                          {couponMessage}
                        </p>
                      )}
                    </div>

                    <form className="acst-registration-form" onSubmit={handleRegistrationSubmit}>
                      <label>
                        Student full name
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Enter student's full name"
                          autoComplete="name"
                          required
                        />
                      </label>

                      <div className="acst-form-two-columns">
                        <label>
                          Date of birth
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                          />
                        </label>
                        <label>
                          Mobile number
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="10-digit mobile number"
                            inputMode="numeric"
                            required
                          />
                        </label>
                      </div>

                      <label>
                        Email address
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="student@example.com"
                          autoComplete="email"
                          required
                        />
                      </label>

                      <div className="acst-form-two-columns">
                        <label>
                          Parent / guardian name
                          <input
                            type="text"
                            name="guardianName"
                            value={formData.guardianName}
                            onChange={handleInputChange}
                            placeholder="Enter guardian name"
                            required
                          />
                        </label>
                        <label>
                          Parent / guardian mobile
                          <input
                            type="tel"
                            name="guardianPhone"
                            value={formData.guardianPhone}
                            onChange={handleInputChange}
                            placeholder="Guardian's mobile number"
                            inputMode="numeric"
                            required
                          />
                        </label>
                      </div>

                      <label>
                        Parent / guardian email
                        <input
                          type="email"
                          name="guardianEmail"
                          value={formData.guardianEmail}
                          onChange={handleInputChange}
                          placeholder="guardian@example.com"
                          autoComplete="email"
                        />
                      </label>

                      <label>
                        School name
                        <input
                          type="text"
                          name="schoolName"
                          value={formData.schoolName}
                          onChange={handleInputChange}
                          placeholder="Enter current / last school"
                        />
                      </label>

                      <label>
                        Selected course
                        <input
                          type="text"
                          value={`${course.className} — ${course.program}`}
                          readOnly
                        />
                      </label>

                      <label>
                        Exam Phase / Mode
                        <input
                          type="text"
                          name="phase"
                          value={formData.phase}
                          readOnly
                        />
                      </label>

                      {formError && (
                        <p className="acst-payment-message error" role="alert">
                          {formError}
                        </p>
                      )}

                      <button
                        className="button button-red acst-submit-button"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Submitting Application..."
                          : `Pay ₹${couponApplied && couponPricing ? Math.round(couponPricing.finalFeePaise / 100) : Math.round(yksatFeePaise / 100)} and Register for YKSAT`}
                        <ArrowRight size={17} />
                      </button>

                      <p className="acst-form-status">
                        <ShieldCheck size={15} /> Offline test conducted at Y.K. Classes Palwal Center. Admit slip and schedule sent instantly.
                      </p>
                    </form>
                  </>
                )}
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner - Exact match */}
      <section className="container course-detail-bottom-cta">
        <div>
          <span className="eyebrow">READY TO GET STARTED?</span>
          <h2>Have questions about this course?</h2>
          <p>Talk to the Y.K. Classes team for guidance about the course and admission process.</p>
        </div>
        <Link to="/#contact" className="button button-red">
          Talk to Us <ArrowRight size={17} />
        </Link>
      </section>

      {/* Pop-out Interactive Modal for Syllabus & Exam Pattern */}
      {activeModal && (
        <div
          className="acst-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="yksat-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="acst-modal-window">
            <div className="acst-modal-header">
              <div className="acst-modal-title-group">
                <span className="acst-modal-badge">
                  {activeModal === "syllabus" ? "YKSAT CURRICULUM BREAKDOWN" : "YKSAT TEST STRUCTURE"}
                </span>
                <h3 id="yksat-modal-title">
                  {activeModal === "syllabus" ? "YKSAT Examination Syllabus" : "Format & Pattern of Exam"}
                </h3>
                <p className="acst-modal-subtitle">
                  {course.className} &bull; {course.program}
                </p>
              </div>
              <button
                type="button"
                className="acst-modal-close-btn"
                onClick={() => setActiveModal(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="acst-modal-body">
              {activeModal === "syllabus" ? (
                <CourseSpecificSyllabus course={course} examName="YKSAT" />
              ) : (
                <CourseSpecificExamPattern course={course} examName="YKSAT" />
              )}
            </div>

            <div className="acst-modal-footer">
              <button
                type="button"
                className="button button-outline acst-modal-dismiss-btn"
                onClick={() => setActiveModal(null)}
              >
                Close
              </button>
              <a
                href="#yksat-form"
                className="button button-red acst-modal-action-btn"
                onClick={() => setActiveModal(null)}
              >
                Proceed to Registration <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
