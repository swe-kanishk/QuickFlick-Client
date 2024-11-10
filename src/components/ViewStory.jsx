import axios from 'axios';
import { IoMdClose } from "react-icons/io";
import React, { useEffect, useState } from 'react';

function ViewStory({ user, setViewStory }) {
    console.log('user', user)
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0); // track the current story index

    const getUserStories = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/stories/${user}`, { withCredentials: true });
            console.log(response)
            return response.data.stories;
        } catch (error) {
            console.error("Error fetching stories:", error);
            return [];
        }
    }

    useEffect(() => {
        const fetchStories = async () => {
            const userStories = await getUserStories();
            setStories(userStories);
        };
        fetchStories();
    }, [user]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % stories?.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + stories?.length) % stories?.length);
    };

    return (
        <div className={`h-screen absolute w-screen bg-black  z-50 top-0 left-0`}>
            <IoMdClose 
                onClick={() => setViewStory(false)} 
                className='w-8 cursor-pointer h-8 bg-white rounded-full p-1 absolute right-4 top-4' 
            />
            <div className='flex items-center justify-center h-full'>
                {stories?.length > 0 && (
                    <div className="text-white text-center">
                        <img src={stories[currentIndex].image[0]} alt="story" className="w-80 h-auto mx-auto" />
                        <h1 className="mt-2">{stories[currentIndex].caption}</h1>

                        <div className="mt-4 flex justify-center space-x-4">
                            <button
                                onClick={handlePrevious}
                                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewStory;