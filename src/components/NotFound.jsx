import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex space-y-3 flex-col items-center justify-center">
      <h1 className="font-bold text-3xl"><span className="text-red-500">404</span> - Page Not Found !</h1>
      <p className="font-medium text-blue-500">The page you are looking for does not exist.</p>
      <button className="flex items-center justify-center gap-1 hover:gap-2 px-3 py-2 bg-blue-600 rounded-lg text-white font-semibold" onClick={() => navigate(-1)}><ArrowLeft className="h-6 w-6" />Go Back</button> 
    </div>
  );
};

export default NotFound;
