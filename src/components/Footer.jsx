import { Link } from "react-router-dom";
import {
    ArrowUpRight,
    MapPin,
    Phone,
    Mail,
} from "lucide-react";

function Brand() {
    return (
        <Link to="/" className="brand footer-brand">
            <img
                src="/logo.png"
                alt="Y.K. Classes — A Path to Success"
                className="brand-logo"
            />
        </Link>
    );
}

export default function Footer() {
    const handleBackToTop = (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        if (document.documentElement) {
            document.documentElement.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
        if (document.body) {
            document.body.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
    };

    return (
        <footer className="footer">
            <div className="container footer-grid">
                {/* Column 1: About */}
                <div className="footer-about">
                    <Brand />

                    <h3>Learn. Practice. Succeed.</h3>

                    <p>
                        Y.K. Classes is committed to helping students
                        learn with clarity, practise with confidence,
                        and work towards their academic goals.
                    </p>

                    <a href="/#contact" className="footer-cta">
                        Enquire Now <ArrowUpRight size={16} />
                    </a>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer-column">
                    <h3>Quick Links</h3>

                    <Link to="/">Home</Link>
                    <a href="/#about">About Us</a>
                    <Link to="/fees">ACST</Link>
                    <Link to="/yksat">YKSAT</Link>
                    <Link to="/reviews">Student Reviews</Link>
                    <a href="/#contact">Contact Us</a>
                </div>

                {/* Column 3: Contact */}
                <div className="footer-column footer-contact">
                    <h3>Contact Us</h3>

                    <a href="tel:9518641228">
                        <Phone size={17} />
                        <span>9518641228</span>
                    </a>

                    <a href="mailto:ykclassespalwal@gmail.com">
                        <Mail size={17} />
                        <span>ykclassespalwal@gmail.com</span>
                    </a>

                    <div className="footer-address">
                        <MapPin size={17} />
                        <span>
                            Opposite Indusind Bank, New Colony Road,
                            Agra Chowk, Palwal - 121102, Haryana
                        </span>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-inner">
                    <p>
                        © {new Date().getFullYear()} Y.K. Classes.
                        All rights reserved.
                    </p>

                    <a
                        href="#top"
                        onClick={handleBackToTop}
                        className="footer-back-to-top"
                        role="button"
                        aria-label="Back to top"
                    >
                        Back to top ↑
                    </a>
                </div>
            </div>
        </footer>
    );
}
