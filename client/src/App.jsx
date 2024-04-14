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
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/addNewCourse' element={<NewCourseForm />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/signup-teacher' element={<TeacherSignupPage />} />
          <Route path='/login-teacher' element={<TeacherLoginPage />} />
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
            path='/home'
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to='/login' />;
  }
  return children;
};

export default App;
