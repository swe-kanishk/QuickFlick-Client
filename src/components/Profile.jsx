import getUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  lazy,
  Suspense,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TbSettingsFilled } from "react-icons/tb";
import { IoCameraOutline } from "react-icons/io5";
import { BiMoviePlay } from "react-icons/bi";
import { LuContact2 } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa";
import { Heart } from "lucide-react";
import { FaComment, FaUser } from "react-icons/fa6";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";
import { ImExit } from "react-icons/im";
import { toast } from "sonner";
import axios from "axios";
import { IoIosCloseCircleOutline, IoMdGrid } from "react-icons/io";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";

// Lazy load CreatePost component
const CreatePost = lazy(() => import("./CreatePost"));

const Profile = React.memo(() => {
  const [open, setOpen] = useState(false);
  const [viewList, setViewList] = useState({
    type: null,
    data: null,
    isOpen: false,
  });
  
  const updateViewList = (type = null, data = null, isOpen = false) => {
    setViewList({ type, data, isOpen });
  };
  
  const [active, setActive] = useState("posts");
  const params = useParams();
  const userId = params.id;
  getUserProfile(userId);
  const { userProfile, user, isDark } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  const isLoggedInUSerProfile = useMemo(
    () => userProfile?._id === user?._id,
    [userProfile, user]
  );
  const isFollowing = true; // Replace this with actual following logic

  const dispatch = useDispatch();

  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);
  const handleSetActive = useCallback((tab) => setActive(tab), []);

  useEffect(() => {
    return () => {
      dispatch(setUserProfile(null));
    };
  }, [dispatch]);

  const logoutHandler = async () => {
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
    }
  };
  return (
    <div
      className={`flex flex-col max-w-5xl h-[calc(100vh-60px)] mx-auto items-start ${
        isDark ? "bg-[#151515] text-white" : "bg-white text-black"
      } justify-start px-5 md:px-0 py-3`}
    >
      <div className="flex w-full flex-col items-start md:p-8">
        <div className="md:grid flex-col w-full md:grid-cols-2 flex">
          <span className="font-bold flex items-center gap-2 justify-between mb-5 text-lg ">
            <div className="flex items-center gap-2">
              <FaUser />
              {userProfile?.username}
            </div>
            <ImExit
              onClick={() => logoutHandler()}
              className="cursor-pointer h-5 w-5 text-blue-500"
            />
          </span>
          <section className="flex items-center justify-start gap-8 md:justify-center">
            <Avatar className="min-w-[5rem] min-h-[5rem] rounded-full aspect-square object-cover overflow-hidden">
              <AvatarImage
                src={userProfile?.avatar}
                className="object-cover w-[5rem] h-[5rem] rounded-full aspect-square"
                alt="userProfile"
              />
              <AvatarFallback>
                <img
                  src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                  alt=""
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-evenly w-full gap-6 font-medium">
              <p className="flex flex-col md:flex-row justify-center items-center">
                <span className="font-medium">
                  {userProfile?.posts.length}{" "}
                </span>
                posts
              </p>
              <p
                onClick={() => {
                  
                  updateViewList("followers", userProfile.followers, true)
                }}
                className="flex flex-col md:flex-row justify-center items-center"
              >
                <span className="font-medium">
                  {userProfile?.follower.length}{" "}
                </span>
                followers
              </p>
              <p
                onClick={() => {
                  
                  updateViewList("following", userProfile.following, true)
                }}
                className="flex flex-col md:flex-row justify-center items-center"
              >
                <span className="font-medium">
                  {userProfile?.following.length}{" "}
                </span>
                following
              </p>
            </div>

          </section>
          <section className="flex flex-col">
            <span className="font-medium mt-3 text-lg mr-4">
              {userProfile?.username}
            </span>
            <div>
              <span>{userProfile?.bio || "Bio here..."}</span>
            </div>
            <div className="flex gap-2 items-center py-4 justify-start">
              {isLoggedInUSerProfile ? (
                <>
                  <Link to="/account/edit" className="w-2/5">
                    <button
                      className={`py-1 px-2 w-full ${
                        isDark ? "bg-[#302f2f]" : "bg-gray-200"
                      } mr-1 rounded-md font-medium`}
                    >
                      Edit Profile
                    </button>
                  </Link>
                  <button
                    className={`py-1 px-2 w-2/5 ${
                      isDark ? "bg-[#302f2f]" : "bg-gray-200"
                    } ml-1 mr-2 rounded-md font-medium`}
                  >
                    View archive
                  </button>
                  <button className="w-1/5">
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
          </section>
        </div>
      </div>
      <div className="border-t border-gray-300 h-full w-full mx-auto">
        <div className="flex justify-between w-[70%] md:w-1/2 mx-auto">
          {["posts", "reels", "saved", "tagged"].map((tab) => (
            <span
              key={tab}
              onClick={() => handleSetActive(tab)}
              className={`font-medium cursor-pointer flex items-center text-gray-600 pt-3 gap-1 ${
                active === tab
                  ? "text-black font-semibold border-black border-t-2"
                  : ""
              }`}
            >
              {tab === "posts" && (
                <p className="flex items-center gap-1 flex-row-reverse">
                  <span className="hidden md:flex">Posts</span>
                  <IoMdGrid size="22px" />
                </p>
              )}
              {tab === "reels" && (
                <p className="flex items-center gap-1 flex-row-reverse">
                  <span className="hidden md:flex">Reels</span>
                  <BiMoviePlay size="22px" />
                </p>
              )}
              {tab === "saved" && (
                <p className="flex items-center gap-1 flex-row-reverse">
                  <span className="hidden md:flex">Saved</span>
                  <FaRegBookmark size="18px" />
                </p>
              )}
              {tab === "tagged" && (
                <p className="flex items-center gap-1 flex-row-reverse">
                  <span className="hidden md:flex">Tagged</span>
                  <LuContact2 size="21px" />
                </p>
              )}
            </span>
          ))}
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
                      onClick={toggleOpen}
                      className="text-blue-500 hover:text-black cursor-pointer font-medium"
                    >
                      Share your first photo
                    </span>
                    <Suspense fallback={<div>Loading...</div>}>
                      {open && <CreatePost open={open} setOpen={setOpen} />}
                    </Suspense>
                  </>
                ) : (
                  <h1 className="text-3xl font-semibold">No posts</h1>
                )}
              </div>
            ) : (
              <div className="mt-2 py-6 max-w-5xl">
                {userProfile?.[active]?.length > 0 ? (
                  <div className="grid grid-cols-3 place-items-center gap-3">
                    {userProfile?.[active]?.map((post) => (
                      <div
                        key={post._id}
                        className="aspect-square relative object-cover overflow-hidden"
                      >
                        <img
                          src={post.image}
                          className="aspect-square object-cover"
                          alt=""
                        />
                        <div className="rounded inset-0 bg-black absolute flex items-center justify-center bg-opacity-50 opacity-0 cursor-pointer hover:opacity-100 transition-opacity duration-300">
                          <div className="flex items-center text-white space-x-4">
                            <button className="flex items-center gap-2 hover:text-gray-300">
                              <Heart />
                              <span>{post?.likes.length}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-gray-300">
                              <FaComment />
                              <span>{post?.comments.length}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col items-center py-[10%] justify-center">
                    <h1 className="text-3xl font-medium">
                      {`No ${
                        active === "reels" ? "Reels!" : `${active} posts!`
                      }`}
                    </h1>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={viewList.isOpen}>
      <DialogContent
        className="absolute flex flex-col gap-3 bg-black text-white inset-0"
        onInteractOutside={() => updateViewList()}
      >
        <DialogHeader className="text-center font-semibold">
          <div className="flex justify-between p-3">
            <span>{viewList.type}</span>
            <IoIosCloseCircleOutline
              size={"26px"}
              className="cursor-pointer"
              onClick={() => updateViewList()}
            />
          </div>
        </DialogHeader>

        {viewList?.data?.length > 0 ?  viewList?.data?.map((person) => {
          return (
            <Link
              onClick={(e) => {
                updateViewList();
              }}
              to={`/profile/${person._id}`}
              className="flex gap-3 items-center px-3 py-1 justify-between"
            >
              <div className="flex gap-3 items-center">
                <Avatar>
                  <AvatarImage
                    src={person?.avatar}
                    alt="img"
                    className="h-12 w-12 aspect-square overflow-hidden rounded-full object-cover"
                  />
                  <AvatarFallback>
                    <img
                      src="https://photosking.net/wp-content/uploads/2024/05/no-dp_16.webp"
                      alt=""
                      className="h-12 w-12 aspect-square rounded-full object-cover"
                    />
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium text-gray-300 text-sm">
                  {person?.username}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent bubbling
                  e.preventDefault(); // Prevent navigation
                  console.log("hello");
                }}
                className="px-3 py-1 bg-gray-300 rounded-md text-black"
              >
                unfollow
              </button>
            </Link>
          );
        }) : (
          <div className="my-auto h-full flex justify-center  items-center">
            <span className="text-lg pb-5 font-semibold">No {viewList.type}!</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
});

export default Profile;
