import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Input from "./ui/Input";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Loader2, Lock, Mail, User } from "lucide-react";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch()
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value.trim() });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Sign up request
      const registerRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      // If signup is successful, auto-login
      if (registerRes.data.success) {
        toast.success(registerRes.data.message);
        alert(registerRes.data.verificationToken)
        alert(registerRes.data.user.verificationToken)
        navigate('/verify-auth')
        console.log("ye chala re", registerRes)
        dispatch(setAuthUser(registerRes.data.user))
      }
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message)
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center px-3 py-2 justify-center min-w-full">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          signup
        </h2>
        <form onSubmit={signupHandler}>
          <Input
            icon={User}
            type="text"
            placeholder="Username"
            value={input.username}
            onChange={changeEventHandler}
            name="username"
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={input.email}
            onChange={changeEventHandler}
            name="email"
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Passsword"
            value={input.password}
            onChange={changeEventHandler}
            name="password"
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <PasswordStrengthMeter password={input.password} />
          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-ofset-2 focus:ring-ofset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
                <Loader className="h-4 w-4 animate-spin text-center mx-auto" />
            ) : (
                "Sign up"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Aready have an account?{" "}
          <Link className="text-green-400 hover:underline" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </motion.div>
    </div>
  );
};

export default Signup;
