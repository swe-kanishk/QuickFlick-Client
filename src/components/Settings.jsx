import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import React, { useState } from 'react';
import { DialogHeader } from './ui/dialog';
import { useSelector, useDispatch } from 'react-redux';
import { IoMdSunny } from 'react-icons/io';
import { Loader2, Moon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setAuthUser, setTheme } from '@/redux/authSlice';

function Settings({ openSettings, setOpenSettings }) {
  const { isDark } = useSelector((store) => store.auth); // Get current dark mode state from Redux
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)

  // Toggle dark mode function
  const handleLightAndDarkMode = async() => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/user/update-theme`, { withCredentials: true })
      if(response.data.success){
        console.log(response.data)
        dispatch(setTheme(response.data.isDark))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const logoutHandler = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/logout`
      );
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }finally {
        setLoading(false)
    }
  };

  return (
    <Dialog open={openSettings}>
      <DialogContent
        className={`bg-white text-slate-900 max-w-lg px-3 w-[90%]  py-3 md:rounded-lg rounded-t-lg`}
        onInteractOutside={() => setOpenSettings(!openSettings)}
      >
        <DialogHeader className="text-center mb-3 text-xl font-semibold">Settings</DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Dark/Light Mode Toggle */}
          <div className="flex items-center px-3 py-2 bg-gray-200 rounded-lg justify-between">
            <span className="text-sm font-medium">
              Switch to {isDark ? 'light' : 'dark'} mode
            </span>
            <button
              onClick={handleLightAndDarkMode}
              className="relative flex items-center justify-between w-16 h-8 p-1 bg-black rounded-full transition-all duration-300"
            >
              {/* Circle that moves */}
              <div
                className={`w-6 h-6 bg-white rounded-full flex items-center justify-center transition-transform duration-300 ${
                  isDark ? 'translate-x-8' : ''
                }`}
              >{isDark ? (
                <Moon size={18} />
              ) : (
                <IoMdSunny size={18} />
              )}</div>
              {/* Moon or Sun icon */}
              
            </button>
          </div>
        <button onClick={logoutHandler} className='mx-auto text-red-500 font-semibold cursor-pointer'>{loading ? <Loader2 className='animate-spin text-black' /> : 'Logout'}</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Settings;
