import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ROUTE_SEO = {
    "/": {
        title: "Y.K. Classes Palwal | Best IIT-JEE, NEET & Foundation Coaching Institute",
        description:
            "Y.K. Classes (YK Classes), Palwal — Premier coaching institute for IIT-JEE, NEET, Board Exams & Class 8th to 12th Foundation. Apply for ACST & YKSAT scholarship tests online.",
    },
    "/fees": {
        title: "ACST Scholarship & Course Fees | Y.K. Classes Palwal",
        description:
            "Explore Y.K. Classes Palwal fee plans, ACST Admission-Cum-Scholarship Test details, and classroom programs for Class 8–12, IIT-JEE & NEET.",
    },
    "/yksat": {
        title: "YKSAT Scholarship Exam | Y.K. Classes Palwal",
        description:
            "Register for YKSAT (Y.K. Classes Scholarship Admission Test) in Palwal. Win scholarships and rewards for IIT-JEE, NEET & Foundation batches.",
    },
    "/yksat/courses": {
        title: "YKSAT Courses & Batches | Y.K. Classes Palwal",
        description:
            "Browse all YKSAT eligible batches and classroom programs at Y.K. Classes, Palwal for Class 8th to 12th & Dropper JEE/NEET.",
    },
    "/reviews": {
        title: "Student Reviews & Results | Y.K. Classes Palwal",
        description:
            "Read verified student and parent reviews for Y.K. Classes Palwal — trusted coaching for IIT-JEE, NEET & Board preparation.",
    },
    "/careers": {
        title: "Faculty Careers & Teaching Jobs | Y.K. Classes Palwal",
        description:
            "Apply for teaching and academic faculty positions at Y.K. Classes, Palwal, Haryana for Physics, Chemistry, Mathematics & Biology.",
    },
};

export default function SiteLayout() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const targetId = hash.replace(/^#/, "");
            if (targetId === "home" || targetId === "top") {
                window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                return;
            }
            const timer = setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                }
            }, 60);
            return () => clearTimeout(timer);
        }

        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
    }, [pathname, hash]);

    useEffect(() => {
        const cleanPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
        const seo = ROUTE_SEO[cleanPath] || {
            title: "Courses & Admissions | Y.K. Classes Palwal",
            description:
                "Explore IIT-JEE, NEET & Foundation classroom courses, fee plans, and scholarship admissions at Y.K. Classes, Palwal, Haryana.",
        };

        document.title = seo.title;

        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.setAttribute("content", seo.description);

        const canonicalUrl = `https://ykclasses.in${cleanPath === "/" ? "/" : cleanPath}`;
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement("link");
            canonicalLink.setAttribute("rel", "canonical");
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute("href", canonicalUrl);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);
    }, [pathname]);

    return (
        <div className="site-layout">
            <Navbar />

            <main className="site-main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}