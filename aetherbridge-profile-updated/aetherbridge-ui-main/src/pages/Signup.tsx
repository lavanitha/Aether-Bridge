import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signup(email, password);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign up");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2d014d]">
      <form onSubmit={handleSubmit} className="bg-[#3d0066] p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Sign Up</h2>
        {error && <div className="mb-4 text-red-400">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-white">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded bg-[#2d014d] text-white placeholder-gray-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium text-white">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded bg-[#2d014d] text-white placeholder-gray-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="mt-4 text-center">
          <span className="text-white">Already have an account? </span><Link to="/login" className="text-blue-300 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
} 