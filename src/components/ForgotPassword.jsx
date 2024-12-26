import axios from "axios";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import Input from "./ui/Input";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/forgot-password`,
        { email }
      );
      if(response.data.success) {
        toast.success(response.data.message)
        setIsSubmitted(true)
      }
    } catch (error) {
      toast.error('something went wrong!')
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center min-w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Forgot Password
          </h2>
          {!isSubmitted ? (
            <form onSubmit={forgotPasswordHandler}>
              <p className="text-gray-300 mb-6 text-center">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                name="email"
                required
              />
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
                  "Send"
                )}
              </motion.button>
            </form>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-fit p-2 rounded-full mx-auto mb-4 bg-green-400 bg-opacity-50 backdrop-filter backdrop-blur-xl shadow-xl overflow-hidden"
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
              <p className="text-gray-300 mb-6">
                if an account exists for {email}, you will receive a password
                reset link shortly.
              </p>
            </div>
          )}
        </div>
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <Link className="text-green-400 text-sm flex items-center hover:underline" to={"/login"}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
