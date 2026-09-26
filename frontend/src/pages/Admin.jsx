import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout.jsx";
import AdminLogin from "../components/Admin/AdminLogin.jsx";
import AdminDashboard from "../components/Admin/AdminDashboard.jsx";
import AdminMessages from "../components/Admin/AdminMessages.jsx";
import AdminProjects from "../components/Admin/AdminProjects.jsx";
import AdminSkills from "../components/Admin/AdminSkills.jsx";

/**
 * Everything under /admin, mounted by App.jsx at `path="/admin/*"`.
 *
 * The login route sits outside AdminLayout (it *is* the unauthenticated
 * screen); every other route renders inside the layout's <Outlet />, which
 * redirects to /admin/login whenever no admin token is present.
 */
export default function Admin() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}