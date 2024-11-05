import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AuthRoute({element}) {
    const { user } = useSelector((store) => store.auth);

    console.log("AuthRoute check:", user);

    if (!user) {
      return element;
    }
    return <Navigate to="/" />;
}