"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createProperty, updateProperty } from "@/actions/property-actions";
import { Loader2, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PROPERTY_AMENITIES } from "@/types/property";
import { Badge } from "@/components/ui/badge";

interface PropertyFormProps {
    initialData?: any; // Define proper type if available
}

export function PropertyForm({ initialData }: PropertyFormProps) {
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(initialData?.title || "");
    const [folderId, setFolderId] = useState(initialData?.drive_folder_id || "");
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);
    const router = useRouter();

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev =>
            prev.includes(amenity)
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        formData.set("images", images.join(","));
        formData.set("folderId", folderId);
        formData.set("amenities", selectedAmenities.join(","));

        try {
            let result;
            if (initialData?.id) {
                result = await updateProperty(initialData.id, formData);
            } else {
                result = await createProperty(formData);
            }

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success(initialData ? "Property updated!" : "Property created!");
                router.push("/admin/properties");
            }
        } catch (e: any) {
            console.error("Form error:", e);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Luxury Apartment in Marina"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        This title will be used to create a folder in Google Drive for your images.
                    </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Detailed description of the property..."
                        className="h-32"
                        defaultValue={initialData?.description}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price (Monthly Rent AED)</Label>
                    <Input id="price" name="price" type="number" step="0.01" required defaultValue={initialData?.price} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="e.g. Dubai Marina" required defaultValue={initialData?.location} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input id="bedrooms" name="bedrooms" type="number" min="0" required defaultValue={initialData?.bedrooms} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input id="bathrooms" name="bathrooms" type="number" min="0" required defaultValue={initialData?.bathrooms} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="area_sqft">Area (sqft)</Label>
                    <Input id="area_sqft" name="area_sqft" type="number" min="0" required defaultValue={initialData?.area_sqft} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={initialData?.status || "available"}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                    <Switch id="featured" name="featured" defaultChecked={initialData?.featured} />
                    <Label htmlFor="featured">Featured Property</Label>
                </div>

                {/* Amenities Section */}
                <div className="space-y-3 md:col-span-2">
                    <Label>Amenities</Label>
                    <p className="text-xs text-muted-foreground">
                        Select the amenities available at this property
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {PROPERTY_AMENITIES.map((amenity) => {
                            const isSelected = selectedAmenities.includes(amenity);
                            return (
                                <Badge
                                    key={amenity}
                                    variant={isSelected ? "default" : "outline"}
                                    className={`cursor-pointer transition-all ${
                                        isSelected 
                                            ? "bg-primary text-primary-foreground" 
                                            : "hover:bg-muted"
                                    }`}
                                    onClick={() => toggleAmenity(amenity)}
                                >
                                    {isSelected && <Check className="w-3 h-3 mr-1" />}
                                    {amenity}
                                </Badge>
                            );
                        })}
                    </div>
                    {selectedAmenities.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                            {selectedAmenities.length} amenities selected
                        </p>
                    )}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <ImageUpload
                        onImagesChange={setImages}
                        onFolderIdChange={setFolderId}
                        defaultImages={initialData?.images}
                        folderName={title}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    {initialData ? "Update Property" : "Create Property"}
                </Button>
            </div>
        </form>
    );
}
