import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa'; // Import play/pause icons
import AudioVisualizer from './AudioVisulaizer';

const AudioPlayer = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Function to format time (minutes:seconds)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Play/Pause functionality
  const togglePlayPause = () => {
    const audioElement = audioRef.current;
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle progress update
  const updateProgress = () => {
    const audioElement = audioRef.current;
    const current = audioElement.currentTime;
    const remaining = audioElement.duration - current;

    setCurrentTime(current);
    setRemainingTime(remaining);

    if (progressRef.current) {
      progressRef.current.value = (current / audioElement.duration) * 100;
    }
  };

  // Handle progress bar changes
  const handleProgressChange = (e) => {
    const audioElement = audioRef.current;
    const newTime = (e.target.value / 100) * audioElement.duration;
    audioElement.currentTime = newTime;
  };

  // Setup event listeners on mount
  useEffect(() => {
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener('timeupdate', updateProgress);
      audioElement.addEventListener('loadedmetadata', () => {
        setDuration(audioElement.duration);
        setRemainingTime(audioElement.duration);
      });

      return () => {
        audioElement.removeEventListener('timeupdate', updateProgress);
      };
    }
  }, []);

  return (
    <div className='flex flex-col gap-3'>
        <AudioVisualizer audioSrc={audioSrc} isPlaying={isPlaying} />
    <div className="audio-player flex justify-between gap-3">
      {/* Audio element */}
      <audio ref={audioRef} src={audioSrc} />

      {/* Play/Pause Button */}
      <button onClick={togglePlayPause} className="play-pause-btn">
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <input
        ref={progressRef}
        type="range"
        min="0"
        max="100"
        value={(currentTime / duration) * 100}
        onChange={handleProgressChange}
        className="progress-bar flex-1"
      />

      {/* Time Display */}
      <div className="time-display">
        <span>{formatTime(currentTime)}</span>
        <span> / </span>
        <span>{formatTime(remainingTime)}</span>
      </div>      
    </div>
    </div>
  );
};

export default AudioPlayer;
