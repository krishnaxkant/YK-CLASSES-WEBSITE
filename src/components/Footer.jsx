import { Link } from "react-router-dom";
import {
    ArrowUpRight,
    MapPin,
    Phone,
    Mail,
} from "lucide-react";

function Brand({ onNavigateTop }) {
    return (
        <Link to="/" className="brand footer-brand" onClick={onNavigateTop}>
            <img
                src="/logo.png"
                alt="Y.K. Classes — A Path to Success"
                className="brand-logo"
            />
        </Link>
    );
}

export default function Footer() {
    const scrollToPageTop = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
    };

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
                    <Brand onNavigateTop={scrollToPageTop} />

                    <h3>Learn. Practice. Succeed.</h3>

                    <p>
                        Y.K. Classes is committed to helping students
                        learn with clarity, practise with confidence,
                        and work towards their academic goals.
                    </p>

                    <Link to="/#contact" className="footer-cta">
                        Enquire Now <ArrowUpRight size={16} />
                    </Link>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer-column">
                    <h3>Quick Links</h3>

                    <Link to="/" onClick={scrollToPageTop}>Home</Link>
                    <Link to="/#about">About Us</Link>
                    <Link to="/fees" onClick={scrollToPageTop}>ACST</Link>
                    <Link to="/yksat" onClick={scrollToPageTop}>YKSAT</Link>
                    <Link to="/reviews" onClick={scrollToPageTop}>Student Reviews</Link>
                    <Link to="/#contact">Contact Us</Link>
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
