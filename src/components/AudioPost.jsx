import React, { useState, useRef, useEffect } from 'react';
import { PiSpeakerSimpleHighFill, PiSpeakerSimpleSlashFill } from 'react-icons/pi'; // Example import for your icons

const AudioPost = ({ post }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  // Toggle play/pause
  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Update progress as the audio plays
  const updateProgress = () => {
    const currentTime = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((currentTime / duration) * 100);
  };

  // Set the audio duration once it is loaded
  const handleLoadedMetadata = () => {
    const duration = audioRef.current.duration;
    setDuration(duration);
  };

  // Seek audio when user clicks on the progress bar
  const handleSeek = (e) => {
    const clickPosition = e.nativeEvent.offsetX;
    const barWidth = e.target.offsetWidth;
    const newTime = (clickPosition / barWidth) * duration;
    audioRef.current.currentTime = newTime;
    setProgress((newTime / duration) * 100);
  };

  // Automatically update the progress as the audio plays
  useEffect(() => {
    const interval = setInterval(updateProgress, 100);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="audio-player w-full max-w-md mx-auto p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={post?.audio}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={handleLoadedMetadata}
      ></audio>

      {/* Play/Pause button */}
      <button
        onClick={toggleAudio}
        className="mt-4 text-gray-800 bg-transparent hover:bg-gray-200 p-2 rounded-full focus:outline-none"
      >
        {isPlaying ? (
          <PiSpeakerSimpleSlashFill size={30} />
        ) : (
          <PiSpeakerSimpleHighFill size={30} />
        )}
      </button>

      {/* Progress bar */}
      <div
        className="w-full bg-gray-200 rounded-full mt-4 cursor-pointer"
        style={{ height: '6px' }}
        onClick={handleSeek}
      >
        <div
          style={{ width: `${progress}%` }}
          className="bg-green-500 h-full rounded-full"
        ></div>
      </div>

      {/* Duration and progress display */}
      <div className="w-full mt-2 flex justify-between text-sm text-gray-600">
        <span>{`${Math.floor(progress / 60)}:${String(Math.floor(progress % 60)).padStart(2, '0')}`}</span>
        <span>{`${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}`}</span>
      </div>
    </div>
  );
};

export default AudioPost;
