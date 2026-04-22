import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Home() {
  const [active, setActive] = useState("login");

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Student Portal</h2>

        {/* 🔹 Tabs */}
        <div className="tabs">
          <div
            className={active === "login" ? "tab active" : "tab"}
            onClick={() => setActive("login")}
          >
            Login
          </div>

          <div
            className={active === "register" ? "tab active" : "tab"}
            onClick={() => setActive("register")}
          >
            Register
          </div>
        </div>

        {/* 🔹 Form */}
        <div className="form-box">
          {active === "login" && <Login />}
          {active === "register" && <Register />}
        </div>
      </div>
    </div>
  );
}

export default Home;