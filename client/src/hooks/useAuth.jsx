import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStorage } from "./useSessionStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useSessionStorage("user", null);
  const navigate = useNavigate();

  // for updating user settings

  const updateUser = async (data) => {
    setUser(data);
  };

  // call this function when you want to authenticate the user
  const login = async (data) => {
    setUser(data);
    navigate("/home");
  };

  const loginAdmin = async (data) => {
    setUser(data);
    navigate("/ap");
  };
  const logoutAdmin = async () => {
    setUser(null);
    navigate("/aplogin", { replace: true });
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      loginAdmin,
      logoutAdmin,
      logout,
      updateUser,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
