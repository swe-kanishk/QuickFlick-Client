import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Input from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Loader, Loader2, Lock, Mail } from "lucide-react";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value.trim() });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if(!input.email || !input.password) {
      setError("All fields are required!")
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "https://quickflick-server.onrender.com/api/v1/user/login",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setInput(input.email = "", input.password = "")
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setInput({ email: "", password: "" });
        navigate("/"); // Redirect after setting the user in Redux
      }
    } catch (error) {
      setError(error.response.data.message)
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center min-w-full">

    <motion.div
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y:0}}
        transition={{duration: 0.5}}
        className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
    <div className="p-8">
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
            Welcome Back
        </h2>
        <form onSubmit={loginHandler}>
            <Input icon={Mail} type="email" placeholder="Email Address" value={input.email} onChange={changeEventHandler} name="email" required />
            <Input icon={Lock} type="password" placeholder="Passsword" value={input.password} onChange={changeEventHandler} name="password" required />
            <Link to={'/forgot-password'} className="text-blue-500 hover:underline">forgot password?</Link>
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
            <motion.button
                className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-ofset-2 focus:ring-ofset-gray-900 text-center transition duration-200'
                whileHover={{scale: 1.02}}
                whileTap={{scale: 0.98}}
                type='submit'
                disabled={loading}
            >
                {loading ? <Loader className='w-6 h-6 mx-auto text-center animate-spin' /> : "Login"}
            </motion.button>
        </form>
    </div>
    <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-400'>Don't have an account?{" "}<Link className='text-green-400 hover:underline' to={"/signup"}>Sign up</Link></p>
      </div>
    </motion.div>
    </div>
  )
};

export default Login;