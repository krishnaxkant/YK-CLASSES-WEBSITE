import React from "react";
import {
  BookOpen,
  Check,
  Layers,
  Clock,
  AlertCircle
} from "lucide-react";

/**
 * Returns class and stream-specific syllabus based on the selected course.
 */
export function getCourseSyllabus(course) {
  if (!course) return null;
  const className = String(course.className || "").toLowerCase();
  const program = String(course.program || "").toLowerCase();
  const category = String(course.category || "").toLowerCase();
  const slug = String(course.slug || "").toLowerCase();

  const isJee = program.includes("jee") || category.includes("engineering") || slug.includes("jee");
  const isNeet = program.includes("neet") || category.includes("medical") || slug.includes("neet");
  const isDropper = className.includes("dropper") || slug.includes("dropper");

  // Class 7th
  if (className.includes("7") || className.includes("vii")) {
    return {
      classLabel: "Class 7th",
      streamLabel: "Foundation Division",
      subjects: [
        {
          name: "Physics",
          icon: "⚡",
          topics: [
            "Electricity: Circuits and their components",
            "Heat transfer in Nature"
          ]
        },
        {
          name: "Chemistry",
          icon: "🧪",
          topics: [
            "Exploring Substances: Acidic, Basic and Neutral",
            "The world of metals and Non-Metals"
          ]
        },
        {
          name: "Biology",
          icon: "🌿",
          topics: [
            "Adolescence: A stage of growth and change",
            "Life process in Animals",
            "Life Processes in plants"
          ]
        },
        {
          name: "Mathematics",
          icon: "📐",
          topics: [
            "Integers, Fractions and Decimals",
            "Data Handling & Simple Equations",
            "Lines and Angles",
            "The triangle and its properties",
            "Congruence of Triangles",
            "Comparing Quantities"
          ]
        },
        {
          name: "Mental Ability",
          icon: "🧠",
          topics: [
            "Direction Sense & Blood Relations",
            "Number Series & Letter Series",
            "Mathematical Operations",
            "Missing Term in Figure",
            "Mirror Images & Water Images"
          ]
        }
      ]
    };
  }

  // Class 8th
  if (className.includes("8") || className.includes("viii")) {
    return {
      classLabel: "Class 8th",
      streamLabel: "Foundation Division",
      subjects: [
        {
          name: "Physics",
          icon: "⚡",
          topics: [
            "Light",
            "Pressure",
            "Winds, Storms and Cyclones"
          ]
        },
        {
          name: "Chemistry",
          icon: "🧪",
          topics: [
            "Particulate Nature of matter",
            "The Amazing world of solutes, solvents and solutions"
          ]
        },
        {
          name: "Biology",
          icon: "🌿",
          topics: [
            "The invisible living world: Beyond our Naked eye",
            "Health: The Ultimate Treasure"
          ]
        },
        {
          name: "Mathematics",
          icon: "📐",
          topics: [
            "Rational Numbers",
            "Linear Equations in one Variable",
            "Understanding Quadrilaterals & Data Handling",
            "Squares & Square Roots, Cube and Cube Roots",
            "Comparing Quantities",
            "Algebraic Expressions"
          ]
        },
        {
          name: "Mental Ability",
          icon: "🧠",
          topics: [
            "Direction Sense & Blood Relations",
            "Calendar & Seating Arrangement",
            "Number Series & Letter Series",
            "Missing Term in Figure",
            "Mathematical Operations",
            "Mirror Images, Water Images & Figure Completion"
          ]
        }
      ]
    };
  }

  // Class 9th
  if (className.includes("9") || className.includes("ix")) {
    return {
      classLabel: "Class 9th",
      streamLabel: "Foundation Division",
      subjects: [
        {
          name: "Physics",
          icon: "⚡",
          topics: [
            "Motion",
            "Force and Laws of motion",
            "Work"
          ]
        },
        {
          name: "Chemistry",
          icon: "🧪",
          topics: [
            "Exploring mixtures and their separation",
            "Atomic foundations of matter"
          ]
        },
        {
          name: "Biology",
          icon: "🌿",
          topics: [
            "Cell: The building Block of life",
            "Tissues in Action"
          ]
        },
        {
          name: "Mathematics",
          icon: "📐",
          topics: [
            "Orienting yourself: The use of coordinates",
            "Introduction to Linear Polynomials",
            "The world of Numbers",
            "Exploring Algebraic Identities",
            "Measuring space: Perimeter and Area"
          ]
        },
        {
          name: "Mental Ability",
          icon: "🧠",
          topics: [
            "Direction Sense & Blood Relations",
            "Calendar & Seating Arrangement",
            "Number Series & Letter Series",
            "Missing Term in Figure",
            "Mathematical Operations",
            "Mirror Images, Water Images & Figure Completion"
          ]
        }
      ]
    };
  }

  // Class 10th
  if (className.includes("10") || className.includes("x")) {
    return {
      classLabel: "Class 10th",
      streamLabel: "Foundation & Boards Division",
      subjects: [
        {
          name: "Physics",
          icon: "⚡",
          topics: [
            "Light – Reflection and Refraction",
            "Human Eye and Colourful World",
            "Electricity"
          ]
        },
        {
          name: "Chemistry",
          icon: "🧪",
          topics: [
            "Chemical Reactions and Equations",
            "Acids, Bases and Salts",
            "Metals and Non-Metals"
          ]
        },
        {
          name: "Biology",
          icon: "🌿",
          topics: [
            "Life Processes",
            "Control and Coordination",
            "How do Organisms Reproduce?"
          ]
        },
        {
          name: "Mathematics",
          icon: "📐",
          topics: [
            "Real Numbers & Polynomials",
            "Pair of Linear Equations in Two Variables",
            "Quadratic Equations & Arithmetic Progression",
            "Triangles & Coordinate Geometry",
            "Introduction to Trigonometry & Applications of Trigonometry"
          ]
        },
        {
          name: "Mental Ability",
          icon: "🧠",
          topics: [
            "Direction Sense & Blood Relations",
            "Calendar & Seating Arrangement",
            "Number Series & Letter Series",
            "Missing Term in Figure",
            "Mathematical Operations",
            "Mirror Images, Water Images & Figure Completion"
          ]
        }
      ]
    };
  }

  // Class 12th or Dropper
  if (className.includes("12") || className.includes("xii") || isDropper) {
    const classTitle = isDropper ? "Dropper Batch" : "Class 12th";
    if (isNeet) {
      // ONLY PHY, CHEM, BIO (NO MATH, NO MENTAL ABILITY)
      return {
        classLabel: classTitle,
        streamLabel: "Medical / NEET Division",
        subjects: [
          {
            name: "Physics",
            icon: "⚡",
            topics: [
              "Electric Charges and Fields",
              "Electrostatic Potential and Fields",
              "Current Electricity",
              "Moving Charges and Magnetism, Magnetism and Matter",
              "Electromagnetic Induction & Alternating Currents"
            ]
          },
          {
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Solutions & Chemical Kinetics",
              "Electrochemistry",
              "Haloalkanes and Haloarenes",
              "Alcohols, Phenols & Ethers",
              "Aldehydes, Ketones & Carboxylic Acids",
              "Nitrogen containing organic compounds (Amines)"
            ]
          },
          {
            name: "Biology (Botany & Zoology)",
            icon: "🌿",
            topics: [
              "Sexual Reproduction in Flowering Plants",
              "Human Reproduction & Reproductive Health",
              "Principles of Inheritance and Variations",
              "Molecular Basis of Inheritance",
              "Evolution",
              "Human Health and Disease"
            ]
          }
        ]
      };
    } else {
      // ONLY PHY, CHEM, MATH (NO BIO, NO MENTAL ABILITY)
      return {
        classLabel: classTitle,
        streamLabel: "Engineering / JEE Division",
        subjects: [
          {
            name: "Physics",
            icon: "⚡",
            topics: [
              "Electric Charges and Fields",
              "Electrostatic Potential and Fields",
              "Current Electricity",
              "Moving Charges and Magnetism, Magnetism and Matter",
              "Electromagnetic Induction & Alternating Currents"
            ]
          },
          {
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Solutions & Chemical Kinetics",
              "Electrochemistry",
              "Haloalkanes and Haloarenes",
              "Alcohols, Phenols & Ethers",
              "Aldehydes, Ketones & Carboxylic Acids",
              "Nitrogen containing organic compounds (Amines)"
            ]
          },
          {
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Relations and Functions",
              "Inverse Trigonometric Functions",
              "Matrices and Determinants",
              "Continuity and Differentiability",
              "Applications of Derivatives",
              "Integral Calculus"
            ]
          }
        ]
      };
    }
  }

  // Class 11th
  if (className.includes("11") || className.includes("xi")) {
    if (isNeet) {
      // ONLY PHY, CHEM, BIO (NO MATH, NO MENTAL ABILITY)
      return {
        classLabel: "Class 11th",
        streamLabel: "Medical / NEET Division",
        subjects: [
          {
            name: "Physics",
            icon: "⚡",
            topics: [
              "Physical world and measurement",
              "Motion in a straight line & Motion in a plane",
              "Laws of Motion",
              "Work, Energy and Power",
              "System of particles and rotational motion"
            ]
          },
          {
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Some Basic Concepts of Chemistry",
              "Atomic Structure",
              "Periodic Properties",
              "Chemical Bonding",
              "Thermodynamics"
            ]
          },
          {
            name: "Biology (Botany & Zoology)",
            icon: "🌿",
            topics: [
              "The Living World & Biological classification",
              "Plant Kingdom & Morphology of Flowering Plants",
              "Structural Organisation in Animals",
              "Biomolecules",
              "Digestion and Absorption",
              "Breathing and Exchange of Gases"
            ]
          }
        ]
      };
    } else {
      // ONLY PHY, CHEM, MATH (NO BIO, NO MENTAL ABILITY)
      return {
        classLabel: "Class 11th",
        streamLabel: "Engineering / JEE Division",
        subjects: [
          {
            name: "Physics",
            icon: "⚡",
            topics: [
              "Physical world and measurement",
              "Motion in a straight line & Motion in a plane",
              "Laws of Motion",
              "Work, Energy and Power",
              "System of particles and rotational motion"
            ]
          },
          {
            name: "Chemistry",
            icon: "🧪",
            topics: [
              "Some Basic Concepts of Chemistry",
              "Atomic Structure",
              "Periodic Properties",
              "Chemical Bonding",
              "Thermodynamics"
            ]
          },
          {
            name: "Mathematics",
            icon: "📐",
            topics: [
              "Sets & Logarithm",
              "Trigonometry",
              "Quadratic Equations",
              "Progression and Series",
              "Straight Lines"
            ]
          }
        ]
      };
    }
  }

  // Default Fallback: Class 8th Foundation
  return {
    classLabel: course.className || "Class 8th",
    streamLabel: course.program || "Foundation Division",
    subjects: [
      {
        name: "Physics",
        icon: "⚡",
        topics: [
          "Light",
          "Pressure",
          "Winds, Storms and Cyclones"
        ]
      },
      {
        name: "Chemistry",
        icon: "🧪",
        topics: [
          "Particulate Nature of matter",
          "The Amazing world of solutes, solvents and solutions"
        ]
      },
      {
        name: "Biology",
        icon: "🌿",
        topics: [
          "The invisible living world: Beyond our Naked eye",
          "Health: The Ultimate Treasure"
        ]
      },
      {
        name: "Mathematics",
        icon: "📐",
        topics: [
          "Rational Numbers",
          "Linear Equations in one Variable",
          "Understanding Quadrilaterals & Data Handling",
          "Squares & Square Roots, Cube and Cube Roots",
          "Comparing Quantities",
          "Algebraic Expressions"
        ]
      },
      {
        name: "Mental Ability",
        icon: "🧠",
        topics: [
          "Direction Sense & Blood Relations",
          "Calendar & Seating Arrangement",
          "Number Series & Letter Series",
          "Missing Term in Figure",
          "Mathematical Operations",
          "Mirror Images, Water Images & Figure Completion"
        ]
      }
    ]
  };
}

/**
 * Returns class and stream-specific Exam Pattern based on the selected course.
 */
export function getCourseExamPattern(course) {
  if (!course) return null;
  const className = String(course.className || "").toLowerCase();
  const program = String(course.program || "").toLowerCase();
  const category = String(course.category || "").toLowerCase();
  const slug = String(course.slug || "").toLowerCase();

  const isJee = program.includes("jee") || category.includes("engineering") || slug.includes("jee");
  const isNeet = program.includes("neet") || category.includes("medical") || slug.includes("neet");
  const isDropper = className.includes("dropper") || slug.includes("dropper");

  if (isNeet) {
    const label = isDropper ? "Dropper / Target Batch (NEET)" : `${course.className || "Class 11th/12th"} (NEET)`;
    return {
      title: `Format & Pattern of Exam · ${label}`,
      classes: `${course.className || "Class 11th / 12th"} · Medical Division`,
      totalQuestions: 120,
      duration: "2 Hours",
      badgeColor: "#059669",
      breakdown: [
        { subject: "Physics", questions: 30 },
        { subject: "Chemistry", questions: 30 },
        { subject: "Biology (Botany & Zoology)", questions: 60 }
      ]
    };
  }

  if (isJee) {
    const label = isDropper ? "Dropper / Target Batch (JEE)" : `${course.className || "Class 11th/12th"} (JEE)`;
    return {
      title: `Format & Pattern of Exam · ${label}`,
      classes: `${course.className || "Class 11th / 12th"} · Engineering Division`,
      totalQuestions: 60,
      duration: "2 Hours",
      badgeColor: "#d97706",
      breakdown: [
        { subject: "Physics", questions: 20 },
        { subject: "Chemistry", questions: 20 },
        { subject: "Mathematics", questions: 20 }
      ]
    };
  }

  // Foundation classes (7th, 8th, 9th, 10th)
  const classLabel = course.className || "Class 8th";
  return {
    title: `Format & Pattern of Exam · ${classLabel}`,
    classes: `${classLabel} · Foundation Division`,
    totalQuestions: 75,
    duration: "2 Hours",
    badgeColor: "#2563eb",
    breakdown: [
      { subject: "Physics", questions: 15 },
      { subject: "Chemistry", questions: 15 },
      { subject: "Biology", questions: 15 },
      { subject: "Mathematics", questions: 15 },
      { subject: "Mental Ability", questions: 15 }
    ]
  };
}

/**
 * 1. Course-Specific Syllabus Card (Displayed in Left Column beside the Form)
 */
export function CourseSpecificSyllabus({ course, examName = "ACST" }) {
  const syllabus = getCourseSyllabus(course);
  if (!syllabus) return null;

  const sectionId = examName.toLowerCase() === "yksat" ? "yksat-syllabus" : "acst-syllabus";

  return (
    <article className="acst-course-syllabus-card" id={sectionId}>
      <div className="acst-card-heading">
        <span className="acst-heading-icon">
          <BookOpen size={20} />
        </span>
        <div>
          <div className="syllabus-headline-row">
            <span className="syllabus-class-tag">{syllabus.classLabel}</span>
            <span className="syllabus-stream-tag">{syllabus.streamLabel}</span>
          </div>
          <h3>{examName} Examination Syllabus</h3>
          <p>Official curriculum tested in {examName} for {syllabus.classLabel}.</p>
        </div>
      </div>

      <div className="course-specific-subjects">
        {syllabus.subjects.map((sub) => (
          <div className="course-subject-block" key={sub.name}>
            <div className="subject-title-line">
              <span className="subj-icon">{sub.icon}</span>
              <h4>{sub.name}</h4>
            </div>
            <ul className="subj-topic-items">
              {sub.topics.map((t, idx) => (
                <li key={idx}>
                  <Check size={13} className="topic-check-icon" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </article>
  );
}

/**
 * 2. Course-Specific Exam Pattern & Format Component
 * Placed in the Right Column below the Registration Form (filling the empty space)
 * With registration fee and exam timing REMOVED from important rules as instructed.
 */
export function CourseSpecificExamPattern({ course, examName = "ACST" }) {
  const pattern = getCourseExamPattern(course);
  if (!pattern) return null;

  const sectionId = examName.toLowerCase() === "yksat" ? "yksat-exam-pattern" : "acst-exam-pattern";

  return (
    <article className="acst-course-pattern-card" id={sectionId}>
      <div className="acst-card-heading">
        <span className="acst-heading-icon">
          <Layers size={20} />
        </span>
        <div>
          <span className="pattern-classes-tag">{pattern.classes}</span>
          <h3>{pattern.title}</h3>
          <p>Official question pattern and marking scheme for {examName}.</p>
        </div>
      </div>

      <div className="course-pattern-overview">
        <div className="pattern-total-card">
          <div className="pattern-total-main">
            <span className="pattern-total-num">{pattern.totalQuestions}</span>
            <span className="pattern-total-lbl">Total Questions</span>
          </div>
          <div className="pattern-duration-pill">
            <Clock size={14} /> Duration: <strong>{pattern.duration}</strong>
          </div>
        </div>

        <div className="pattern-breakdown-box">
          <span className="pattern-box-title">Subject-Wise Question Breakdown:</span>
          <div className="pattern-breakdown-list">
            {pattern.breakdown.map((row) => (
              <div className="pattern-breakdown-row" key={row.subject}>
                <span className="breakdown-subj">{row.subject}</span>
                <strong className="breakdown-qty">{row.questions} Questions</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Guidelines: Fee and Timing REMOVED as instructed */}
      <div className="acst-guidelines-box mini">
        <div className="guidelines-head">
          <AlertCircle size={16} className="text-warning" />
          <strong>Important Examination Rules:</strong>
        </div>

        <div className="guidelines-grid">
          <div className="guideline-item">
            <span className="guideline-title">📝 Question Format</span>
            <span className="guideline-desc">Objective Multiple Choice Questions (MCQs)</span>
          </div>

          <div className="guideline-item">
            <span className="guideline-title">⚖️ Marking Scheme</span>
            <span className="guideline-desc">
              <strong className="text-success">+4 marks</strong> for correct &bull;{" "}
              <strong className="text-danger">-1 mark</strong> for wrong (Negative Marking)
            </span>
          </div>

          <div className="guideline-item">
            <span className="guideline-title">📍 Mode of Exam</span>
            <span className="guideline-desc">Offline (Pen &amp; Paper / OMR Sheet)</span>
          </div>

          <div className="guideline-item">
            <span className="guideline-title">🪪 Mandatory Document</span>
            <span className="guideline-desc">Student School ID Card is strictly mandatory</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CourseSpecificSyllabus;
