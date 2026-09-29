import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Careers from "./pages/Careers";
import Projects from "./pages/Projects";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import ContactMessages from "./pages/ContactMessages";
import AdminLayout from "./components/AdminLayout";
import { api } from "./lib/api";

function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!api.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter basename="/admin">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/content" replace />} />
          <Route path="/content" element={<Dashboard />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/messages" element={<ContactMessages />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
