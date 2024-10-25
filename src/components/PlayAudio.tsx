import { useRef, useState } from 'react';
import { CirclePause, PlayIcon } from 'lucide-react';
import { Button } from './ui/button';
import audioMp3 from '/VTSLogger_incoming_9386_20241021151717.wav';
import { getRecordingApi } from '@/services/apiCalls';
import axios from 'axios';
import apiClient from '@/utils/apiClient';

const LoadingSpinner = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={'animate-spin'}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

function PlayAudio({ row }) {
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  console.log('Audio url', audioUrl);

  const startAudio = async () => {
    // Fetch the audio file using axios
    try {
      const BASE_URL = import.meta.env.VITE_API_URL;

      if (!audioUrl) {
        setIsFetching(true);

        fetch(`${BASE_URL}/v1/calls/getRecording`, { method: 'POST' })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to fetch audio file');
            }
            return response.blob();
          })
          .then((blob) => {
            // Create a URL for the Blob and set it as the audio source
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            if (audioRef.current) {
              audioRef.current.currentTime = 0; // Start from the beginning
              audioRef.current.play();
              setIsPlaying(true);
            }
            setIsPlaying(true);

            setIsFetching(false);
          })
          .catch((error) => {
            console.error('Error fetching audio:', error);
            setIsFetching(false);
          });
      } else {
        if (audioRef.current) {
          audioRef.current.currentTime = 0; // Start from the beginning
          audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error fetching audio file:', error);
      setIsFetching(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // Pause the audio
      audioRef.current.currentTime = 0; // Reset to the beginning
      setIsPlaying(false);
    }
  };

  return (
    <div>
      {/* <audio ref={audioRef}>
        <source src={audioMp3} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio> */}
      {/* {audioUrl && (
        <audio src={audioUrl} autoPlay ref={audioRef}>
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )} */}

      {audioUrl && <audio ref={audioRef} src={audioUrl} autoPlay />}

      {/* {audioUrl && <audio controls src={audioUrl} />} */}

      {!isFetching ? (
        <Button
          variant="ghost"
          onClick={!isPlaying ? startAudio : stopAudio}
          className="flex space-x-2"
        >
          {isPlaying ? <CirclePause size={16} /> : <PlayIcon size={16} />}
        </Button>
      ) : (
        <div className="ml-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default PlayAudio;
