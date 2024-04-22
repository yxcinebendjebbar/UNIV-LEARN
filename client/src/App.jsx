import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NewCourseForm from "./components/NewCourseForm.jsx";
import TeacherSignupPage from "./pages/TeacherSignupPage";
import TeacherLoginPage from "./pages/TeacherLoginPage";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";
import ForumsPage from "./pages/ForumsPage";
import Replies from "./pages/Replies";
import AdminPanelPage from "./pages/AdminPanelPage";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminCoursesPage from "./pages/AdminCoursesPage.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/signup-teacher' element={<TeacherSignupPage />} />
          <Route path='/login-teacher' element={<TeacherLoginPage />} />
          <Route path='/aplogin' element={<AdminLoginPage />} />
          <Route
            path='/ap'
            element={
              <AdminAccessRoute>
                <AdminPanelPage />
              </AdminAccessRoute>
            }
          />
          <Route
            path='/ap/users'
            element={
              <AdminAccessRoute>
                <AdminUsersPage />
              </AdminAccessRoute>
            }
          />
          <Route
            path='/ap/courses'
            element={
              <AdminAccessRoute>
                <AdminCoursesPage />
              </AdminAccessRoute>
            }
          />
          <Route
            path='/dashboard'
            element={
              <HeavilyProtectedRoute>
                <Dashboard />
              </HeavilyProtectedRoute>
            }
          />
          <Route
            path='/new-course'
            element={
              <HeavilyProtectedRoute>
                <NewCourseForm />
              </HeavilyProtectedRoute>
            }
          />
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/courses'
            element={
              <ProtectedRoute>
                <CoursesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/courses/:id'
            element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forums'
            element={
              <ProtectedRoute>
                <ForumsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/replies/:id'
            element={
              <ProtectedRoute>
                <Replies />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    alert("You need to login first!");
    return <Navigate to='/login' />;
  }
  return children;
};

const HeavilyProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== "teacher") {
    alert("You are not authorized to access this page");
    return <Navigate to='/login-teacher' />;
  }
  return children;
};

const AdminAccessRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== "admin") {
    alert("You are not authorized to access this page");
    return <Navigate to='/aplogin' />;
  }
  return children;
};

export default App;
