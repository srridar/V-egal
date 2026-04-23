"use client";

import Image from "next/image";

type Props = {
    file: File | null;
    onRemove?: () => void;        //   onRemove is optional because we might want to use this component just for preview without the ability to remove the image 
};


export default function ImagePreview({ file, onRemove }: Props) {
    if (!file) return null;

    const url = URL.createObjectURL(file);

    return (
        <div className="relative w-40 h-40">
            <Image
                src={url}
                alt="preview"
                fill
                className="object-cover rounded-lg"
            />

            <button
                onClick={onRemove}
                className="absolute top-1 right-1 bg-red-500 text-white px-2"
            >
                X
            </button>
        </div>
    );


}