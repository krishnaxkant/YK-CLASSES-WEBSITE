import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function SiteLayout() {
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