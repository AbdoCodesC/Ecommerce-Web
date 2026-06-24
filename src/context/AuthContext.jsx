import { createContext, useState } from "react";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("currentUserEmail")
      ? { email: localStorage.getItem("currentUserEmail") }
      : null,
  );

  function signup(email, password) {
    console.log("signup called with email:", email, "and password:", password);
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users && users.find((user) => user.email === email)) {
      return { success: false, message: "User already exists" };
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);

    setUser({ email });

    return { success: true };
  }

  function login(email, password) {
    const users = JSON.parse(localStorage.getItem("users"));
    if (users && users.find((user) => user.email === email && user.password === password)) {
      localStorage.setItem("currentUserEmail", email);
      setUser({ email });
      return { success: true };
    } else {
      return { success: false, message: "Invalid email or password" };
    }
  }

  function logout() {
    localStorage.removeItem("currentUserEmail");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signup, user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}
