
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";
import "./AcstResults.css";

const BACKEND_BASE_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"
).replace(/\/$/, "");

function formatExamDate(value) {
  if (!value) return "Date to be announced";

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
      }).format(date);
}

function formatRupees(paise) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(paise || 0) / 100);
}

function formatBatchType(value) {
  if (value === "regular") return "Regular Batch";
  if (value === "weekend") return "Weekend Batch";

  return value || "Course Fee";
}

export default function AcstResults() {
  const { sessionId } = useParams();

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/public/acst-results/sessions`,
        {
          headers: { Accept: "application/json" },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.message || "ACST result links could not be loaded."
        );
      }

      const rows = data.sessions || [];

      setSessions(rows);
      setSelectedSession(
        rows.find((item) => item.id === sessionId) || null
      );
    } catch (loadError) {
      setError(
        loadError.message || "ACST results are temporarily unavailable."
      );
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const checkResult = async (event) => {
    event.preventDefault();

    if (!sessionId || !applicationNumber.trim() || !dateOfBirth) {
      setError("Enter your application number and date of birth.");
      return;
    }

    setChecking(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/api/public/acst-results/${sessionId}/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            applicationNumber: applicationNumber.trim(),
            dateOfBirth,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.status === 429) {
        throw new Error(
          data.message ||
            "Too many attempts. Please try again after one minute."
        );
      }

      if (!response.ok && data.status !== "not_found") {
        throw new Error(
          data.message || "Unable to check this ACST result right now."
        );
      }

      setResult(data);
    } catch (lookupError) {
      setError(
        lookupError.message || "Unable to check this ACST result right now."
      );
    } finally {
      setChecking(false);
    }
  };

  const resultData = result?.result;
  const feeOptions = Array.isArray(resultData?.feeOptions)
    ? resultData.feeOptions
    : [];

  const isBelow80 =
    resultData && Number(resultData.percentage) < 80;

  const statusMessages = {
    not_found: "Sorry, details not found.",
    wrong_phase:
      "Sorry, your result for this particular date of ACST is not found. You may have selected the wrong ACST Phase link.",
    unavailable:
      "Your result has not been published yet. Please check again later.",
  };

  if (loading) {
    return (
      <main className="acst-results-page">
        <div className="acst-results-loading">
          <span className="acst-results-spinner" />
          Loading ACST result links...
        </div>
      </main>
    );
  }

  return (
    <main className="acst-results-page">
      <section className="acst-results-hero">
        <div className="acst-results-hero-icon">
          <Award size={26} />
        </div>

        <span className="acst-results-eyebrow">
          Y.K. CLASSES · EXAMINATION
        </span>

        <h1>ACST Results</h1>

        <p>
          Find your result using your application number and date of birth.
        </p>
      </section>

      {!sessionId ? (
        <section className="acst-result-links-card">
          <div className="acst-results-card-heading">
            <div>
              <span className="acst-results-eyebrow">
                PUBLISHED EXAM SESSIONS
              </span>

              <h2>Select your ACST phase</h2>

              <p>
                Choose the link matching the date on which you appeared for
                ACST.
              </p>
            </div>

            <CalendarDays size={24} />
          </div>

          {error ? (
            <div className="acst-results-error">{error}</div>
          ) : null}

          {sessions.length ? (
            <div className="acst-result-session-grid">
              {sessions.map((item, index) => (
                <Link
                  className="acst-result-session-link"
                  to={`/acst-results/${item.id}`}
                  key={item.id}
                >
                  <span className="acst-result-phase">
                    ACST Phase {item.phaseNumber || index + 1}
                  </span>

                  <strong>
                    {item.sessionName ||
                      `ACST Session ${sessions.length - index}`}
                  </strong>

                  <span className="acst-result-exam-date">
                    <CalendarDays size={15} />
                    Date of Exam: {formatExamDate(item.examDate)}
                  </span>

                  <span className="acst-result-open-link">
                    Check Result <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="acst-results-empty">
              <Clock3 size={22} />
              <strong>No results published yet</strong>
              <span>Published ACST exam phases will appear here.</span>
            </div>
          )}
        </section>
      ) : (
        <section className="acst-result-lookup-card">
          <Link to="/acst-results" className="acst-results-back">
            <ArrowLeft size={16} />
            All ACST result phases
          </Link>

          {selectedSession ? (
            <div className="acst-selected-phase">
              <span className="acst-results-eyebrow">
                SELECTED ACST PHASE
              </span>

              <h2>{selectedSession.sessionName}</h2>

              <p>
                <CalendarDays size={16} />
                Date of Exam: {formatExamDate(selectedSession.examDate)}
              </p>
            </div>
          ) : (
            <div className="acst-results-error">
              This ACST result link is not available. Please select a
              published exam date.
            </div>
          )}

          <form className="acst-result-form" onSubmit={checkResult}>
            <label>
              Application Number

              <input
                value={applicationNumber}
                onChange={(event) =>
                  setApplicationNumber(event.target.value.toUpperCase())
                }
                placeholder="e.g. ACST26-XXXXXXXXXXXX"
                autoComplete="off"
                required
              />
            </label>

            <label>
              Date of Birth

              <input
                type="date"
                value={dateOfBirth}
                onChange={(event) => setDateOfBirth(event.target.value)}
                required
              />
            </label>

            <button type="submit" disabled={checking || !selectedSession}>
              <Search size={17} />
              {checking ? "Checking result..." : "Check Result"}
            </button>

            <small>
              <ShieldCheck size={14} />
              Your result is protected. Application number and date of birth
              are verified together.
            </small>
          </form>

          {error ? (
            <div className="acst-results-error">{error}</div>
          ) : null}

          {result && result.status !== "found" ? (
            <div
              className={`acst-result-status acst-result-status-${
                result.status || "unavailable"
              }`}
            >
              {statusMessages[result.status] ||
                result.message ||
                "Unable to find this result."}
            </div>
          ) : null}

          {resultData ? (
            <article className="acst-result-output">
              <div className="acst-result-output-header">
                <CheckCircle2 size={23} />

                <div>
                  <span>RESULT PUBLISHED</span>
                  <h2>{resultData.fullName}</h2>
                  <p>{resultData.applicationNumber}</p>
                </div>
              </div>

              <div className="acst-result-student-meta">
                <span>{resultData.className || resultData.classCode}</span>
                <span>{resultData.courseName || "ACST"}</span>
                <span>{formatExamDate(resultData.examDate)}</span>
              </div>

              <div className="acst-result-score-grid">
                <div>
                  <small>Marks Obtained</small>
                  <strong>{resultData.marksObtained}</strong>
                  <span>out of {resultData.totalMarks}</span>
                </div>

                <div>
                  <small>Percentage</small>
                  <strong>
                    {Number(resultData.percentage || 0).toFixed(2)}%
                  </strong>
                  <span>ACST score</span>
                </div>
              </div>

              {resultData.scholarshipDiscountPercentage != null ? (
                <div className="acst-result-scholarship">
                  Scholarship discount:
                  <strong>
                    {" "}
                    {Number(
                      resultData.scholarshipDiscountPercentage
                    ).toFixed(2)}
                    %
                  </strong>
                </div>
              ) : null}

              {isBelow80 ? (
                <section className="acst-result-encouragement">
                  <div className="acst-result-encouragement-icon">
                    <Award size={23} />
                  </div>

                  <div className="acst-result-encouragement-copy">
                    <span>YOUR JOURNEY DOESN'T STOP HERE</span>

                    <h3>Keep learning. Keep believing in yourself!</h3>

                    <p>
                      Your ACST score is only one step in your learning
                      journey. Keep your confidence high—steady practice
                      and the right guidance can help you improve.
                      The Y.K. Classes team is always here to support you.
                      Reach out to us and we'll help you plan your next
                      steps.
                    </p>

                    <div className="acst-result-support-actions">
                      <a href="/#contact">
                        Contact Us <ArrowUpRight size={16} />
                      </a>

                      <a href="tel:9518641228">
                        <Phone size={16} /> Call Us
                      </a>

                      <a href="mailto:ykclassespalwal@gmail.com">
                        <Mail size={16} /> Email Us
                      </a>
                    </div>
                  </div>
                </section>
              ) : null}

              <section className="acst-result-fees">
                <div className="acst-result-fees-heading">
                  <span>YOUR SCHOLARSHIP BENEFIT</span>
                  <h3>Course Fee Breakdown</h3>
                  <p>
                    Fees for {resultData.courseName || "your selected course"}
                    {" "}based on the applicable academic year.
                  </p>
                </div>

                {feeOptions.length > 0 ? (
                  <div className="acst-result-fee-options">
                    {feeOptions.map((fee) => (
                      <article
                        className="acst-result-fee-option"
                        key={fee.batchType}
                      >
                        <h4>{formatBatchType(fee.batchType)}</h4>

                        <div className="acst-result-fee-row">
                          <span>Original tuition fee</span>
                          <strong>
                            {formatRupees(fee.baseTuitionPaise)}
                          </strong>
                        </div>

                        <div className="acst-result-fee-row acst-result-fee-discount">
                          <span>
                            ACST scholarship (
                            {Number(fee.discountPercentage).toFixed(2)}%)
                          </span>

                          <strong>
                            −{formatRupees(fee.discountAmountPaise)}
                          </strong>
                        </div>

                        <div className="acst-result-fee-row acst-result-fee-final">
                          <span>Tuition fee after scholarship</span>
                          <strong>
                            {formatRupees(fee.finalTuitionPaise)}
                          </strong>
                        </div>

                        <div className="acst-result-fee-row">
                          <span>Registration fee</span>
                          <strong>
                            {formatRupees(fee.registrationFeePaise)}
                          </strong>
                        </div>

                        <div className="acst-result-fee-total">
                          <span>Total course fee</span>
                          <strong>
                            {formatRupees(fee.totalPayablePaise)}
                          </strong>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="acst-result-fees-unavailable">
                    Course fee details are not available right now.
                    Please contact our team for the applicable fee details.
                    <a href="/#contact">Contact Y.K. Classes</a>
                  </div>
                )}

                <p className="acst-result-fees-note">
                  Scholarship discount applies to tuition fees only.
                  Registration fee is not discounted. Final batch selection
                  and applicable fee plan will be confirmed during admission.
                </p>
              </section>
            </article>
          ) : null}
        </section>
      )}
    </main>
  );
}
