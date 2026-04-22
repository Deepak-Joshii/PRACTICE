import { useEffect, useState } from "react";
import { axiosInstance } from "./api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/");

    axiosInstance.get("/dashboard", {
      headers: { Authorization: token }
    })
    .then(res => {
      setUser(res.data);
      setCourse(res.data.course);
    })
    .catch(() => navigate("/"));
  }, []);

  const updateCourse = async () => {
    try {
      await axiosInstance.put("/update-course", { course }, {
        headers: { Authorization: token }
      });
      alert("Course updated");
    } catch {
      alert("Failed");
    }
  };

  const updatePassword = async () => {
    try {
      await axiosInstance.put("/update-password", passwordData, {
        headers: { Authorization: token }
      });
      alert("Password updated");
    } catch {
      alert("Wrong password");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">
      
      {/* 🔹 Navbar */}
      <div className="navbar">
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      {/* 🔹 Grid */}
      <div className="grid">

        {/* Profile Card */}
        <div className="card">
          <h3>Profile</h3>
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Course:</b> {user.course}</p>
        </div>

        {/* Course Card */}
        <div className="card">
          <h3>Update Course</h3>
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <button onClick={updateCourse}>Save Changes</button>
        </div>

        {/* Password Card */}
        <div className="card">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Old Password"
            onChange={(e) =>
              setPasswordData({ ...passwordData, oldPassword: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
          />
          <button onClick={updatePassword}>Update</button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;