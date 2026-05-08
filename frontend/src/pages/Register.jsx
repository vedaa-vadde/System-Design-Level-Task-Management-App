import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleRegister(e) {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem(
      "registeredUser",
      JSON.stringify({ name, email, password })
    );

    alert("Registered successfully");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-slate-800 text-center">
          Create Account
        </h1>

        <p className="text-slate-500 text-center mt-2 mb-8">
          Start managing your tasks better
        </p>

        <form onSubmit={handleRegister}>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter name"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-5 outline-none focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-5 outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 mb-6 outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        <p className="text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;