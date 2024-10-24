import { useRef, useState } from 'react';
import { CirclePause, PlayIcon } from 'lucide-react';
import { Button } from './ui/button';
import audioMp3 from '/VTSLogger_incoming_9386_20241021151717.wav';

function PlayAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const startAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Start from the beginning
      audioRef.current.play();
      setIsPlaying(true);
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
      <audio ref={audioRef}>
        <source src={audioMp3} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <Button
        variant="ghost"
        onClick={!isPlaying ? startAudio : stopAudio}
        className="flex space-x-2"
      >
        {isPlaying ? <CirclePause size={16} /> : <PlayIcon size={16} />}
      </Button>
    </div>
  );
}

export default PlayAudio;
