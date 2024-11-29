import React, { useState, useRef } from 'react';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi'; // Example import, replace with your actual icon imports
import { useSelector } from 'react-redux';

const AudioPlayer = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const {isDark} = useSelector(store => store.auth)

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={post?.audio}
        autoPlay={false}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className='hidden'
      />
      
      <button onClick={(e) => {
        toggleAudio()
        e.stopPropagation()
      }} className={`absolute top-[4.5rem] left-[5px] p-4 ${
        isDark ? "bg-[#f3f3f3] text-black" : "bg-[#212121] text-white"
      } z-10 rounded-full`}>
        {isPlaying ? (
            <PiSpeakerSimpleHighFill /> // Icon when audio is playing
        ) : (
            <PiSpeakerSimpleSlashFill /> // Icon when audio is paused
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
