import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { setAuthUser, setIsOtpExpired } from "@/redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import CountdownTimer from "./CountdownTimer";

function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useMemo(
    () => Array.from({ length: 6 }, () => React.createRef()),
    []
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isOtpExpired } = useSelector((store) => store.auth);

  const handleChange = useCallback(
    (index, value) => {
      setCode((prevCode) => {
        const newCode = [...prevCode];

        if (value.length > 1) {
          const pastedCode = value.slice(0, 6).split("");
          pastedCode.forEach((char, i) => (newCode[i] = char || ""));

          const lastFilledIndex = newCode.findLastIndex(
            (digit) => digit !== ""
          );
          const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
          inputRefs[focusIndex]?.current?.focus();
        } else {
          newCode[index] = value;
          if (value && index < 5) {
            inputRefs[index + 1]?.current?.focus();
          }
        }
        return newCode;
      });
    },
    [inputRefs]
  );

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        inputRefs[index - 1]?.current?.focus();
      }
    },
    [code, inputRefs]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const verificationCode = code.join("");
      try {
        const response = await axios.post(
          `https://quickflick-server.onrender.com/api/v1/user/verify-email`,
          { code: verificationCode }
        );
        toast.success("Email verified successfully");
        dispatch(setAuthUser(response.data.user));
        navigate("/");
      } catch (error) {
        setError(error?.response?.data?.message || "Verification failed");
      } finally {
        setIsLoading(false);
      }
    },
    [code, navigate]
  );

  const handleResendOTP = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.get(`https://quickflick-server.onrender.com/api/v1/user/resend-otp`, { withCredentials: true });
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setIsOtpExpired(false));
        dispatch(setAuthUser(response.data.user));
      }
    } catch (error) {
      setError("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);
  

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center min-w-full">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-800 p-8 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Verify Your Email
          </h2>
          <p className="text-center mb-6 text-gray-300">
            Enter the 6-digit code sent to your email address.
          </p>
          <form
            onSubmit={isOtpExpired ? handleResendOTP : handleSubmit}
            className="space-y-6"
          >
            {!isOtpExpired && (
              <div className="flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                ))}
                {error && (
                  <p className="text-red-500 font-semibold mt-2">{error}</p>
                )}
              </div>
            )}

            <CountdownTimer deadline={user.verificationTokenExpiresAt} />
            {isOtpExpired ? (
              <motion.button
                className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 mx-auto animate-spin" />
                ) : (
                  "Resend OTP"
                )}
              </motion.button>
            ) : (
              <motion.button
                className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 mx-auto animate-spin" />
                ) : (
                  "Verify Email"
                )}
              </motion.button>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default React.memo(EmailVerification);
