import { useEffect, useRef, useState } from "react";
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
  Layers,
  X,
} from "lucide-react";
import { courses, formatCurrency } from "../data/courseData";
import AcstClosedNotice from "../components/AcstClosedNotice";
import { CourseSpecificSyllabus, CourseSpecificExamPattern } from "../components/AcstSyllabusAndPattern";

// Local development defaults to the separate student-management backend.
// In production, set VITE_BACKEND_URL to the deployed backend origin.
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

function loadRazorpayCheckout() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[data-razorpay-checkout="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load Razorpay Checkout. Please try again.")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay Checkout. Please check your internet connection."));
    document.body.appendChild(script);
  });
}

function NotFound() {
  return (
    <main className="course-details-page">
      <section className="container course-not-found">
        <span className="eyebrow">COURSE NOT FOUND</span>
        <h1>We couldn't find this course.</h1>
        <p>Please return to Admission and choose one of the available programs.</p>
        <Link className="button button-red" to="/fees">
          <ArrowLeft size={17} /> Back to Admission
        </Link>
      </section>
    </main>
  );
}

export default function CourseDetails() {
  const { courseSlug } = useParams();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponPricing, setCouponPricing] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageType, setCouponMessageType] = useState("");
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(true);
  const [couponsError, setCouponsError] = useState("");
  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [batchesError, setBatchesError] = useState("");
  const [feePlans, setFeePlans] = useState([]);
  const [feePlansLoading, setFeePlansLoading] = useState(true);
  const [feePlansError, setFeePlansError] = useState("");
  const [feeAcademicYear, setFeeAcademicYear] = useState("");
  const [admissionsOpen, setAdmissionsOpen] = useState(null);
  const [acstRegistrationFeePaise, setAcstRegistrationFeePaise] = useState(null);
  const [closedMessage, setClosedMessage] = useState("Sorry, registrations for Admission are closed now.");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentMessageType, setPaymentMessageType] = useState("");
  const [paymentOrderId, setPaymentOrderId] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [pendingPaymentResponse, setPendingPaymentResponse] = useState(null);
  const [registrationResult, setRegistrationResult] = useState(null);
  const [paymentAwaitingCheck, setPaymentAwaitingCheck] = useState(false);
  const paymentCallbackReceived = useRef(false);
  const [scholarshipSlabs, setScholarshipSlabs] = useState([]);
  const [scholarshipAcademicYear, setScholarshipAcademicYear] = useState("");
  const [scholarshipLoading, setScholarshipLoading] = useState(true);
  const [scholarshipError, setScholarshipError] = useState("");
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

  // Load the latest published ACST scholarship policy.
  // Refresh every 30 seconds so Admin Portal changes appear automatically.
  useEffect(() => {
    let isCurrent = true;

    async function loadScholarship() {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/public/acst-scholarship`
        );

        const result = await response.json().catch(() => ({}));

        if (
          !response.ok ||
          result.success !== true ||
          !result.scholarship ||
          !Array.isArray(result.scholarship.slabs)
        ) {
          throw new Error(
            result.message || "Unable to load scholarship details."
          );
        }

        const slabs = result.scholarship.slabs
          .map((slab) => ({
            minimumPercentage: Number(slab.minimumPercentage),
            discountPercentage: Number(slab.discountPercentage),
          }))
          .filter(
            (slab) =>
              Number.isFinite(slab.minimumPercentage) &&
              Number.isFinite(slab.discountPercentage)
          )
          .sort(
            (a, b) => b.minimumPercentage - a.minimumPercentage
          );

        if (isCurrent) {
          setScholarshipSlabs(slabs);
          setScholarshipAcademicYear(
            result.scholarship.academicYear || ""
          );
          setScholarshipError("");
        }
      } catch (error) {
        if (isCurrent) {
          setScholarshipError(
            error.message || "Unable to load scholarship details."
          );
        }
      } finally {
        if (isCurrent) {
          setScholarshipLoading(false);
        }
      }
    }

    loadScholarship();

    const intervalId = setInterval(loadScholarship, 30000);

    return () => {
      isCurrent = false;
      clearInterval(intervalId);
    };
  }, []);

  const applyCoupon = async () => {
    const normalizedCode = couponCode.trim();
    if (!normalizedCode || couponLoading) return;

    setCouponLoading(true);
    setCouponMessage("");
    setCouponMessageType("");
    setCouponApplied(false);
    setCouponPricing(null);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/acst/validate-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode: normalizedCode }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || "This coupon code could not be verified.");
      }

      if (
        result.couponApplied !== true ||
        !Number.isSafeInteger(result.baseFeePaise) ||
        !Number.isSafeInteger(result.discountPaise) ||
        !Number.isSafeInteger(result.finalFeePaise)
      ) {
        throw new Error("The server returned an invalid coupon response. Please try again.");
      }

      setCouponPricing({
        couponCode: result.couponCode,
        baseFeePaise: result.baseFeePaise,
        discountPaise: result.discountPaise,
        finalFeePaise: result.finalFeePaise,
      });
      setCouponApplied(true);
      setCouponMessage(result.message || "Coupon applied successfully!");
      setCouponMessageType("success");
    } catch (error) {
      setCouponApplied(false);
      setCouponPricing(null);
      setCouponMessage(
        error instanceof TypeError
          ? "Unable to reach the Y.K. Classes server. Please make sure the backend is running."
          : error.message || "Unable to verify this coupon. Please try again."
      );
      setCouponMessageType("error");
    } finally {
      setCouponLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse) => {
    if (!paymentResponse) return;

    setPendingPaymentResponse(paymentResponse);
    setPaymentLoading(true);
    setPaymentMessage("Payment received. Verifying securely with Razorpay...");
    setPaymentMessageType("info");

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/acst/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentResponse),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success !== true || !result.applicationNumber) {
        throw new Error(
          result.message ||
          "Payment confirmation is still pending. Please retry verification."
        );
      }

      setRegistrationResult(result);
      setPendingPaymentResponse(null);
      setPaymentMessage("Payment verified and ACST registration confirmed!");
      setPaymentMessageType("success");
    } catch (error) {
      setPaymentMessage(
        `${error.message || "Payment verification could not be completed."} Do not pay again. Retry verification below or contact Y.K. Classes with your payment/order ID.`
      );
      setPaymentMessageType("error");
    } finally {
      setPaymentLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentIntentId || paymentLoading) return;

    setPaymentLoading(true);
    setPaymentMessage("Checking the latest payment status with Razorpay...");
    setPaymentMessageType("info");

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/acst/check-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Unable to check payment status.");
      }

      if (result.paid && result.applicationNumber) {
        setRegistrationResult(result);
        setPendingPaymentResponse(null);
        setPaymentAwaitingCheck(false);
        setPaymentMessage("Payment verified and ACST registration confirmed!");
        setPaymentMessageType("success");
      } else if (result.pendingCapture) {
        setPaymentAwaitingCheck(true);
        setPaymentMessage(
          "Razorpay is still processing the payment capture. Please do not pay again; check the status again shortly."
        );
        setPaymentMessageType("info");
      } else {
        setPaymentAwaitingCheck(false);
        setPaymentOrderId("");
        setPaymentIntentId("");
        setPaymentMessage(
          "No captured payment was found for this order. You can safely try the payment again."
        );
        setPaymentMessageType("info");
      }
    } catch (error) {
      setPaymentAwaitingCheck(true);
      setPaymentMessage(
        error.message || "Unable to check payment status. Please retry before making another payment."
      );
      setPaymentMessageType("error");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();

    if (paymentLoading || registrationResult || paymentAwaitingCheck || pendingPaymentResponse) return;

    if (!selectedBatch || selectedBatch.registrationStatus !== "open") {
      setPaymentMessage("Please select a batch with an open registration window.");
      setPaymentMessageType("error");
      return;
    }

    if (couponCode.trim() && !couponApplied) {
      setPaymentMessage("Please apply the coupon code or clear the coupon field before continuing.");
      setPaymentMessageType("error");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const applicantDetails = {
      batchId: selectedBatchId,
      fullName: String(formData.get("fullName") || "").trim(),
      dateOfBirth: String(formData.get("dateOfBirth") || ""),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      guardianName: String(formData.get("guardianName") || "").trim(),
      guardianPhone: String(formData.get("guardianPhone") || "").trim(),
      guardianEmail: String(formData.get("guardianEmail") || "").trim().toLowerCase(),
      schoolName: String(formData.get("schoolName") || "").trim(),
      couponCode: couponApplied && couponPricing ? couponPricing.couponCode : null,
    };

    setPaymentLoading(true);
    setPaymentMessage("");
    setPaymentMessageType("");
    setPaymentOrderId("");
    setPaymentIntentId("");
    setPaymentAwaitingCheck(false);
    setPendingPaymentResponse(null);
    paymentCallbackReceived.current = false;

    try {
      const orderResponse = await fetch(`${BACKEND_BASE_URL}/api/acst/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicantDetails),
      });
      const orderResult = await orderResponse.json().catch(() => ({}));

      if (
        !orderResponse.ok ||
        orderResult.success !== true ||
        !orderResult.orderId ||
        !orderResult.paymentIntentId ||
        !orderResult.keyId ||
        !Number.isSafeInteger(orderResult.amount) ||
        orderResult.currency !== "INR"
      ) {
        throw new Error(
          orderResult.message || "Unable to prepare your ACST payment. Please try again."
        );
      }

      setPaymentOrderId(orderResult.orderId);
      setPaymentIntentId(orderResult.paymentIntentId);
      await loadRazorpayCheckout();

      const checkout = new window.Razorpay({
        key: orderResult.keyId,
        amount: orderResult.amount,
        currency: orderResult.currency,
        name: orderResult.name || "Y.K. Classes",
        description: orderResult.description || "ACST Registration",
        order_id: orderResult.orderId,
        prefill: {
          name: applicantDetails.fullName,
          email: applicantDetails.email,
          contact: applicantDetails.phone,
        },
        notes: {
          batch: selectedBatch.batchName,
          course: `${course.className} — ${course.program}`,
        },
        theme: { color: "#e31837" },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            if (!paymentCallbackReceived.current) {
              setPaymentAwaitingCheck(true);
              setPaymentMessage(
                "Checkout was closed. Check the order status before trying another payment."
              );
              setPaymentMessageType("info");
            }
          },
        },
        handler: (paymentResponse) => {
          paymentCallbackReceived.current = true;
          void verifyPayment({
            paymentIntentId: orderResult.paymentIntentId,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          });
        },
      });

      checkout.on("payment.failed", (failure) => {
        const description =
          failure?.error?.description ||
          failure?.error?.reason ||
          "The payment could not be completed.";
        setPaymentLoading(false);
        setPaymentAwaitingCheck(true);
        setPaymentMessage(`${description} Check the order status before trying another payment.`);
        setPaymentMessageType("error");
      });

      setPaymentMessage("Razorpay Checkout opened. Complete the payment securely.");
      setPaymentMessageType("info");
      checkout.open();
    } catch (error) {
      setPaymentLoading(false);
      setPaymentMessage(
        error instanceof TypeError
          ? "Unable to reach the Y.K. Classes backend. Please check that the backend is running."
          : error.message || "Unable to start payment. Please try again."
      );
      setPaymentMessageType("error");
    }
  };

  useEffect(() => {
    let isCurrent = true;

    async function loadBatches() {
      setBatchesLoading(true);
      setBatchesError("");

      try {
        const response = await fetch(`${BACKEND_BASE_URL}/api/acst/batches`);
        const result = await response.json().catch(() => ({}));

        if (
          !response.ok ||
          result.success !== true ||
          !Array.isArray(result.batches) ||
          typeof result.admissionsOpen !== "boolean"
        ) {
          throw new Error(result.message || "Unable to load ACST batch schedules.");
        }

        if (isCurrent) {
          setBatches(result.batches);
          setAdmissionsOpen(result.admissionsOpen);
          setClosedMessage(
            typeof result.closedMessage === "string" && result.closedMessage.trim()
              ? result.closedMessage
              : "Sorry, registrations for Admission are closed now."
          );
        }
      } catch (error) {
        if (isCurrent) {
          setBatchesError(
            error instanceof TypeError
              ? "Unable to connect to the Y.K. Classes backend. Please check that the backend is running."
              : error.message || "Unable to load batch schedules. Please refresh the page."
          );
        }
      } finally {
        if (isCurrent) setBatchesLoading(false);
      }
    }

    loadBatches();

    return () => {
      isCurrent = false;
    };
  }, []);

  // Load the admin-configured ACST registration fee.
  useEffect(() => {
    let isCurrent = true;

    async function loadAcstRegistrationFee() {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/public/admission-status`
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          throw new Error("Unable to load ACST registration fee.");
        }

        const feePaise = Number(result.acstRegistrationFeePaise);

        if (!Number.isSafeInteger(feePaise) || feePaise <= 0) {
          throw new Error("Invalid ACST registration fee.");
        }

        if (isCurrent) {
          setAcstRegistrationFeePaise(feePaise);
        }
      } catch (error) {
        console.error("ACST fee loading error:", error);
      }
    }

    loadAcstRegistrationFee();

    const intervalId = setInterval(loadAcstRegistrationFee, 30000);

    return () => {
      isCurrent = false;
      clearInterval(intervalId);
    };
  }, []);

  // Load active fee plans for the current academic year.
  // Refresh every 30 seconds so Admin Portal changes appear automatically.
  useEffect(() => {
    let isCurrent = true;

    async function loadFeePlans() {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/public/fee-plans`
        );

        const result = await response.json().catch(() => ({}));

        if (
          !response.ok ||
          result.success !== true ||
          !Array.isArray(result.feePlans)
        ) {
          throw new Error(result.message || "Unable to load fee details.");
        }

        if (isCurrent) {
          setFeePlans(result.feePlans);
          setFeeAcademicYear(result.academicYear || "");
          setFeePlansError("");
        }
      } catch (error) {
        if (isCurrent) {
          setFeePlansError(
            error instanceof TypeError
              ? "Unable to connect to the fee details service."
              : error.message || "Unable to load fee details."
          );
        }
      } finally {
        if (isCurrent) {
          setFeePlansLoading(false);
        }
      }
    }

    loadFeePlans();

    const intervalId = setInterval(loadFeePlans, 30000);

    return () => {
      isCurrent = false;
      clearInterval(intervalId);
    };
  }, []);

  // Load all active ACST coupons from the backend.
  // Refresh automatically every 30 seconds so admin changes appear on the website.
  useEffect(() => {
    let isCurrent = true;

    async function loadActiveCoupons() {
      try {
        const response = await fetch(
          `${BACKEND_BASE_URL}/api/acst/active-coupons`
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success !== true || !Array.isArray(result.coupons)) {
          throw new Error("Unable to load active coupons.");
        }

        if (isCurrent) {
          setActiveCoupons(result.coupons);
          setCouponsError("");
        }
      } catch (error) {
        if (isCurrent) {
          setCouponsError(
            "Unable to load coupons right now. Please refresh the page."
          );
        }
      } finally {
        if (isCurrent) {
          setCouponsLoading(false);
        }
      }
    }

    loadActiveCoupons();

    const intervalId = setInterval(loadActiveCoupons, 30000);

    return () => {
      isCurrent = false;
      clearInterval(intervalId);
    };
  }, []);

  const course = courses.find((item) => item.slug === courseSlug);

  if (!course) return <NotFound />;

  // Match database batches to this exact course page. Class/course names come
  // from the active academic catalogue returned by the backend.
  const courseBatches = batches.filter((batch) =>
    (batch.className || "").trim().toLowerCase() === course.className.trim().toLowerCase() &&
    (batch.courseName || "").trim().toLowerCase() === course.program.trim().toLowerCase()
  );
  const courseFeePlans = feePlans.filter((plan) =>
    (plan.course?.className || "").trim().toLowerCase() ===
    course.className.trim().toLowerCase() &&
    (plan.course?.courseName || "").trim().toLowerCase() ===
    course.program.trim().toLowerCase()
  );
  const canShowRegistrationForm = admissionsOpen === true && courseBatches.length > 0;
  const weekendBatch = courseBatches.find(
    (batch) => (batch.batchType || "").trim().toLowerCase() === "weekend"
  );
  const regularBatch = courseBatches.find(
    (batch) => (batch.batchType || "").trim().toLowerCase() === "regular"
  );
  const selectedBatch = courseBatches.find((batch) => batch.id === selectedBatchId);
  const hasOpenBatch = courseBatches.some((batch) => batch.registrationStatus === "open");
  const hasUpcomingBatch = courseBatches.some((batch) => batch.registrationStatus === "upcoming");
  const hasClosedBatch = courseBatches.some((batch) => batch.registrationStatus === "closed");
  const getPublishedBatchStart = (batch) => {
    if (batchesLoading) return "Loading...";
    if (batchesError) return "Unavailable";
    return formatBatchDate(batch?.startsOn);
  };

  if (admissionsOpen === false) {
    return <AcstClosedNotice closedMessage={closedMessage} courseName={course.className} />;
  }

  return (
    <main className="course-details-page">
      <section className="course-detail-hero">
        <div className="container">
          <Link className="course-back-link" to="/fees">
            <ArrowLeft size={16} /> Back to ACST Programs
          </Link>

          <span className="eyebrow">COURSE DETAILS</span>
          <p className="course-detail-category">{course.category}</p>
          <h1>
            {course.className}
            <span>{course.program}</span>
          </h1>
          <p className="course-detail-description">{course.description}</p>

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

      <section className="container course-fee-section">
        <div className="course-detail-section-heading">
          <span className="eyebrow">FEE DETAILS</span>
          <h2>Plan your learning journey.</h2>
          <p>Clear, transparent fee details for the current academic year.</p>
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
          ) : feePlansError ? (
            <div className="course-fee-state-card" role="status">
              <div className="course-fee-state-top">
                <span className="course-fee-status-pill error-pill">
                  <Clock3 size={13} /> STATUS
                </span>
              </div>
              <div className="course-fee-state-body">
                <div>
                  <h3>Fee details are temporarily unavailable.</h3>
                  <p>{feePlansError}</p>
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
                  <span>Up to 100% Scholarship via Local Test</span>
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
                    <h3>
                      {plan.batchType === "weekend" ? "Weekend Batch" : "Regular Batch"}
                    </h3>
                    <p>Academic Year: {plan.academicYear}</p>
                  </div>
                </div>

                <div className="course-tuition-total">
                  <span>Total tuition fee</span>
                  <strong>
                    {formatCurrency(Number(plan.tuitionFeePaise) / 100)}
                  </strong>
                </div>

                <div className="course-installment-heading">
                  <span>INSTALLMENT SCHEDULE</span>
                  <span>{(plan.installments || []).length} payments</span>
                </div>

                <div className="course-installments">
                  {(plan.installments || []).map((installment) => {
                    const days = Number(installment.days_after_enrollment);
                    const dueText = days === 0
                      ? "On enrollment"
                      : `${days} day${days === 1 ? "" : "s"} after enrollment`;

                    return (
                      <div className="course-installment-row" key={installment.id}>
                        <span className="course-installment-meta">
                          <strong>
                            {installment.label || `Installment ${installment.installment_number}`}
                          </strong>
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
                  <strong>
                    {formatCurrency(Number(plan.registrationFeePaise) / 100)}
                  </strong>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="acst-fee-promo">
          <div className="acst-fee-promo-copy">
            <span className="acst-fee-promo-label">ACST SCHOLARSHIP</span>
            <h4>Register for ACST &amp; unlock tuition discounts.</h4>
            <p>
              ACST registration is{" "}
              {acstRegistrationFeePaise !== null
                ? formatCurrency(acstRegistrationFeePaise / 100)
                : "loading"}.
              {" "}Use an available coupon during registration to save on your fee.
              Your ACST score can also unlock tuition-fee discounts.
            </p>

            <div className="acst-fee-promo-actions">
              {canShowRegistrationForm ? (
                <a className="acst-fee-promo-link" href="#acst-form">
                  Register Now <ArrowRight size={16} />
                </a>
              ) : (
                <span className="acst-registration-closed-label">
                  {admissionsOpen === false
                    ? "Registration closed"
                    : admissionsOpen === true
                      ? "Course unavailable"
                      : "Checking availability"}
                </span>
              )}

              <button
                type="button"
                className="acst-fee-promo-secondary-btn"
                onClick={() => setActiveModal("syllabus")}
              >
                <BookOpen size={16} /> View ACST Syllabus
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="acst-section" id="acst-registration">
        <div className="container">
          <div className="acst-section-heading">
            <span className="eyebrow">Y.K. CLASSES SCHOLARSHIP TEST</span>
            <h2>Score better. <span>Pay less.</span></h2>
            <p>Take the ACST and earn a tuition-fee discount based on your test score.</p>
          </div>

          <div className="acst-content-grid">
            <div className="acst-left-column">
              <article className="acst-scholarship-card">
                <div className="acst-card-heading">
                <span className="acst-heading-icon"><Sparkles size={20} /></span>
                <div>
                  <h3>ACST scholarship slabs</h3>
                  <p>
                    Your ACST score determines your tuition discount.
                    {scholarshipAcademicYear &&
                      ` Academic Year ${scholarshipAcademicYear}.`}
                  </p>
                </div>
              </div>

              <div className="acst-slab-table-wrap">
                {scholarshipLoading ? (
                  <p>Loading latest scholarship slabs...</p>
                ) : scholarshipError ? (
                  <p role="alert">{scholarshipError}</p>
                ) : scholarshipSlabs.length === 0 ? (
                  <p>Scholarship details will be announced soon.</p>
                ) : (
                  <table className="acst-slab-table">
                    <thead>
                      <tr>
                        <th>ACST score</th>
                        <th>Tuition fee discount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {scholarshipSlabs.map((slab, index) => {
                        const previousSlab = scholarshipSlabs[index - 1];

                        const scoreRange =
                          index === 0
                            ? `${slab.minimumPercentage}% and above`
                            : `${slab.minimumPercentage}% to ${previousSlab.minimumPercentage}%`;
                        return (
                          <tr key={slab.minimumPercentage}>
                            <td>{scoreRange}</td>

                            <td
                              className={
                                slab.discountPercentage === 0
                                  ? "no-discount"
                                  : "discount-value"
                              }
                            >
                              {slab.discountPercentage === 0
                                ? "No discount"
                                : `${slab.discountPercentage}%`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="acst-scholarship-note">
                <ShieldCheck size={18} />
                <p>
                  Scholarship discounts are based on the currently published policy
                  and apply to tuition fees only.
                </p>
              </div>
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
                    <strong>ACST Examination Syllabus</strong>
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

          {/* Right Column: Registration Form & Format of Exam */}
          <div className="acst-right-column">
            {canShowRegistrationForm ? (
              <article className="acst-form-card" id="acst-form" tabIndex="-1">
                <div className="acst-form-topline">
                  <span className="acst-registration-badge"><CheckCircle2 size={14} /> ACST REGISTRATION</span>
                  <div className="acst-form-price" aria-live="polite" aria-atomic="true">
                    {couponApplied && couponPricing && (
                      <span className="acst-original-price">
                        ₹{couponPricing.baseFeePaise / 100}/-
                      </span>
                    )}
                    <strong
                      key={couponApplied ? "discounted-price" : "regular-price"}
                      className="acst-form-price-amount"
                    >
                      {couponApplied && couponPricing
                        ? `₹${couponPricing.finalFeePaise / 100}/-`
                        : acstRegistrationFeePaise !== null
                          ? `₹${acstRegistrationFeePaise / 100}/-`
                          : "Loading..."}
                    </strong>
                    <span>ACST registration fee</span>
                    {couponApplied && couponPricing && (
                      <span className="acst-savings-label">
                        You save ₹{couponPricing.discountPaise / 100}
                      </span>
                    )}
                  </div>
                </div>

                <h3>ACST registration form</h3>
                <p className="acst-form-intro">Enter the student's details. Registration will become available when the batch registration window is announced.</p>

                <div className="acst-coupon-box">
                  <label htmlFor="acst-coupon-code">Have a coupon code?</label>
                  <div className="acst-active-coupons">
                    <h5>Available Coupons</h5>

                    {couponsLoading ? (
                      <p>Loading active coupons...</p>
                    ) : couponsError ? (
                      <p role="status">{couponsError}</p>
                    ) : activeCoupons.length === 0 ? (
                      <p>No active coupons</p>
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
                                : coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}% OFF`
                                  : "Special discount"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="acst-coupon-entry">
                    <input
                      id="acst-coupon-code"
                      type="text"
                      value={couponCode}
                      onChange={(event) => {
                        setCouponCode(event.target.value);
                        setCouponApplied(false);
                        setCouponPricing(null);
                        setCouponMessage("");
                        setCouponMessageType("");
                      }}
                      placeholder="Enter coupon code"
                      autoComplete="off"
                      spellCheck="false"
                      aria-describedby="acst-coupon-message"
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
                  <p
                    id="acst-coupon-message"
                    className={`acst-coupon-message ${couponMessageType}`}
                    role="status"
                    aria-live="polite"
                  >
                    {couponMessage || "Enter an active coupon code to get a discount on your ACST registration fee."}
                  </p>
                </div>

                <form className="acst-registration-form" onSubmit={handleRegistrationSubmit}>
                  <label>
                    Student full name
                    <input type="text" name="fullName" placeholder="Enter student's full name" autoComplete="name" required />
                  </label>

                  <div className="acst-form-two-columns">
                    <label>
                      Date of birth
                      <input type="date" name="dateOfBirth" required />
                    </label>
                    <label>
                      Mobile number
                      <input type="tel" name="phone" placeholder="10-digit mobile number" inputMode="numeric" required />
                    </label>
                  </div>

                  <label>
                    Email address
                    <input type="email" name="email" placeholder="student@example.com" autoComplete="email" required />
                  </label>

                  <div className="acst-form-two-columns">
                    <label>
                      Parent / guardian name
                      <input type="text" name="guardianName" placeholder="Enter guardian name" required />
                    </label>
                    <label>
                      Parent / guardian mobile
                      <input type="tel" name="guardianPhone" placeholder="Guardian's mobile number" inputMode="numeric" required />
                    </label>
                  </div>

                  <label>
                    Parent / guardian email
                    <input
                      type="email"
                      name="guardianEmail"
                      placeholder="guardian@example.com"
                      autoComplete="email"
                      required
                    />
                  </label>

                  <label>
                    School name
                    <input type="text" name="schoolName" placeholder="Enter current / last school" />
                  </label>

                  <label>
                    Selected course
                    <input type="text" value={`${course.className} — ${course.program}`} readOnly />
                  </label>

                  <label>
                    Select batch
                    <select
                      name="batch"
                      value={selectedBatchId}
                      onChange={(event) => setSelectedBatchId(event.target.value)}
                      disabled={batchesLoading || Boolean(batchesError) || courseBatches.length === 0}
                    >
                      <option value="">
                        {batchesLoading
                          ? "Loading available batches..."
                          : batchesError
                            ? "Batch schedule unavailable"
                            : courseBatches.length === 0
                              ? "No batch registration schedule announced"
                              : "Choose an available batch"}
                      </option>
                      {courseBatches.map((batch) => (
                        <option
                          key={batch.id}
                          value={batch.id}
                          disabled={batch.registrationStatus !== "open"}
                        >
                          {batch.batchName}
                          {batch.academicYear ? ` — ${batch.academicYear}` : ""}
                          {batch.registrationStatus === "upcoming"
                            ? ` (Opens ${formatBatchDate(batch.registrationOpensAt, true)})`
                            : batch.registrationStatus === "open"
                              ? " (Registration open)"
                              : batch.registrationStatus === "closed"
                                ? " (Registrations Closed)"
                                : " (Schedule not announced)"}
                        </option>
                      ))}
                    </select>
                  </label>

                  {selectedBatch && (
                    <p className="acst-batch-dates">
                      Teaching starts: {formatBatchDate(selectedBatch.startsOn)}
                      {" · "}
                      Registration closes: {formatBatchDate(selectedBatch.registrationClosesAt, true)}
                    </p>
                  )}

                  {batchesLoading && (
                    <p className="acst-form-status"><Clock3 size={15} /> Checking available batch schedules...</p>
                  )}

                  {!batchesLoading && batchesError && (
                    <p className="acst-form-status acst-batch-status-error" role="alert">
                      <Clock3 size={15} /> {batchesError}
                    </p>
                  )}

                  {!batchesLoading && !batchesError && courseBatches.length === 0 && (
                    <p className="acst-form-status"><Clock3 size={15} /> No registration window has been announced for this course yet. Batch teaching dates can be announced separately.</p>
                  )}

                  {!batchesLoading && !batchesError && courseBatches.length > 0 && !hasOpenBatch && hasUpcomingBatch && (
                    <p className="acst-form-status"><Clock3 size={15} /> Upcoming batches are shown above. Registration is not open yet.</p>
                  )}
                  {!batchesLoading && !batchesError && courseBatches.length > 0 && !hasOpenBatch && !hasUpcomingBatch && hasClosedBatch && (
                    <p className="acst-form-status acst-batch-status-error"><Clock3 size={15} /> Registrations Closed for the currently listed batch(es). Please contact Y.K. Classes for the next admission window.</p>
                  )}

                  {!batchesLoading && !batchesError && hasOpenBatch && !selectedBatch && (
                    <p className="acst-form-status"><Clock3 size={15} /> Select a batch marked “Registration open”.</p>
                  )}

                  <button
                    className="button button-red acst-submit-button"
                    type="submit"
                    disabled={
                      acstRegistrationFeePaise === null ||
                      paymentLoading ||
                      Boolean(registrationResult) ||
                      Boolean(pendingPaymentResponse) ||
                      paymentAwaitingCheck ||
                      batchesLoading ||
                      Boolean(batchesError) ||
                      selectedBatch?.registrationStatus !== "open"
                    }
                  >
                    {paymentLoading
                      ? "Processing payment..."
                      : paymentAwaitingCheck
                        ? "Check previous payment status first"
                        : pendingPaymentResponse
                          ? "Retry payment verification first"
                          : selectedBatch?.registrationStatus === "open"
                            ? `Pay ₹${couponApplied && couponPricing
                              ? couponPricing.finalFeePaise / 100
                              : acstRegistrationFeePaise !== null
                                ? acstRegistrationFeePaise / 100
                                : "..."
                            } and Register`
                            : "Select an open batch to continue"}
                    <ArrowRight size={17} />
                  </button>

                  {paymentMessage && !registrationResult && (
                    <p
                      className={`acst-payment-message ${paymentMessageType}`}
                      role={paymentMessageType === "error" ? "alert" : "status"}
                      aria-live="polite"
                    >
                      {paymentMessage}
                    </p>
                  )}

                  {pendingPaymentResponse && !registrationResult && (
                    <div className="acst-payment-retry">
                      <p>
                        Payment reference: {pendingPaymentResponse.razorpay_payment_id}
                        {paymentOrderId ? ` · Order: ${paymentOrderId}` : ""}
                      </p>
                      <button
                        type="button"
                        className="acst-coupon-apply"
                        onClick={() => void verifyPayment(pendingPaymentResponse)}
                        disabled={paymentLoading}
                      >
                        {paymentLoading ? "Verifying..." : "Retry payment verification"}
                      </button>
                    </div>
                  )}

                  {paymentAwaitingCheck && !pendingPaymentResponse && !registrationResult && (
                    <div className="acst-payment-retry">
                      {paymentOrderId && <p>Payment order: {paymentOrderId}</p>}
                      <button
                        type="button"
                        className="acst-coupon-apply"
                        onClick={() => void checkPaymentStatus()}
                        disabled={paymentLoading}
                      >
                        {paymentLoading ? "Checking..." : "Check payment status"}
                      </button>
                    </div>
                  )}


                  {registrationResult && (
                    <div className="acst-payment-success premium" role="status" aria-live="polite">
                      <div className="acst-success-glow" />

                      <div className="acst-success-icon">
                        <CheckCircle2 size={38} strokeWidth={2.5} />
                        <span className="acst-success-sparkle sparkle-one">✦</span>
                        <span className="acst-success-sparkle sparkle-two">✧</span>
                        <span className="acst-success-sparkle sparkle-three">✦</span>
                      </div>

                      <div className="acst-success-content">
                        <span className="acst-success-eyebrow">
                          PAYMENT VERIFIED SUCCESSFULLY
                        </span>

                        <h3>Registration for ACST is Successful!</h3>

                        <p>
                          Congratulations! Your ACST registration has been completed
                          successfully.
                        </p>

                        <div className="acst-success-notice">
                          <Sparkles size={19} />
                          <span>
                            Your application number, ACST exam date and sitting plan
                            details will be shared with you and your guardian through
                            email, SMS and WhatsApp on the registered contact details.
                          </span>
                        </div>

                        <span className="acst-success-thankyou">
                          Thank you for choosing Y.K. Classes!
                        </span>
                      </div>
                    </div>
                  )}


                  <p className="acst-form-status">
                    <ShieldCheck size={15} /> Your ACST application is created only after the backend verifies a captured Razorpay payment.
                  </p>
                </form>
              </article>
            ) : (
              <article className="acst-form-card acst-closed-card" aria-live="polite">
                <div className="acst-closed-topline">
                  <span className="acst-registration-badge">
                    <Clock3 size={15} /> ACST REGISTRATION
                  </span>
                  <span className="acst-status-pill-offline">
                    <Sparkles size={13} /> Offline Test Active
                  </span>
                </div>

                <h3>
                  {admissionsOpen === false
                    ? "Online ACST Registrations Are Closed"
                    : "Course Registration Currently Unavailable Online"}
                </h3>

                <p className="acst-closed-desc">
                  {admissionsOpen === false
                    ? (closedMessage || "Online ACST registration is currently closed by institute administration.")
                    : "Is course ki online registration abhi active nahi hai. Aap institute center par visit karke offline admission le sakte hain aur scholarship pane ke liye center par Local Scholarship Admission Test appear kar sakte hain."}
                </p>

                <div className="acst-closed-benefits">
                  <div className="closed-benefit-item">
                    <CheckCircle2 size={16} />
                    <span><strong>Institute Walk-in:</strong> Direct spot admission &amp; academic counseling</span>
                  </div>
                  <div className="closed-benefit-item">
                    <CheckCircle2 size={16} />
                    <span><strong>Local Scholarship Test:</strong> Center par test dekar up to 100% scholarship unlock karein</span>
                  </div>
                </div>

                <div className="acst-closed-card-actions">
                  <a href="/#contact" className="button button-red">
                    <span>Visit Institute &amp; Take Local Test</span>
                    <ArrowRight size={16} />
                  </a>
                  <Link to="/yksat" className="button button-outline">
                    <Award size={16} />
                    <span>Check YKSAT Announcements</span>
                  </Link>
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>

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
          aria-labelledby="acst-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
        >
          <div className="acst-modal-window">
            <div className="acst-modal-header">
              <div className="acst-modal-title-group">
                <span className="acst-modal-badge">
                  {activeModal === "syllabus" ? "ACST CURRICULUM BREAKDOWN" : "ACST TEST STRUCTURE"}
                </span>
                <h3 id="acst-modal-title">
                  {activeModal === "syllabus" ? "ACST Examination Syllabus" : "Format & Pattern of Exam"}
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
                <CourseSpecificSyllabus course={course} examName="ACST" />
              ) : (
                <CourseSpecificExamPattern course={course} examName="ACST" />
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
                href="#acst-form"
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

