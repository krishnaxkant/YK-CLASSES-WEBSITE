import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import SiteLayout from "./components/SiteLayout";
import Home from "./Home";
import Fees from "./pages/Fees";
import CourseDetails from "./pages/CourseDetails";
import Reviews from "./pages/Reviews";
import YKSAT from "./pages/YKSAT";
import YksatCourses from "./pages/YksatCourses";
import YksatCourseDetails from "./pages/YksatCourseDetails";
import Careers from "./pages/Careers";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/admission/:courseSlug" element={<CourseDetails />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/yksat" element={<YKSAT />} />
          <Route path="/yksat/courses" element={<YksatCourses />} />
          <Route path="/yksat/admission/:courseSlug" element={<YksatCourseDetails />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/acst-results" element={<Navigate to="/" replace />} />
          <Route path="/acst-results/:sessionId" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
