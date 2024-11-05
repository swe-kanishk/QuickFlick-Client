import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    avatar: user?.avatar,
    bio: user?.bio,
    gender: user?.gender,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, avatar: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
  const token = localStorage.getItem('token')
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.avatar) {
      formData.append("avatar", input.avatar);
    }
    try {
      setLoading(true);
      const res = await axios.post('https://quickflick-server.onrender.com/api/v1/user/profile/edit', formData, {
        headers: {
          Authorization: token,
          "Content-Type": 'multipart/form-data'
        },
        withCredentials: true
      });
      if(res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          avatar: res.data.user?.avatar,
          gender: res.data.user?.gender
        }
        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user?._id}`)
        toast.success(res.data.message);
        
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex max-w-3xl mx-auto py-8">
      <section className="flex flex-col gap-6 w-full">
        <h1 className="font-semibold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 py-2 px-3 rounded-xl">
          <div className="flex items-center gap-3">
            <Avatar className="w-[4rem] h-[4rem] rounded-full overflow-hidden">
              <AvatarImage src={user?.avatar} alt="user-avatar" />
              <AvatarFallback>
                <img
                  src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                  alt=""
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-medium text-sm">{user?.username}</h1>
              <span className="text-gray-500">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            onChange={fileChangeHandler}
            type="file"
            ref={imageRef}
            className="hidden"
          />
          <button
            onClick={() => imageRef?.current.click()}
            className="bg-blue-500 text-white font-medium py-2 px-3 rounded-lg"
          >
            Change photo
          </button>
        </div>
        <div>
          <h1 className="font-semibold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            name="bio"
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <h1 className="font-semibold text-xl mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="w-[180px] py-2 text-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-end">
          {loading ? (
            <Button className="w-fit bg-blue-500 hover:bg-blue-600">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className="w-fit bg-blue-500 hover:bg-blue-600"
            >
              submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
