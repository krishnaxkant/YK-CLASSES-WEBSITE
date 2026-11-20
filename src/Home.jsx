
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, BookOpen, GraduationCap,
  Target, Users, CheckCircle2, Brain,
  ClipboardCheck, Sparkles, Mail, Phone, MapPin, ShieldCheck
} from "lucide-react";
import { image } from "framer-motion/client";

const BACKEND = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5001").replace(/\/$/, "");

const courses = [
  {
    number: "01",
    title: "JEE Preparation",
    subtitle: "Engineering entrance",
    description:
      "Strengthen problem-solving skills through structured learning and focused exam preparation.",
    icon: Target,
    tags: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    number: "02",
    title: "NEET Preparation",
    subtitle: "Medical entrance",
    description:
      "Develop subject knowledge and a disciplined preparation approach for medical entrance exams.",
    icon: GraduationCap,
    tags: ["Biology", "Physics", "Chemistry"],
  },
  {
    number: "03",
    title: "Foundation",
    subtitle: "Learn beyond the basics",
    description:
      "Develop curiosity, logical thinking and the academic fundamentals needed for future challenges.",
    icon: Brain,
    tags: ["Fundamentals", "Logic", "Growth"],
  },
];

const benefits = [
  {
    icon: Brain,
    title: "Concept-first learning",
    text: "Understand the why behind every answer, not just the final result.",
  },
  {
    icon: ClipboardCheck,
    title: "Structured practice",
    text: "Build consistency through revision, practice and a clear learning path.",
  },
  {
    icon: Users,
    title: "Student-focused guidance",
    text: "Make learning more purposeful with guidance focused on individual progress.",
  },
];



const studentReviews = [
  {
    name: "Mohit",
    institute: "Y.K. Classes, Palwal",
    course: "Topper · Classroom Program",
    air: "", // Add rank here later (e.g. "AIR-120")
    quote:
      "Y.K. Classes gave me crystal-clear fundamentals and the discipline to stay consistent every single day. The faculty's personal attention and test analysis turned my weak chapters into my biggest strengths.",
    image: "/images/toppers/Mohit.png",
  },

  {
    name: "Lakshay",
    institute: "Y.K. Classes, Palwal",
    course: "Topper · Classroom Program",
    air: "", // Add rank here later
    quote:
      "Every lecture here focuses on deep conceptual clarity rather than rote learning. Regular practice sheets and one-on-one doubt sessions helped me approach even the toughest questions with complete confidence.",
    image: "/images/toppers/Lakshay.png",
  },

  {
    name: "Lovkesh",
    institute: "Y.K. Classes, Palwal",
    course: "Topper · Classroom Program",
    air: "", // Add rank here later
    quote:
      "Joining Y.K. Classes was the best decision of my preparation journey. The mentors tracked my progress after every mock test and guided me step by step on how to improve speed and accuracy.",
    image: "/images/toppers/Lovkesh.png",
  },

  {
    name: "Chahak",
    institute: "Y.K. Classes, Palwal",
    course: "Topper · Classroom Program",
    air: "", // Add rank here later
    quote:
      "The classroom teaching is engaging, well-paced, and completely exam-oriented. Weekly assessments and detailed feedback helped me build unshakable confidence right before the final exam.",
    image: "/images/toppers/Chahak.png",
  },

  {
    name: "Himanshi",
    institute: "Y.K. Classes, Palwal",
    course: "Topper · Classroom Program",
    air: "", // Add rank here later
    quote:
      "Y.K. Classes taught me how to study smart with clear notes, targeted DPPs, and timely revision. Whenever I felt stressed, my teachers guided me calmly and kept my morale high.",
    image: "/images/toppers/Himanshi.png",
  },

  {
    name: "Yogita",
    institute: "Y.K. Classes, Palwal",
    course: "Topper · Classroom Program",
    air: "", // Add rank here later
    quote:
      "The disciplined study routine and competitive peer group here pushed me to excel beyond my expectations. Every concept was explained from basics to advanced level with total clarity.",
    image: "/images/toppers/Yogita.png",
  },

  {
    name: "Aman",
    institute: "Y.K. Classes, Palwal",
    course: "Topper · Classroom Program",
    air: "", // Add rank here later
    quote:
      "Consistent mentorship and real-exam pattern test series at Y.K. Classes made a massive difference in my score. The faculty never lets any student fall behind and always stays approachable.",
    image: "/images/toppers/Aman.png",
  },

  {
    name: "Badal",
    institute: "Y.K. Classes, Palwal",
    course: "Topper · Classroom Program",
    air: "", // Add rank here later
    quote:
      "My journey at Y.K. Classes transformed the way I think and solve problems. Dedicated teachers, crisp study material, and regular performance reviews gave me a clear path to success.",
    image: "/images/toppers/Badal.png",
  },
];


const steps = [
  {
    n: "01",
    title: "Learn",
    tagline: "Concept Clarity",
    icon: BookOpen,
    text: "Build deep understanding through crystal-clear explanations and rock-solid fundamentals.",
  },
  {
    n: "02",
    title: "Practice",
    tagline: "Guided Application",
    icon: Target,
    text: "Apply your knowledge and develop speed, precision, and confidence through regular tests.",
  },
  {
    n: "03",
    title: "Progress",
    tagline: "Continuous Growth",
    icon: Sparkles,
    text: "Analyze mistakes, close learning gaps and steadily rise towards your dream AIR rank.",
  },
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: reduceMotion ? 0 : 0.65,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ eyebrow, title, accent, description }) {
  return (
    <Reveal className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title} <span className="accent">{accent}</span></h2>
      <p>{description}</p>
    </Reveal>
  );
}

// Silky Smooth 60/120 FPS Rolling Word Transition using GPU hardware acceleration
function SmoothRollingWord({ words, interval = 2800, className = "" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  return (
    <span className={`smooth-rolling-container ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          initial={{ y: 22, opacity: 0, filter: "blur(3px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -22, opacity: 0, filter: "blur(3px)" }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="smooth-rolling-text"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// 3D Cylindrical Entrance Variants for Course Cards
const cylindricalVariants = [
  // 01: JEE Preparation - Rotates inward around left flank of 3D cylinder
  {
    initial: {
      opacity: 0,
      rotateY: -65,
      rotateX: 10,
      translateZ: -240,
      x: -70,
      scale: 0.85,
    },
    inView: {
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 1.15,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.05,
      },
    },
  },
  // 02: NEET Preparation - 3D full cylindrical spin from back to front
  {
    initial: {
      opacity: 0,
      rotateY: 180,
      rotateX: -15,
      translateZ: -340,
      scale: 0.72,
    },
    inView: {
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      scale: 1,
      transition: {
        duration: 1.3,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2,
      },
    },
  },
  // 03: Foundation - Rotates inward around right flank of 3D cylinder
  {
    initial: {
      opacity: 0,
      rotateY: 65,
      rotateX: 10,
      translateZ: -240,
      x: 70,
      scale: 0.85,
    },
    inView: {
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      translateZ: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 1.15,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.35,
      },
    },
  },
];

export default function Home() {
  const reduceMotion = useReducedMotion();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" && location.hash === "#contact") {
      const timer = setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.hash]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");

  const reviewSliderRef = useRef(null);
  const [activeReview, setActiveReview] = useState(0);
  const [reviewTransitionEnabled, setReviewTransitionEnabled] = useState(true);
  const [reviewStep, setReviewStep] = useState(0);
  const reviewsForDisplay = studentReviews;

  const [visibleReviews, setVisibleReviews] = useState(
    typeof window !== "undefined" && window.innerWidth <= 600 ? 1 : 3
  );

  useEffect(() => {
    const updateVisibleReviews = () => {
      setVisibleReviews(window.innerWidth <= 600 ? 1 : 3);
    };

    updateVisibleReviews();
    window.addEventListener("resize", updateVisibleReviews);

    return () => window.removeEventListener("resize", updateVisibleReviews);
  }, []);

  // Measure one card plus the gap so every move is exactly one card wide.
  useEffect(() => {
    const slider = reviewSliderRef.current;
    if (!slider) return;

    const updateReviewStep = () => {
      const track = slider.querySelector(".review-track");
      const card = track?.querySelector(".review-card");
      if (!track || !card) return;

      const trackStyle = window.getComputedStyle(track);
      const gap =
        Number.parseFloat(trackStyle.columnGap || trackStyle.gap || "0") || 0;

      setReviewStep(card.getBoundingClientRect().width + gap);
    };

    updateReviewStep();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateReviewStep);
      return () => window.removeEventListener("resize", updateReviewStep);
    }

    const observer = new ResizeObserver(updateReviewStep);
    observer.observe(slider);

    return () => observer.disconnect();
  }, [visibleReviews]);

  // Move forward by one topper every five seconds.
  useEffect(() => {
    if (reviewsForDisplay.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveReview((current) =>
        current >= reviewsForDisplay.length ? reviewsForDisplay.length : current + 1
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [reviewsForDisplay.length]);

  // When the slider reaches the cloned cards, jump back to the first card
  // without animation. This makes the loop seamless for any number of toppers.
  const handleReviewTransitionEnd = (event) => {
    if (event.propertyName !== "transform") return;

    if (activeReview >= reviewsForDisplay.length) {
      setReviewTransitionEnabled(false);
      setActiveReview(0);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setReviewTransitionEnabled(true);
        });
      });
    }
  };

  const loopedReviews = [
    ...reviewsForDisplay,
    ...Array.from(
      { length: visibleReviews },
      (_, index) => reviewsForDisplay[index % reviewsForDisplay.length]
    ),
  ];

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name")?.toString().trim(),
      phone: formData.get("phone")?.toString().trim(),
      course: formData.get("course")?.toString().trim(),
      message: formData.get("message")?.toString().trim() || "Not provided",
      website: formData.get("website")?.toString().trim() || "",
    };

    setIsSubmitting(true);
    setSubmitSuccess("");
    setSubmitError("");

    try {
      const response = await fetch("/api/send-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success !== true) {
        throw new Error(
          result.error || "Your enquiry could not be sent. Please try again."
        );
      }

      setSubmitSuccess("Thank you! Your enquiry has been sent successfully. Our team will contact you soon.");
      form.reset();
      setSelectedCourse("");
    } catch (error) {
      setSubmitError(
        error.message || "Unable to send your enquiry. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>

      <main>
        <section className="hero" id="home">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="container hero-grid">
            <Reveal className="hero-copy">
              <span className="eyebrow hero-eyebrow-animated">
                <span>YOUR DREAMS. OUR </span>
                <SmoothRollingWord
                  words={[
                    "MISSION.",
                    "TARGET.",
                    "PASSION.",
                    "COMMITMENT.",
                    "PROMISE.",
                    "GUIDANCE."
                  ]}
                  interval={2600}
                  className="eyebrow-roller"
                />
              </span>

              <h1>
                Build a strong{" "}
                <span className="hero-rotating-word-badge">
                  <SmoothRollingWord
                    words={[
                      "future",
                      "foundation",
                      "excellence",
                      "discipline",
                      "mindset",
                      "success"
                    ]}
                    interval={2800}
                    className="heading-roller"
                  />
                </span>{" "}
                with <span className="accent">Y.K. Classes.</span>
              </h1>

              <p className="hero-description">
                A smarter approach to learning, stronger concepts
                and the confidence to move towards your academic goals.
              </p>

              <div className="hero-actions">
                <a href="#courses" className="button button-red">
                  Explore Programs <ArrowRight size={17} />
                </a>
                <Link to="/fees" className="button button-outline hero-acst-btn">
                  <span>Take ACST Exam</span>
                  <Sparkles size={16} />
                </Link>
                <Link to="/yksat" className="button button-outline hero-acst-btn">
                  <span>Take YKSAT</span>
                  <Sparkles size={16} />
                </Link>
              </div>

              <div className="hero-points">
                <span><CheckCircle2 size={16} /> Concept clarity</span>
                <span><CheckCircle2 size={16} /> Guided practice</span>
                <span><Sparkles size={16} /> Up to 100% Scholarship</span>
              </div>
            </Reveal>

            <Reveal className="hero-art" delay={0.12}>
              <div className="art-backdrop" />

              <img
                className="hero-image"
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1100&q=85"
                alt="Student preparing for examinations"
              />

              <div className="image-shade" />

              <div className="hero-art-label">
                <span className="label-dot" />
                YOUR NEXT CHAPTER STARTS HERE
              </div>

              <motion.div
                className="floating-note note-top"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="note-icon"><Sparkles size={19} /></span>
                <span><strong>Learn with purpose.</strong><small>Build strong fundamentals</small></span>
              </motion.div>

              <motion.div
                className="floating-note note-bottom"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="note-icon red-icon"><Target size={19} /></span>
                <span><strong>One step at a time.</strong><small>Your journey, your progress</small></span>
              </motion.div>
            </Reveal>
          </div>

          <div className="container trust-wrap">
            <Reveal className="trust-grid">
              {[
                [Users, "Student-focused", "Guidance that supports learning"],
                [BookOpen, "Concept clarity", "Strong academic foundations"],
                [Target, "Purposeful practice", "Learn, apply and improve"],
                [GraduationCap, "Future-ready", "Prepare for what's ahead"],
              ].map(([Icon, title, text]) => (
                <div className="trust-item" key={title}>
                  <span className="trust-icon"><Icon size={22} /></span>
                  <div><strong>{title}</strong><small>{text}</small></div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="section courses-section" id="courses">
          <div className="container">
            <SectionHeading
              eyebrow="OUR PROGRAMS"
              title="Find your path to"
              accent="progress."
              description="Explore learning options for school academics, competitive exams and foundational development."
            />

            <div className="courses-cylindrical-stage">
              <div className="course-grid">
                {courses.map((course, index) => {
                  const Icon = course.icon;
                  const variant = cylindricalVariants[index % cylindricalVariants.length];

                  return (
                    <motion.div
                      key={course.number}
                      className="course-3d-wrapper"
                      initial={reduceMotion ? false : variant.initial}
                      whileInView={reduceMotion ? {} : variant.inView}
                      viewport={{ once: true, amount: 0.18 }}
                    >
                      <article className="course-card">
                        <div className="course-top">
                          <span className="course-number">{course.number}</span>
                          <span className="course-icon"><Icon size={23} /></span>
                        </div>

                        <span className="course-subtitle">{course.subtitle}</span>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>

                        <div className="course-tags">
                          {course.tags.map(tag => <span key={tag}>{tag}</span>)}
                        </div>

                        <a
                          href="#contact"
                          className="course-link"
                          onClick={() => setSelectedCourse(course.title)}
                        >
                          Explore program <ArrowUpRight size={17} />
                        </a>
                      </article>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section about-section" id="about">
          <div className="container about-grid">
            <Reveal className="about-visual">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=85"
                alt="Students learning in an educational environment"
                loading="lazy"
              />
              <div className="about-overlay">
                <span>THE Y.K. APPROACH</span>
                <h3>Understand more.<br />Achieve with confidence.</h3>
              </div>
              <div className="about-accent" />
            </Reveal>

            <Reveal className="about-content">
              <span className="eyebrow">WHY Y.K. CLASSES</span>
              <h2>Learning that goes beyond <span className="accent">memorising.</span></h2>
              <p className="section-description">
                Real progress begins with understanding. Build your
                knowledge, strengthen your learning habits and approach
                new challenges with greater confidence.
              </p>

              <div className="benefit-list">
                {benefits.map(({ icon: Icon, title, text }) => (
                  <div className="benefit-item" key={title}>
                    <span className="benefit-icon"><Icon size={20} /></span>
                    <div><h3>{title}</h3><p>{text}</p></div>
                  </div>
                ))}
              </div>

              <a href="#contact" className="button button-blue">
                Talk to Our Team <ArrowRight size={17} />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section approach-section" id="approach">
          <div className="container">
            <SectionHeading
              eyebrow="OUR LEARNING PHILOSOPHY"
              title="Three steps."
              accent="One stronger you."
              description="A clear and purposeful learning process built around understanding, application and improvement."
            />

            <div className="steps-perspective-stage">
              <div className="steps-grid">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.n}
                      className="step-card-motion-wrapper"
                      initial={reduceMotion ? false : { opacity: 0, y: 45, rotateX: 18, scale: 0.92 }}
                      whileInView={reduceMotion ? {} : { opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.85,
                        delay: index * 0.16,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <article className="step-card step-card-interactive">
                        <div className="step-card-glow" />
                        <div className="step-header">
                          <div className="step-badge-wrap">
                            <span className="step-number-badge">{step.n}</span>
                            <span className="step-tagline">{step.tagline}</span>
                          </div>
                          <span className="step-icon-bubble">
                            <Icon size={22} />
                          </span>
                        </div>

                        <div className="step-progress-track">
                          <motion.div 
                            className="step-progress-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.2, ease: "easeOut" }}
                          />
                        </div>

                        <h3 className="step-title">{step.title}</h3>
                        <p className="step-description">{step.text}</p>

                        <div className="step-card-bottom-bar" />
                      </article>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section reviews-section" id="student-success">
          <div className="container">
            <SectionHeading
              eyebrow="OUR STUDENTS, OUR PRIDE"
              title="Our toppers."
              accent="Their journeys."
              description="Meet our achievers and read about their learning journeys at Y.K. Classes."
            />

            <div className="review-slider" ref={reviewSliderRef}>
              <div
                className="review-track"
                style={{
                  transform: `translate3d(-${activeReview * reviewStep}px, 0, 0)`,
                  transition: reviewTransitionEnabled
                    ? "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)"
                    : "none",
                }}
                onTransitionEnd={handleReviewTransitionEnd}
              >
                {loopedReviews.map((review, index) => (
                  <article className="review-card" key={`${review.name}-${index}`}>
                    <div className="review-photo-wrap">
                      <img
                        className="review-photo-brand-logo"
                        src="/logo.png"
                        alt="Y.K. Classes"
                        loading="lazy"
                      />
                      <img
                        className="review-photo topper-image"
                        src={review.image}
                        alt={`${review.name} - Y.K. Classes topper`}
                        loading={index < visibleReviews ? "eager" : "lazy"}
                        onError={(event) => {
                          event.currentTarget.hidden = true;
                          const fallback = event.currentTarget.nextElementSibling;
                          if (fallback) fallback.hidden = false;
                        }}
                      />
                      <div className="review-photo-fallback" hidden>
                        <GraduationCap size={34} />
                        <span>Add topper photo</span>
                      </div>
                    </div>

                    <div className="review-card-content">
                      <span className="review-quote-mark">“</span>
                      <p className="review-quote">{review.quote}</p>

                      <div className="review-student">
                        <div className="review-avatar">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <h3>{review.name}</h3>
                          <p>{review.course}</p>
                          <span>{review.institute}</span>
                          {review.air && (
                            <span className="review-rank">
                              AIR {review.air.replace(/^AIR\s*/i, "")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="review-dots">
              {reviewsForDisplay.map((review, index) => (
                <button
                  key={`${review.name}-dot-${index}`}
                  type="button"
                  className={activeReview % reviewsForDisplay.length === index ? "active" : ""}
                  onClick={() => {
                    setReviewTransitionEnabled(true);
                    setActiveReview(index);
                  }}
                  aria-label={`Show ${review.name}`}
                />
              ))}
            </div>

            <div className="reviews-home-link-wrap">
              <Link to="/reviews" className="button button-outline reviews-explore-all-btn">
                <span>View All Verified Student Reviews</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>


        <section className="cta-section">
          <div className="container">
            <Reveal className="cta-panel">
              <div className="cta-decoration" />
              <div className="cta-copy">
                <span className="eyebrow eyebrow-light">YOUR NEXT CHAPTER</span>
                <h2>Your future deserves the <span>right start.</span></h2>
                <p>Discover a learning program that matches your academic goals.</p>
              </div>
              <a href="#contact" className="button button-white">
                Enquire About Admission <ArrowRight size={17} />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="container contact-grid">
            <Reveal className="contact-copy">
              <span className="eyebrow">LET'S CONNECT</span>
              <h2>Take the first step <span className="accent">today.</span></h2>
              <p>
                Tell us which course interests you. Get in touch with
                Y.K. Classes to learn more about the available programs
                and admission process.
              </p>

              <div className="contact-detail">
                <span><Mail size={19} /></span>
                <div><strong>Email</strong><small>ykclassespalwal@gmail.com</small></div>
              </div>
              <div className="contact-detail">
                <span><Phone size={19} /></span>
                <div><strong>Phone</strong><small>9518641228</small></div>
              </div>
              <div className="contact-detail">
                <span><MapPin size={19} /></span>
                <div><strong>Visit us</strong><small>Opposite Indusind Bank, New Colony Road, Agra Chowk, Palwal-121102, Haryana</small></div>
              </div>
            </Reveal>

            <Reveal className="form-wrap" delay={0.1}>
              <form className="enquiry-form" onSubmit={handleSubmit}>
                <h3>Course enquiry</h3>
                <p>Share your details to get started.</p>

                {/* Honeypot field: genuine visitors should leave this empty. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="form-honeypot"
                />

                <div className="form-fields">
                  <label>
                    Student name
                    <input name="name" required placeholder="Enter your name" autoComplete="name" />
                  </label>

                  <label>
                    Phone number
                    <input name="phone" type="tel" required
                      pattern="[0-9+() -]{7,20}"
                      placeholder="Enter your phone number" autoComplete="tel" />
                  </label>

                  <label>
                    Interested course
                    <select
                      name="course"
                      required
                      value={selectedCourse}
                      onChange={event => setSelectedCourse(event.target.value)}
                    >
                      <option value="">Select a course</option>
                      {courses.map(course => (
                        <option key={course.title} value={course.title}>
                          {course.title}
                        </option>
                      ))}
                      <option value="Other / Need guidance">Other / Need guidance</option>
                    </select>
                  </label>

                  <label>
                    Message <span className="optional">(optional)</span>
                    <textarea name="message" rows="3" placeholder="How can we help?" />
                  </label>
                </div>


                <button
                  type="submit"
                  className="button button-red submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Submit Enquiry"}
                  <ArrowRight size={17} />
                </button>

                {submitSuccess && (
                  <p className="form-feedback" role="status">
                    {submitSuccess}
                  </p>
                )}

                {submitError && (
                  <p className="form-error" role="alert">
                    {submitError}
                  </p>
                )}

                <p className="form-submit-note">
                  Your enquiry details are sent securely to Y.K. Classes.
                </p>


              </form>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
