import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, MessageSquareQuote, ShieldCheck, Sparkles } from "lucide-react";

const BACKEND = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5001").replace(/\/$/, "");

// High-velocity "thrown card" projectile physics animation
const thrownCardVariants = {
  hidden: (i) => {
    // Alternating random-feeling toss angle
    const angles = [-14, 12, -9, 15, -11];
    const tilt = angles[i % angles.length];
    return {
      opacity: 0,
      scale: 1.45,
      y: -95,
      rotateZ: tilt,
      rotateX: 25,
      filter: "blur(4px)",
    };
  },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    rotateZ: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 440,
      damping: 24,
      mass: 0.8,
      delay: (i % 5) * 0.08, // Rapid 80ms sequential slam (jhab-jhab-jhab)
    },
  }),
};

export default function Reviews() {
  const reduceMotion = useReducedMotion();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`${BACKEND}/api/public/reviews`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data.success !== true) throw new Error(data.message || "Could not load reviews.");
        if (active) setReviews(data.reviews || []);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="published-reviews-page">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <div className="reviews-top-nav">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Hero Section Header */}
        <header className="reviews-hero-header">
          <span className="eyebrow">
            <Sparkles size={14} /> VERIFIED STUDENT EXPERIENCES
          </span>
          <h1>
            What Our Students Say <span className="accent">About Y.K. Classes</span>
          </h1>
          <p className="reviews-hero-subtitle">
            Authentic learning experiences and feedback submitted by our students and published after institute verification.
          </p>

          {/* Aggregate Trust Summary */}
          {reviews.length > 0 && (
            <div className="reviews-trust-bar">
              <div className="trust-stat">
                <span className="trust-stars">★★★★★</span>
                <strong>
                  {(
                    reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length
                  ).toFixed(1)}{" "}
                  / 5.0 Rating
                </strong>
              </div>
              <span className="trust-divider">·</span>
              <span className="trust-count">
                Based on {reviews.length} verified review{reviews.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </header>

        {loading ? (
          <div className="reviews-loading-state">
            <div className="reviews-spinner" />
            <p>Loading published student reviews…</p>
          </div>
        ) : error ? (
          <div className="reviews-error-card">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()} className="button button-red">
              Retry
            </button>
          </div>
        ) : !reviews.length ? (
          <div className="reviews-empty-state">
            <MessageSquareQuote size={48} />
            <h3>No Reviews Published Yet</h3>
            <p>Approved student reviews will appear here soon.</p>
            <Link to="/" className="button button-red">
              Explore Our Courses
            </Link>
          </div>
        ) : (
          <div className="published-reviews-grid">
            {reviews.map((review, index) => {
              const fullName = review.display_name || "Student";
              const firstName = fullName.trim().split(/\s+/)[0];
              const rating = Math.min(Math.max(Number(review.rating) || 5, 1), 5);
              const courseName = review.course_label || "Academic Program";

              return (
                <motion.article
                  className="published-review-card"
                  key={review.id}
                  custom={index}
                  variants={thrownCardVariants}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView={reduceMotion ? {} : "visible"}
                  viewport={{ once: true, amount: 0.1 }}
                >
                  {/* Top Row: [Studentname first word]  [No. of stars Out of 5] */}
                  <div className="review-card-top-row">
                    <div className="review-firstword-wrapper">
                      <div className="review-avatar-chip">
                        {firstName.charAt(0).toUpperCase()}
                      </div>
                      <strong className="review-firstword-name">{firstName}</strong>
                    </div>

                    <div className="review-stars-wrapper" aria-label={`${rating} out of 5 stars`}>
                      <div className="stars-row">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`star-icon ${star <= rating ? "star-gold" : "star-empty"}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="rating-pill">{rating} / 5</span>
                    </div>
                  </div>

                  {/* Main Section: Student ka review */}
                  <div className="review-card-body">
                    <span className="quote-mark">“</span>
                    <p className="review-text-content">{review.review_text}</p>
                  </div>

                  {/* Bottom Section: [Student ka naam]  (course of student) */}
                  <div className="review-card-bottom-row">
                    <div className="review-student-meta">
                      <strong className="review-full-student-name">{fullName}</strong>
                      <span className="review-student-course">({courseName})</span>
                    </div>
                    <span className="verified-student-badge">
                      <ShieldCheck size={13} /> Verified Student
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="reviews-footer-cta">
          <Link to="/" className="button button-outline">
            <ArrowLeft size={16} /> Return to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
