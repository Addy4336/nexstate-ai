"use client";

import { useState } from "react";
import { ImageUpload } from "./ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createProperty } from "@/actions/property-actions";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function PropertyForm() {
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        // Add images to formData manually
        formData.set("images", images.join(","));

        try {
            const result = await createProperty(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Property created successfully!");
            }
        } catch (e: any) {
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
                    <Input id="title" name="title" placeholder="e.g. Luxury Apartment in Marina" required />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Detailed description of the property..."
                        className="h-32"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price (Monthly Rent AED)</Label>
                    <Input id="price" name="price" type="number" step="0.01" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" placeholder="e.g. Dubai Marina" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input id="bedrooms" name="bedrooms" type="number" min="0" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input id="bathrooms" name="bathrooms" type="number" min="0" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="area_sqft">Area (sqft)</Label>
                    <Input id="area_sqft" name="area_sqft" type="number" min="0" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue="available">
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="sold">Sold</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2 md:col-span-2">
                    <Switch id="featured" name="featured" />
                    <Label htmlFor="featured">Featured Property</Label>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label>Property Images</Label>
                    <ImageUpload onImagesChange={setImages} />
                    <p className="text-sm text-muted-foreground">
                        First image will be the cover image.
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    Create Property
                </Button>
            </div>
        </form>
    );
}
