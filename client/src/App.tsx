import { useState } from "react";
import "./App.css";
import {
  useRegisterMutation,
  useLoginMutation,
  useGetWalletQuery,
} from "./app/api"; // Перевір імпорт!
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

interface NestErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

// 1. Виносимо компонент Dashboard назовні (Best Practice)
const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  // Хук викликається тут, бо компонент рендериться тільки коли є токен
  const { data: wallet, isLoading } = useGetWalletQuery(undefined);

  return (
    <div className="card" style={{ minWidth: "400px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Dashboard 📊</h2>
        <button
          onClick={onLogout}
          style={{
            width: "auto",
            padding: "8px 16px",
            fontSize: "0.8rem",
            backgroundColor: "#ef4444",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid #334155",
          textAlign: "left",
          marginBottom: "20px",
        }}
      >
        <p
          style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "5px" }}
        >
          Total Balance
        </p>
        {isLoading ? (
          // Переконайся, що в index.css є клас .pulse
          <div
            style={{
              height: "40px",
              background: "#334155",
              borderRadius: "4px",
              width: "150px",
            }}
            className="pulse"
          ></div>
        ) : (
          <h1 style={{ fontSize: "2.5rem", margin: 0, color: "#10b981" }}>
            $
            {Number(wallet?.balance || 0).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </h1>
        )}
      </div>

      <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
        Market functionality coming soon...
      </p>
    </div>
  );
};

// 2. Основний компонент App
function App() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [register, { isLoading: isRegLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined,
  ) => {
    if (!error) return "Unknown error";
    if ("data" in error) {
      const errorData = error.data as NestErrorResponse;
      if (Array.isArray(errorData.message)) return errorData.message.join(", ");
      return errorData.message;
    }
    if ("message" in error) return error.message;
    return "Unknown error";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isLoginMode) {
        const result = await login({ email, password }).unwrap();
        localStorage.setItem("token", result.access_token);
        setToken(result.access_token);
      } else {
        await register({ email, password }).unwrap();
        setSuccessMsg("Account created successfully! 🎉 Please log in.");
        setIsLoginMode(true);
      }
    } catch (err: any) {
      setErrorMsg(getErrorMessage(err));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setEmail("");
    setPassword("");
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  // 3. Єдиний правильний if (token)
  if (token) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // 4. Якщо токена немає — рендеримо форму входу
  return (
    <div className="card">
      <h2>{isLoginMode ? "Sign In" : "Sign Up"}</h2>

      {successMsg && <p className="success">{successMsg}</p>}

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={isLoginLoading || isRegLoading}>
          {isLoginMode
            ? isLoginLoading
              ? "Logging in..."
              : "Login"
            : isRegLoading
              ? "Creating..."
              : "Create Account"}
        </button>
      </form>

      {errorMsg && <p className="error">{errorMsg}</p>}

      <p style={{ marginTop: "1rem", color: "#9ca3af", fontSize: "0.9rem" }}>
        {isLoginMode ? "Don't have an account? " : "Already have an account? "}
        <span
          style={{
            color: "#3b82f6",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
        >
          {isLoginMode ? "Sign Up" : "Sign In"}
        </span>
      </p>
    </div>
  );
}

export default App;
