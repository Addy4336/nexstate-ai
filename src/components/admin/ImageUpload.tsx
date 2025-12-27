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
        <div className="space-y-6">
            {/* Cover Image Section */}
            <div className="space-y-2">
                <Label className="text-base font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Cover Image
                </Label>

                {!coverImage ? (
                    <div className="relative h-48 w-full md:w-1/2 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer bg-card">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUpload(e, true)}
                            disabled={uploading}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        {uploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        ) : (
                            <ImagePlus className="w-8 h-8 text-muted-foreground" />
                        )}
                        <span className="text-sm text-muted-foreground font-medium">
                            {uploading ? "Uploading..." : "Upload Cover Image"}
                        </span>
                    </div>
                ) : (
                    <div className="relative h-64 w-full md:w-1/2 rounded-lg overflow-hidden border bg-muted group">
                        <Image
                            src={coverImage}
                            alt="Cover"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            Cover Image
                        </div>
                        <button
                            type="button"
                            onClick={() => removeImage(0)}
                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Gallery Images Section */}
            <div className="space-y-2">
                <Label className="text-base font-medium">Gallery Images</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((url, index) => {
                        // Actual index in the main 'images' array is index + 1
                        const realIndex = index + 1;
                        return (
                            <div key={url} className="relative aspect-square rounded-lg overflow-hidden border bg-muted group">
                                <Image
                                    src={url}
                                    alt={`Gallery ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(realIndex)}
                                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}

                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer bg-card">
                        <input
                            type="file"
                            accept="image/*"
                            multiple // Allow multiple files
                            onChange={(e) => handleUpload(e, false)}
                            disabled={uploading}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        {uploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        ) : (
                            <ImagePlus className="w-6 h-6 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground font-medium text-center px-2">
                            {uploading ? "..." : "Add More"}
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-xs text-muted-foreground">
                First upload sets the cover image. Subsequent uploads add to the gallery.
            </p>
        </div>
    );
}
