// src/App.tsx
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "prismjs/themes/prism-okaidia.css";
import ProblemEditorPage from "./features/problem/ProblemEditorPage";
import RoadmapPage from "./features/roadmap/RoadmapPage";

function App() {
  
  return (
    <BrowserRouter>
    {/* The main container can still provide global styling if needed */}
    <div className="min-h-screen bg-slate-900 font-sans text-slate-300 flex flex-col">
      <Routes>
        {/* Redirects the base path "/" to "/roadmap" */}
        <Route path="/" element={<Navigate to="/roadmap" replace />} />

        {/* Route for the roadmap overview page */}
        <Route path="/roadmap" element={<RoadmapPage />} />

        {/* Route for the dedicated problem editor page */}
        {/* :problemId will be the unique identifier for the LeetCode problem */}
        <Route path="/problem/:problemId" element={<ProblemEditorPage />} />

        {/* Optional: A catch-all route for 404 Not Found pages */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
