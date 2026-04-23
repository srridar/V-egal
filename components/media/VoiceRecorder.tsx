"use client";

import { useState, useRef } from "react";

export default function VoiceRecorder() {

    const [recording, setRecording] = useState(false);                   //  State to track whether recording is ON or OFF (used for UI toggle)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);         //  Stores MediaRecorder instance (like a variable that persists across renders)
    const audioChunksRef = useRef<Blob[]>([]);                           //  Stores audio data chunks as they are recorded (used to assemble final audio file)


    const startRecording = async () => {                                             //  Function to start recording audio
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });   // Requests access to the user's microphone and gets an audio stream. this method is created by the browser and is used to capture media input from the user. It returns a promise that resolves to a MediaStream object if the user grants permission, or rejects if permission is denied or an error occurs.
         //  Ask browser for microphone permission
        //   Returns a stream (live audio input)
       
       
        const mediaRecorder = new MediaRecorder(stream);  //   Create MediaRecorder object to record audio from stream
        mediaRecorderRef.current = mediaRecorder;         //  Store MediaRecorder instance in ref for later use (like a variable that persists across renders)

        mediaRecorder.start();                           // Start recording audio
        setRecording(true);                              // Update state to indicate recording has started (used for UI toggle)

        mediaRecorder.ondataavailable = (e) => {         // Event handler that is called when a new chunk of audio data is available. The recorded audio is captured in small chunks, and 
             audioChunksRef.current.push(e.data);        // this event is triggered each time a chunk is ready. The event object (e) contains the audio data in e.data, which is then stored in  the audioChunksRef for later assembly into a
                                                            //   complete audio file.
                 
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });    //    Combine all chunks into ONE audio file (Blob)

            const audioUrl = URL.createObjectURL(audioBlob);             //  Convert blob into playable URL
            console.log("Recorded audio:", audioUrl);              //  Log the URL of the recorded audio (for testing purposes)  You can play or send this to backend

            audioChunksRef.current = [];                           // Clear chunks for next recording (reset state for next recording session)
        };
    }

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    return (
        <div className="flex gap-2">
            {!recording ? (
                <button onClick={startRecording} className="bg-green-500 text-white px-3 py-1">
                    Start
                </button>
            ) : (
                <button onClick={stopRecording} className="bg-red-500 text-white px-3 py-1">
                    Stop
                </button>
            )}
        </div>
    );


}