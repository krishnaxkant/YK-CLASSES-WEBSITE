// Sample course and fee data for the Y.K. Classes Admission page.
// All prices below are illustrative placeholders and must be approved before publication.

export const courses = [
  {
    slug: "class-8-foundation",
    className: "Class 8th",
    program: "Foundation",
    category: "FOUNDATION",
    description:
      "Build strong academic fundamentals with clear concepts, guided practice and consistent learning habits.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 500,
    tuitionFee: 24000,
    installments: [8000, 8000, 8000],
  },
  {
    slug: "class-9-foundation",
    className: "Class 9th",
    program: "Foundation",
    category: "FOUNDATION",
    description:
      "Strengthen core concepts and develop the problem-solving skills needed for higher classes.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 500,
    tuitionFee: 27000,
    installments: [9000, 9000, 9000],
  },
  {
    slug: "class-10-foundation-boards",
    className: "Class 10th",
    program: "Foundation + Boards",
    category: "FOUNDATION & BOARDS",
    description:
      "Balance board-exam preparation with a stronger conceptual foundation for future competitive exams.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 750,
    tuitionFee: 30000,
    installments: [10000, 10000, 10000],
  },
  {
    slug: "class-11-jee",
    className: "Class 11th",
    program: "JEE Preparation",
    category: "ENGINEERING",
    description:
      "Prepare for JEE with structured Physics, Chemistry and Mathematics learning, practice and revision.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 1000,
    tuitionFee: 45000,
    installments: [15000, 15000, 15000],
  },
  {
    slug: "class-11-neet",
    className: "Class 11th",
    program: "NEET Preparation",
    category: "MEDICAL",
    description:
      "Build a strong base in Biology, Physics and Chemistry for focused NEET preparation.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 1000,
    tuitionFee: 42000,
    installments: [14000, 14000, 14000],
  },
  {
    slug: "class-12-jee",
    className: "Class 12th",
    program: "JEE + Boards",
    category: "ENGINEERING",
    description:
      "Combine Class 12 board preparation with focused JEE problem-solving and exam practice.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 1000,
    tuitionFee: 48000,
    installments: [16000, 16000, 16000],
  },
  {
    slug: "class-12-neet",
    className: "Class 12th",
    program: "NEET + Boards",
    category: "MEDICAL",
    description:
      "Prepare for board examinations alongside advanced Biology, Physics and Chemistry practice for NEET.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 1000,
    tuitionFee: 45000,
    installments: [15000, 15000, 15000],
  },
  {
    slug: "dropper-neet",
    className: "Dropper",
    program: "NEET Preparation",
    category: "MEDICAL",
    description:
      "Follow a focused revision and practice plan with subject-wise preparation for the NEET examination.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 1500,
    tuitionFee: 54000,
    installments: [18000, 18000, 18000],
  },
  {
    slug: "dropper-jee",
    className: "Dropper",
    program: "JEE Preparation",
    category: "ENGINEERING",
    description:
      "Revise key concepts, improve problem-solving speed and practise with a structured JEE preparation plan.",
    batchStartDate: "To be announced",
    admissionRegistrationFee: 1500,
    tuitionFee: 54000,
    installments: [18000, 18000, 18000],
  },
];

export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}
