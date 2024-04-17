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
import NewCourseForm from "./components/NewCourseForm.jsx";
import TeacherSignupPage from "./pages/TeacherSignupPage";
import TeacherLoginPage from "./pages/TeacherLoginPage";
import CoursesPage from "./pages/CoursesPage";
import CoursePage from "./pages/CoursePage";

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

export default App;
