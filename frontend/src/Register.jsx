import { useState } from "react";
import { axiosInstance } from "./api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/register", form);
      alert("Registered Successfully");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input type="password" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input placeholder="Course"
        onChange={(e) => setForm({ ...form, course: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;