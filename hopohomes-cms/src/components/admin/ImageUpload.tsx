"use client";

import { useState } from "react";
import { X, Upload, Loader2, ImagePlus, Star } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { uploadImageToDriveAction } from "@/actions/google-drive-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
    onImagesChange: (urls: string[]) => void;
    onFolderIdChange?: (folderId: string) => void;
    defaultImages?: string[];
    folderName?: string; // Optional folder name (e.g. Property Title)
}

export function ImageUpload({ onImagesChange, onFolderIdChange, defaultImages = [], folderName = "Properties" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    // images[0] is always treated as Cover Image
    const [images, setImages] = useState<string[]>(defaultImages);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
        try {
            if (!e.target.files || e.target.files.length === 0) return;

            setUploading(true);
            const files = Array.from(e.target.files);
            const newUploadedUrls: string[] = [];

            // Parallel uploads
            const uploadPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                // Sanitize folder name: remove special chars
                const cleanFolderName = folderName.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "Properties";
                formData.append("folderName", cleanFolderName);

                const result = await uploadImageToDriveAction(formData);
                if (!result.success || !result.url) {
                    throw new Error(`Failed to upload ${file.name}: ${result.error}`);
                }

                // Notify parent about the folder ID (only needs to happen once really)
                if (result.parentId && onFolderIdChange) {
                    onFolderIdChange(result.parentId);
                }

                return result.url;
            });

            const results = await Promise.all(uploadPromises);
            newUploadedUrls.push(...results);

            let updatedImages: string[] = [];

            if (isCover) {
                // If uploading cover, Replace index 0, or unshift if empty
                if (images.length > 0) {
                    updatedImages = [newUploadedUrls[0], ...images.slice(1)];
                } else {
                    updatedImages = [newUploadedUrls[0]];
                }
            } else {
                // Determine start index for gallery
                // If we have a cover (index 0), append to end
                // If we don't have a cover, these become valid images, but maybe we should ensure index 0 is always "Cover" conceptually?
                // For simplicity, just append. The user can drag/drop later (if we added that). 
                // But for now, index 0 is cover.

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Left Column: Cover Image */}
            <div className="flex flex-col gap-2 h-full">
                <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Cover Image
                </Label>

                <div className="flex-1 min-h-[250px] relative rounded-xl overflow-hidden border-2 border-dashed border-muted bg-muted/10 transition-colors hover:bg-muted/20">
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
                                <Loader2 className="w-10 h-10 animate-spin text-muted-foreground mb-4" />
                            ) : (
                                <div className="p-4 rounded-full bg-background shadow-sm mb-4">
                                    <ImagePlus className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}
                            <p className="font-medium text-foreground">Upload Cover Image</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Drag & drop or click to browse
                            </p>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col group">
                            <Image
                                src={coverImage}
                                alt="Cover"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(0)}
                                    className="p-2 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Cover
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Gallery Images */}
            <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Gallery Images
                </Label>

                <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square relative rounded-lg border-2 border-dashed border-muted bg-muted/10 transition-colors hover:bg-muted/20 flex flex-col items-center justify-center cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleUpload(e, false)}
                            disabled={uploading}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        {uploading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        ) : (
                            <ImagePlus className="w-5 h-5 text-muted-foreground" />
                        )}
                        <span className="text-xs font-medium mt-1 text-muted-foreground">Add More</span>
                    </div>

                    {galleryImages.map((url, index) => {
                        const realIndex = index + 1;
                        return (
                            <div key={url} className="aspect-square relative rounded-lg overflow-hidden border bg-background group shadow-sm">
                                <Image
                                    src={url}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(realIndex)}
                                    className="absolute top-1 right-1 p-1 bg-destructive/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
                {galleryImages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center p-8 border rounded-lg bg-muted/5 border-dashed text-muted-foreground text-sm text-center">
                        Additional images will appear here
                    </div>
                )}
            </div>
        </div>
    );
}
