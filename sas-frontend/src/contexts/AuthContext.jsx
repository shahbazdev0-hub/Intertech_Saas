import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialToken = localStorage.getItem("token");
  const initialUser = localStorage.getItem("user");
  const initialState = {
    user: initialUser ? JSON.parse(initialUser) : null,
    token: initialToken || null,
  };

  const [authState, setAuthState] = useState(initialState);
  const [loading, setLoading] = useState(!initialToken && !initialUser);

  useEffect(() => {
    if (initialToken && initialUser) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (user, token) => {
    setAuthState({ user, token });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        token: authState.token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
