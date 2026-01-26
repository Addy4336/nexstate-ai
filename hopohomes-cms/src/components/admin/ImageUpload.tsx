"use client";

import { useState } from "react";
import { X, Upload, Loader2, ImagePlus, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
    onImagesChange: (urls: string[]) => void;
    onFolderIdChange?: (folderId: string) => void;
    defaultImages?: string[];
    folderName?: string; // Optional folder name (e.g. Property Title)
}

export function ImageUpload({
    onImagesChange,
    onFolderIdChange,
    defaultImages = [],
    folderName = "properties",
    layoutMode = "grid"
}: ImageUploadProps & { layoutMode?: "grid" | "stack" }) {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<string[]>(defaultImages);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            setUploading(true);
            const files = Array.from(e.target.files);
            const newUploadedUrls: string[] = [];

            // Convert files to base64 and upload via API
            const uploadPromises = files.map(async (file) => {
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });

                const cleanFolderName = folderName
                    .toLowerCase()
                    .replace(/[^a-z0-9-_]/g, "-")
                    .replace(/-+/g, "-")
                    .trim() || "properties";

                const response = await fetch('/api/storage/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        file: {
                            data: base64,
                            name: file.name,
                            type: file.type,
                        },
                        folderName: cleanFolderName,
                    }),
                });

                const result = await response.json();

                if (!result.success || !result.data?.url) {
                    throw new Error(`Failed to upload ${file.name}: ${result.error}`);
                }

                if (result.data.path && onFolderIdChange) {
                    onFolderIdChange(cleanFolderName);
                }

                return result.data.url;
            });

            const results = await Promise.all(uploadPromises);
            newUploadedUrls.push(...results);

            let updatedImages: string[] = [];

            if (isCover) {
                if (images.length > 0) {
                    updatedImages = [newUploadedUrls[0], ...images.slice(1)];
                } else {
                    updatedImages = [newUploadedUrls[0]];
                }
            } else {
                updatedImages = [...images, ...newUploadedUrls];
            }

            setImages(updatedImages);
            onImagesChange(updatedImages);
            toast.success("Images uploaded successfully!");

        } catch (error: any) {
            console.error(error);
            toast.error("Error uploading images: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        setImages(newImages);
        onImagesChange(newImages);
    };

    const coverImage = images[0];
    const galleryImages = images.slice(1);

    return (
        <div className={`grid gap-6 ${layoutMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
            {/* Left Column: Cover Image */}
            <div className="flex flex-col gap-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    Cover Image
                </Label>

                <div className={`group relative w-full rounded-2xl overflow-hidden border border-border bg-muted/20 hover:bg-muted/30 transition-all duration-300 ${layoutMode === 'stack' ? 'aspect-video' : 'aspect-video md:aspect-[4/3]'}`}>
                    {!coverImage ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleUpload(e, true)}
                                disabled={uploading}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            {uploading ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <ImagePlus className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="font-semibold text-sm text-foreground">Upload Cover</p>
                                    <p className="text-xs text-muted-foreground mt-1 px-4">
                                        Support for JPEG, PNG, WEBP
                                    </p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={coverImage}
                                alt="Cover"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <button
                                    type="button"
                                    onClick={() => removeImage(0)}
                                    className="p-2.5 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all transform hover:scale-110"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                FEATURED
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Gallery Images */}
            <div className="flex flex-col gap-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Gallery
                </Label>

                <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square relative rounded-xl border border-dashed border-muted-foreground/30 bg-muted/10 hover:bg-muted/20 transition-all flex flex-col items-center justify-center cursor-pointer group hover:border-primary/50">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleUpload(e, false)}
                            disabled={uploading}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                            <ImagePlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                    </div>

                    {galleryImages.map((url, index) => {
                        const realIndex = index + 1;
                        return (
                            <div key={url} className="aspect-square relative rounded-xl overflow-hidden shadow-sm group border border-border">
                                <Image
                                    src={url}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => removeImage(realIndex)}
                                        className="p-1.5 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-destructive/80 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
