import { useState } from "react";
import API from "../services/api";
import Container from "../components/container";

const CreateAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const role = localStorage.getItem("role");

  if (role !== "teacher") {
    return <p className="text-center mt-10">Access Denied</p>;
  }

  const handleSubmit = async () => {
    await API.post("/assignments", { title, description });
    alert("Created!");
  };

  return (
    <Container>
      <h1 className="text-xl mb-4">Create Assignment</h1>

      <input
        placeholder="Title"
        className="border p-2 w-full mb-3"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-3"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </Container>
  );
};

export default CreateAssignment;