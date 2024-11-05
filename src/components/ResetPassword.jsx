import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Lock } from "lucide-react";
import Input from "./ui/input";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { token } = useParams();
  const navigate = useNavigate()

  const changePasswordHandler = async(e) => {
    e.preventDefault();
    setLoading(true)
    if(password !== confirmPassword) {
        console.log(password, confirmPassword)
        setError("Password doesn't match!")
        setLoading(false)
        return
    }
    console.log(token)
    try {
        const response = await axios.post(`https://quickflick-server.onrender.com/api/v1/user/reset-password/${token}`, {password})
        if(response.data.success){
            toast.success(response.data.message);
            navigate("/login")
        }
    } catch (error) {
        console.log(error)
        setError(error.response.data.message)
    }
    finally {
        setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center min-w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Forgot Password
          </h2>
          <form onSubmit={changePasswordHandler}>
            <Input
              icon={Lock}
              type="password"
              placeholder="Passsword"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              name="password"
            />
            <Input
              icon={Lock}
              type="New Password"
              placeholder="Confirm New Passsword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value.trim())}
              name="password"
            />
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
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
                "Change Password"
            )}
          </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
