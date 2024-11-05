import getUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { TbSettingsFilled } from "react-icons/tb";
import { IoCameraOutline } from "react-icons/io5";
import CreatePost from "./CreatePost";
import { IoMdGrid } from "react-icons/io";
import { BiMoviePlay } from "react-icons/bi";
import { LuContact2 } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa";
import { Heart } from "lucide-react";
import { FaComment } from "react-icons/fa6";
import { setUserProfile } from "@/redux/authSlice";

function Profile() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("posts");

  const params = useParams();
  const userId = params.id;
  getUserProfile(userId);
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUSerProfile = userProfile?._id === user?._id;
  const isFollowing = true;
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setUserProfile(null))
    }
  },[])

  return (
    <div className="flex flex-col max-w-5xl h-screen mx-auto items-start justify-start py-6">
      <div className="flex w-full flex-col items-start p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="w-[7rem] h-[7rem] rounded-full overflow-hidden">
              <AvatarImage src={userProfile?.avatar} alt="userProfile" />
              <AvatarFallback>
                <img
                  src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                  alt=""
                />
              </AvatarFallback>
            </Avatar>
          </section>
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-start">
              <span className="font-medium text-lg mr-4">
                {userProfile?.username}
              </span>
              {isLoggedInUSerProfile ? (
                <>
                  <Link to="/account/edit">
                  <button className="py-1 px-2 bg-gray-200 mx-1 rounded-md font-medium">
                    Edit Profile
                  </button>
                  </Link>
                  <button className="py-1 px-2 bg-gray-200 ml-1 mr-2 rounded-md font-medium">
                    View archive
                  </button>
                  <button>
                    <TbSettingsFilled size={"24px"} />
                  </button>
                </>
              ) : isFollowing ? (
                <>
                  <button className="font-medium px-3 py-1 rounded-md mx-1 bg-gray-200">
                    Unfollow
                  </button>
                  <button className="font-medium px-2 py-1 rounded-md mx-1 bg-gray-200">
                    Message
                  </button>
                </>
              ) : (
                <button className="font-medium px-3 py-1 rounded-md mx-1 hover:bg-blue-500 bg-[#3e8dfd] text-white">
                  Follow
                </button>
              )}
            </div>
            <div className="flex items-center gap-6 font-medium">
              <p>
                <span className="font-medium">{userProfile?.posts.length} </span>
                posts
              </p>
              <p>
                <span className="font-medium">
                  {userProfile?.follower.length}{" "}
                </span>
                followers
              </p>
              <p>
                <span className="font-medium">
                  {userProfile?.following.length}{" "}
                </span>
                following
              </p>
            </div>
            <div>
              <span>{userProfile?.bio || "Bio here..."}</span>
            </div>
          </section>
        </div>
      </div>
      <div className="border-t border-gray-300 h-full w-full mx-auto">
        <div className="flex justify-between w-1/2 mx-auto">
          <span
            onClick={() => setActive("posts")}
            className={`font-medium cursor-pointer flex items-center text-gray-600 pt-3 gap-1 ${
              active === "posts"
                ? "text-black font-semibold border-black border-t-2"
                : ""
            }`}
          >
            <IoMdGrid size={"22px"} />
            Posts
          </span>
          <span
            onClick={() => setActive("reels")}
            className={`font-medium cursor-pointer flex items-center text-gray-600 pt-3 gap-1 ${
              active === "reels"
                ? "text-black font-semibold border-black border-t-2"
                : ""
            }`}
          >
            <BiMoviePlay size={"22px"} />
            Reels
          </span>
          {isLoggedInUSerProfile ? (
            <span
              onClick={() => setActive("saved")}
              className={`font-medium cursor-pointer flex items-center text-gray-600 pt-3 gap-1 ${
                active === "saved"
                  ? "text-black font-semibold border-black border-t-2"
                  : ""
              }`}
            >
              <FaRegBookmark size={"18px"} />
              Saved
            </span>
          ) : (
            ""
          )}
          <span
            onClick={() => setActive("tagged")}
            className={`font-medium cursor-pointer flex items-center text-gray-600  pt-3 gap-1 ${
              active === "tagged"
                ? "text-black font-semibold border-black border-t-2"
                : ""
            }`}
          >
            <LuContact2 size={"21px"} />
            Tagged
          </span>
        </div>
        <div>
          <div>
            {!userProfile?.posts.length ? (
              <div className="flex flex-col min-h-[400px] items-center justify-center gap-3">
                <span className="border-[1.5px] w-fit rounded-full p-4 border-black">
                  <IoCameraOutline size={"2rem"} />
                </span>
                {isLoggedInUSerProfile ? (
                  <>
                    <h1 className="text-3xl font-semibold">Share photos</h1>
                    <span className="font-medium">
                      When you share photos, they will appear on your profile.
                    </span>
                    <span
                      onClick={() => setOpen(true)}
                      className="text-blue-500 hover:text-black cursor-pointer font-medium"
                    >
                      Share your first photo
                    </span>
                    <CreatePost open={open} setOpen={setOpen} />
                  </>
                ) : (
                  <h1 className="text-3xl font-semibold">No posts</h1>
                )}
              </div>
            ) : (
              <div className="mt-2 py-6 max-w-5xl">
                  {userProfile?.[active]?.length > 0 ?
                    (
                      <div className="grid grid-cols-3 place-items-center gap-3">
                    {userProfile?.[active]?.map((post, index) => {
                      return (
                        <div
                          key={post._id}
                          className="aspect-square relative object-cover overflow-hidden"
                        >
                          <img src={post.image} className="aspect-square object-cover overflow-hidden" alt="" />
                          <div className="rounded inset-0 bg-black absolute flex items-center justify-center bg-opacity-50 opacity-0 cursor-pointer hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center text-white space-x-4">
                              <button className="flex items-center gap-2 hover:text-gray-300"><Heart /><span>{post?.likes.length}</span></button>
                              <button className="flex items-center gap-2 hover:text-gray-300"><FaComment /><span>{post?.comments.length}</span></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                    ) : (
                      <div className="flex flex-1 flex-col items-center py-[10%] justify-center">
                        <h1 className="text-3xl font-medium">{`No ${active === 'reels' ? 'Reels!' : `${active} posts!`}`}</h1>
                      </div>
                    )
                  }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
