"use client";
import { useEffect, useRef, useState } from "react";
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
  const streamRef = useRef<MediaStream | null>(null);
  const recordingUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
    };
  }, []);

  const startRecording = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      toast.error("Enregistrement audio non supporté sur ce navigateur.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" }));
        }
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setRecording(true);
    } catch {
      toast.error("Impossible d'accéder au microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  const playRecording = async () => {
    if (!audioBlob) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    try {
      audioRef.current?.pause();
      if (recordingUrlRef.current) URL.revokeObjectURL(recordingUrlRef.current);
      const url = URL.createObjectURL(audioBlob);
      recordingUrlRef.current = url;
      const audio = new Audio(url);
      audioRef.current = audio;
      await audio.play();
      setPlaying(true);
      audio.onended = () => setPlaying(false);
    } catch {
      setPlaying(false);
      toast.error("Lecture de l'enregistrement impossible.");
    }
  };

  const playReference = async () => {
    if (!referenceAudioUrl) return;
    try {
      audioRef.current?.pause();
      const audio = new Audio(referenceAudioUrl);
      audioRef.current = audio;
      await audio.play();
    } catch {
      toast.error("Lecture du récitateur impossible pour le moment.");
    }
  };

  return (
    <div className="card-premium p-6 space-y-4">
      <h3 className="text-lg font-semibold">Enregistrer votre récitation</h3>
      <div className="flex gap-2 justify-center">
        {!recording ? (
          <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700" type="button">
            <Mic className="w-4 h-4 mr-2" /> Enregistrer
          </Button>
        ) : (
          <Button onClick={stopRecording} variant="outline" type="button">
            <Square className="w-4 h-4 mr-2" /> Arrêter
          </Button>
        )}
        {audioBlob && (
          <Button onClick={playRecording} variant="outline" type="button">
            {playing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {playing ? "Pause" : "Écouter"}
          </Button>
        )}
        {referenceAudioUrl && (
          <Button onClick={playReference} variant="outline" type="button">
            <Play className="w-4 h-4 mr-2" /> Écouter le récitateur
          </Button>
        )}
      </div>
    </div>
  );
}
