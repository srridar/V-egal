"use client";
import { useState } from "react";


type Props = {
    onFileSelect: (file: File) => void;
};


export default function FileUploader({ onFileSelect }: Props) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
    };

    return (
        <div className="flex flex-col gap-2">
            <input type="file" onChange={handleChange} />

            {preview && (
                <p className="text-sm text-gray-500">
                    File selected - <span className="text-blue-500">{preview}</span>
                </p>
            )}
        </div>
    );
}