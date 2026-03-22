import { useEffect, useState } from "react";
import API from "../services/api";
import Container from "../components/container";

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    API.get("/assignments")
      .then((res) => setAssignments(res.data))
      .catch(() => alert("Error fetching assignments"));
  }, []);

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6">Assignments</h1>

      {role === "teacher" && (
        <p className="mb-4 text-green-600">You are a Teacher</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((a) => (
          <div
            key={a.id}
            className="bg-white shadow-md p-5 rounded-xl hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{a.title}</h2>
            <p className="text-gray-600 mt-2">{a.description}</p>

            <button className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded">
              View
            </button>
          </div>
        ))}
      </div>
    </Container>
  );
};

 

export default Dashboard;