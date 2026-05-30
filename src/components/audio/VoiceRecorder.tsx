"use client";
import { useState, useRef } from "react";
import { Mic, Square, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VoiceRecorder({ referenceAudioUrl }: { referenceAudioUrl?: string }) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [playing, setPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      toast.error("Impossible d'accéder au microphone.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const playRecording = () => {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
    setPlaying(true);
    audio.onended = () => setPlaying(false);
  };

  const playReference = () => {
    if (!referenceAudioUrl) return;
    const audio = new Audio(referenceAudioUrl);
    audio.play();
  };

  return (
    <div className="card-premium p-6 space-y-4">
      <h3 className="text-lg font-semibold">Enregistrer votre récitation</h3>
      <div className="flex gap-2 justify-center">
        {!recording ? (
          <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
            <Mic className="w-4 h-4 mr-2" /> Enregistrer
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="outline">
            <Square className="w-4 h-4 mr-2" /> Arrêter
          </Button>
        )}
        {audioBlob && (
          <Button onClick={playRecording} variant="outline">
            {playing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {playing ? "Pause" : "Écouter"}
          </Button>
        )}
        {referenceAudioUrl && (
          <Button onClick={playReference} variant="outline">
            <Play className="w-4 h-4 mr-2" /> Écouter le récitateur
          </Button>
        )}
      </div>
    </div>
  );
}