"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2, ImagePlus } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
    onImagesChange: (urls: string[]) => void;
    defaultImages?: string[];
}

export function ImageUpload({ onImagesChange, defaultImages = [] }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(defaultImages);
    const supabase = createClient();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('properties')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('properties').getPublicUrl(filePath);

            const newImages = [...images, data.publicUrl];
            setImages(newImages);
            onImagesChange(newImages); // Notify parent

            toast.success("Image uploaded!");
        } catch (error: any) {
            toast.error("Error uploading image: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        setImages(newImages);
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                        <Image
                            src={url}
                            alt="Property"
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <div className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    ) : (
                        <ImagePlus className="w-8 h-8 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground font-medium">
                        {uploading ? "Uploading..." : "Upload Image"}
                    </span>
                </div>
            </div>
        </div>
    );
}
