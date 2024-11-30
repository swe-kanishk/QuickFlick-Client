import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ audioSrc, isPlaying }) => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);

  useEffect(() => {
    if (!audioSrc) return;

    // Fetch and decode the audio file
    const fetchAndDecodeAudio = async () => {
      const response = await fetch(audioSrc);
      const arrayBuffer = await response.arrayBuffer();

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
        // Create analyser
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;  // Reduced fftSize for coarser resolution
        const frequencyBufferLength = analyser.frequencyBinCount;
        const frequencyData = new Uint8Array(frequencyBufferLength);

        // Store references to these objects
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        // Handle isPlaying state changes (start/stop the audio)
        if (isPlaying) {
          // Create a new source node every time we play the audio
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          source.start();

          // Store the source reference
          sourceRef.current = source;

          // Automatically stop when the audio ends
          source.onended = () => {
            sourceRef.current = null;
          };

          // Start the visualization
          visualize(frequencyData, analyser, audioContext);
        }
      });
    };

    if (isPlaying) {
      fetchAndDecodeAudio(); // Only fetch and decode when playing
    } else {
      // Stop the current audio when isPlaying is false
      if (sourceRef.current) {
        sourceRef.current.stop(); // Stop the audio
        sourceRef.current = null; // Reset the reference
      }
    }

    // Cleanup the audio context when component is unmounted
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioSrc, isPlaying]);

  // Function to visualize audio data
  function visualize(frequencyData, analyser, audioContext) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasContext = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const barWidth = canvas.width / analyser.frequencyBinCount;

    // Define a maximum height for the bars, to make them shorter than the canvas height (e.g., 100% of the canvas height, which is 5rem)
    const maxBarHeight = canvas.height;  // Maximum height for bars is 100% of the canvas height (5rem)

    function draw() {
      requestAnimationFrame(draw);

      // Transparent background
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);

      analyser.getByteFrequencyData(frequencyData);

      for (let i = 0; i < analyser.frequencyBinCount; i++) {
        const value = frequencyData[i];

        // Scale the frequency value to fit within the maxBarHeight
        const barHeight = (value / 255) * maxBarHeight;  // Scale value (0-255) to the height (0-maxBarHeight)

        // Set the color based on frequency value
        let color = 'white';
        // if (value < 85) {
        //   color = 'green'; // Green
        // } else if (value < 170) {
        //   color = 'red'; // Red
        // } else {
        //   color = 'blue'; // Blue
        // }

        // Draw the bar with the chosen color and height
        canvasContext.fillStyle = color;
        canvasContext.fillRect(
          i * barWidth,
          canvas.height - barHeight,  // Start from the bottom of the canvas and go upwards
          barWidth - 1,
          barHeight
        );
      }
    }

    draw();
  }

  return (
    <canvas ref={canvasRef} className="h-[5rem] z-10 absolute w-[5rem] rounded-full" />
  );
};

export default AudioVisualizer;