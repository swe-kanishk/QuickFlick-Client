import { setIsOtpExpired } from "@/redux/authSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CountdownTimer({ deadline }) {
  const { isOtpExpired } = useSelector((store) => store.auth);

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const dispatch = useDispatch();

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();
    if (time <= 0 && !isOtpExpired) {
      setMinutes(0);
      setSeconds(0);
      dispatch(setIsOtpExpired(true)); // Dispatch only once
    } else if (time > 0) {
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    }
  };

  useEffect(() => {
    getTime(); // Run once initially
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, [deadline, isOtpExpired, dispatch]);

  return (
    <div>
      {isOtpExpired ? (
        <p className="max-w-fit mx-auto text-red-500">
          <span>OTP Expired!</span>
        </p>
      ) : (
        <p className="max-w-fit mx-auto text-white">
          <span>Enter the OTP within: </span>
          {String(minutes).padStart(2, "0")} : {String(seconds).padStart(2, "0")}
        </p>
      )}
    </div>
  );
}
