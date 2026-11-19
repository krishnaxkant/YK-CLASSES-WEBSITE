import { useState, useRef } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  UploadCloud,
  Sparkles,
  User,
  Mail,
  Phone,
  X,
  GraduationCap,
  Award,
  Users
} from "lucide-react";
import "./Careers.css";

const BACKEND = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5001").replace(/\/$/, "");
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export default function Careers() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileSelection = (selectedFile) => {
    if (!selectedFile) return;
    setError("");
    const ext = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    const validExts = ["pdf", "doc", "docx"];
    if (!validExts.includes(ext)) {
      setError("Please choose a file with .pdf, .doc, or .docx extension.");
      return;
    }
    if (selectedFile.size > MAX_SIZE) {
      setError("Resume file size exceeds the 2 MB limit. Please compress or select a smaller file.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelection(dropped);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    setMessage("");

    try {
      if (!name.trim() || name.trim().length < 2) {
        throw new Error("Please enter your full name (minimum 2 characters).");
      }
      if (!subject.trim() || subject.trim().length < 2) {
        throw new Error("Please specify your subject expertise (e.g. Physics, Chemistry, Mathematics, etc.).");
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        throw new Error("Please enter a valid email address.");
      }
      const cleanPhone = phone.replace(/[^0-9+]/g, "");
      if (cleanPhone.length < 10) {
        throw new Error("Please enter a valid 10-digit mobile number.");
      }
      if (!file) {
        throw new Error("Please select or drop your resume file (.pdf, .doc, or .docx).");
      }
      if (file.size > MAX_SIZE) {
        throw new Error("Resume file size exceeds the 2 MB limit.");
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "";
      const validExts = ["pdf", "doc", "docx"];
      if (!validExts.includes(ext)) {
        throw new Error("Only PDF, DOC, and DOCX files are accepted.");
      }

      setBusy(true);

      const mimeMap = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      };
      const contentType = mimeMap[ext] || "application/octet-stream";

      const params = new URLSearchParams({
        name: name.trim(),
        subject: subject.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        fileName: file.name
      });

      const response = await fetch(`${BACKEND}/api/public/careers/resume?${params}`, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
          "X-File-Name": encodeURIComponent(file.name),
          "X-Subject": encodeURIComponent(subject.trim())
        },
        body: file
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || "Resume submission failed. Please try again.");
      }

      setMessage(result.message || "Your resume has been received. Y.K. Classes will review your profile and contact you soon.");
      setSubmittedData({
        name: name.trim(),
        subject: subject.trim(),
        email: email.trim(),
        phone: cleanPhone,
        fileName: file.name
      });
      setName("");
      setSubject("");
      setEmail("");
      setPhone("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      setError(e.message || "Could not upload your resume right now. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const resetForm = () => {
    setMessage("");
    setError("");
    setSubject("");
    setSubmittedData(null);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <main className="careers-page container section">
      {/* Hero Header */}
      <div className="careers-header">
        <div className="careers-badge">
          <Sparkles size={14} />
          <span>CAREERS &amp; FACULTY RECRUITMENT</span>
        </div>
        <h1 className="careers-title">
          Shape the Future with <span className="text-red">Y.K. Classes</span>
        </h1>
        <p className="careers-lead">
          We invite passionate educators, IIT-JEE / NEET subject experts, and academic mentors to join our vibrant team.
          Submit your resume and become part of Haryana&apos;s leading coaching institute.
        </p>
      </div>

      <div className="careers-layout">
        {/* Left Column: Why Join & Positions */}
        <section className="careers-info-card">
          <div className="careers-info-header">
            <div className="careers-info-icon">
              <Briefcase size={24} />
            </div>
            <div>
              <h2>Why Teach at Y.K. Classes?</h2>
              <p>Experience an inspiring academic environment built on excellence and student success.</p>
            </div>
          </div>

          <div className="careers-perks-grid">
            <div className="careers-perk-item">
              <div className="perk-bullet"><Award size={18} /></div>
              <div>
                <strong>Competitive Compensation</strong>
                <span>Industry-best compensation packages with merit-based performance bonuses.</span>
              </div>
            </div>

            <div className="careers-perk-item">
              <div className="perk-bullet"><GraduationCap size={18} /></div>
              <div>
                <strong>Academic Autonomy</strong>
                <span>Freedom to innovate pedagogy with smart digital boards and modern classroom tech.</span>
              </div>
            </div>

            <div className="careers-perk-item">
              <div className="perk-bullet"><Users size={18} /></div>
              <div>
                <strong>Culture of Mentorship</strong>
                <span>Collaborate with seasoned faculty and nurture top AIR rankers every year.</span>
              </div>
            </div>
          </div>

          <div className="careers-openings-box">
            <h3>Current High-Priority Openings</h3>
            <div className="openings-tags">
              <span className="opening-tag">JEE / NEET Physics Faculty</span>
              <span className="opening-tag">JEE / NEET Chemistry Faculty</span>
              <span className="opening-tag">JEE Advanced Mathematics Faculty</span>
              <span className="opening-tag">NEET Biology Faculty</span>
              <span className="opening-tag">Foundation Mentors (8th–10th)</span>
              <span className="opening-tag">Academic Counselors</span>
              <span className="opening-tag">Doubt-Solving Specialists</span>
            </div>
          </div>

          <div className="careers-privacy-note">
            <ShieldCheck size={18} />
            <span>
              <strong>100% Confidentiality Guaranteed:</strong> Your resume and personal contact details are stored securely
              and accessed exclusively by the Y.K. Classes academic leadership team.
            </span>
          </div>
        </section>

        {/* Right Column: Upload Form / Success State */}
        <section className="careers-form-container">
          {message ? (
            <div className="careers-success-card" role="status">
              <div className="success-icon-wrap">
                <CheckCircle2 size={42} />
              </div>
              <h2>Application Received!</h2>
              <p className="success-text">{message}</p>

              {submittedData && (
                <div className="success-summary-box">
                  <div className="summary-row">
                    <span className="label">Applicant:</span>
                    <span className="val">{submittedData.name}</span>
                  </div>
                  {submittedData.subject && (
                    <div className="summary-row">
                      <span className="label">Subject Expertise:</span>
                      <span className="val font-semibold">{submittedData.subject}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span className="label">File Attached:</span>
                    <span className="val font-mono">{submittedData.fileName}</span>
                  </div>
                  <div className="summary-row">
                    <span className="label">Contact Info:</span>
                    <span className="val">{submittedData.phone} · {submittedData.email}</span>
                  </div>
                </div>
              )}

              <p className="success-next-steps">
                Our recruitment panel typically reviews profiles within 2–3 business days. If shortlisted, you will receive an invitation for an academic discussion or teaching demo.
              </p>

              <button type="button" className="careers-reset-btn" onClick={resetForm}>
                Submit Another Application
              </button>
            </div>
          ) : (
            <form className="careers-form-card" onSubmit={submit} noValidate>
              <div className="form-head">
                <div className="form-head-title">
                  <h2>Submit Your Resume</h2>
                  <span className="form-pill">Direct Institute Review</span>
                </div>
                <p>Fill in your contact details and upload your updated CV / resume below.</p>
              </div>

              {error && (
                <div className="careers-error-alert" role="alert">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div className="careers-fields-grid">
                <label className="career-field">
                  <span className="field-label">
                    Full Name <span className="req">*</span>
                  </span>
                  <div className="field-input-wrap">
                    <User size={17} className="field-icon" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Sharma"
                      required
                      minLength={2}
                      maxLength={120}
                      disabled={busy}
                    />
                  </div>
                </label>

                <label className="career-field">
                  <span className="field-label">
                    Email Address <span className="req">*</span>
                  </span>
                  <div className="field-input-wrap">
                    <Mail size={17} className="field-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh.sharma@example.com"
                      required
                      maxLength={254}
                      disabled={busy}
                    />
                  </div>
                </label>

                <label className="career-field">
                  <span className="field-label">
                    Mobile / WhatsApp Number <span className="req">*</span>
                  </span>
                  <div className="field-input-wrap">
                    <Phone size={17} className="field-icon" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      required
                      minLength={10}
                      maxLength={20}
                      disabled={busy}
                    />
                  </div>
                </label>

                <label className="career-field">
                  <span className="field-label">
                    Expertise in Which Subject <span className="req">*</span>
                  </span>
                  <div className="field-input-wrap">
                    <BookOpen size={17} className="field-icon" />
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Physics (IIT-JEE / NEET), Mathematics, Chemistry, Biology, Foundation..."
                      required
                      minLength={2}
                      maxLength={150}
                      disabled={busy}
                    />
                  </div>
                </label>
              </div>

              {/* Drag and Drop Zone */}
              <div className="career-field">
                <span className="field-label">
                  Resume Document (.pdf, .doc, .docx) <span className="req">*</span>
                </span>

                <div
                  className={`careers-dropzone ${dragOver ? "drag-over" : ""} ${file ? "has-file" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !file && fileInputRef.current?.click()}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !file) {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  role="button"
                  aria-label="Upload resume file"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileSelection(e.target.files?.[0])}
                    disabled={busy}
                  />

                  {file ? (
                    <div className="selected-file-display" onClick={(e) => e.stopPropagation()}>
                      <div className="file-display-main">
                        <div className="file-type-icon">
                          <FileText size={28} />
                        </div>
                        <div className="file-info-text">
                          <strong className="file-name">{file.name}</strong>
                          <span className="file-meta">
                            {(file.size / 1024).toFixed(1)} KB · Ready to upload
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        title="Remove file"
                        disabled={busy}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="dropzone-idle">
                      <div className="dropzone-icon">
                        <UploadCloud size={32} />
                      </div>
                      <div className="dropzone-text">
                        <strong>Click to browse or drag &amp; drop your resume</strong>
                        <span>Supports PDF, DOC, or DOCX formats (Up to 2 MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="careers-submit-btn" disabled={busy}>
                {busy ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Uploading Your Resume…</span>
                  </>
                ) : (
                  <>
                    <span>Submit Resume</span>
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>

              <div className="form-footer-assurance">
                <ShieldCheck size={14} />
                <span>Submitted documents are kept confidential and stored securely in our private recruitment repository.</span>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}