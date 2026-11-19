import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function Brand() {
    return (
        <Link to="/" className="brand" aria-label="Y.K. Classes Home">
            <img
                src="/logo.png"
                alt="Y.K. Classes — A Path to Success"
                className="brand-logo"
            />
        </Link>
    );
}

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        ["Home", "/#home", "anchor"],
        ["About", "/#about", "anchor"],
        ["Contact Us", "/#contact", "anchor"],
        ["Student Reviews", "/reviews", "route"],
        ["ACST", "/fees", "route"],
        ["YKSAT", "/yksat", "route"],
        ["Careers", "/careers", "route"],
    ];

    return (
        <>
            <div className="top-line" />

            <header className="site-header">
                <nav className="container navbar">
                    <Brand />

                    <button
                        className="menu-toggle"
                        type="button"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={23} /> : <Menu size={23} />}
                    </button>

                    <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
                        {links.map(([label, href, type]) =>
                            type === "route" ? (
                                <Link
                                    key={label}
                                    to={href}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <a
                                    key={label}
                                    href={href}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {label}
                                </a>
                            )
                        )}

                        <a
                            className="button button-red nav-cta"
                            href="/#contact"
                            onClick={() => setMenuOpen(false)}
                        >
                            Enquire Now <ArrowUpRight size={16} />
                        </a>
                    </div>
                </nav>
            </header>
        </>
    );
}
