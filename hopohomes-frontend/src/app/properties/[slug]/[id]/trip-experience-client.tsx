"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Plus, Minus, Camera, Heart, Share2, Bookmark, Bed, Bath, Square, Car, Shield, MapPin, Clock, Flag, Star, Check, Calendar as CalendarIcon } from 'lucide-react';
import Link from 'next/link';
import { EnquiryDialog } from '@/components/enquiry-dialog';
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface TripData {
  title: string;
  images: string[];
  summary: {
    location: string;
    propertyType: string;
    bedrooms: string;
    bathrooms?: string;
    area?: string;
    parking?: string;
  };
  highlights: { icon: string; text: string }[];
  description: string;
  propertyRooms: {
    room: string;
    description: string;
    images: string[];
    amenities: string[];
  }[];
  insideAmenities: { icon: string; text: string }[];
  outsideAmenities: { icon: string; text: string }[];
  availableFor: { icon: string; label: string; description: string }[];
  essentials: { icon: string; label: string }[];
  faqs: string[];
  pricing: {
    from: number;
    currency: string;
    availableDates: {
      dates: string;
      price: number;
      available: boolean;
      selected: boolean;
    }[];
  };
}

interface TripExperienceClientProps {
  trip: TripData;
  slug: string;
  id: string;
}

export default function TripExperienceClient({ trip, slug, id }: TripExperienceClientProps) {
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date(2023, 8, 11));
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(new Date(2023, 8, 20));
  const [guests, setGuests] = useState(3);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedCancellation, setSelectedCancellation] = useState<'non-refundable' | 'refundable'>('non-refundable');

  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Image zoom modal state
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Open zoom modal with selected image
  const openZoomModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomModalOpen(true);
  };

  // Navigate to previous image
  const goToPreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? trip.images.length - 1 : prev - 1));
  };

  // Navigate to next image
  const goToNextImage = () => {
    setSelectedImageIndex((prev) => (prev === trip.images.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomModalOpen) return;
      if (e.key === 'Escape') setIsZoomModalOpen(false);
      if (e.key === 'ArrowLeft') goToPreviousImage();
      if (e.key === 'ArrowRight') goToNextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomModalOpen]);

  const toggleRoom = (roomName: string) => {
    setExpandedRoom(expandedRoom === roomName ? null : roomName);
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const selectDateOption = (index: number) => {
    setSelectedDateIndex(index);
  };

  return (
    <>
      {/* Image Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsZoomModalOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50 text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
            {selectedImageIndex + 1} / {trip.images.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPreviousImage();
            }}
            className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          {/* Main Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[80vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={trip.images[selectedImageIndex]}
              alt={`Property image ${selectedImageIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNextImage();
            }}
            className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-xl max-w-[90vw] overflow-x-auto">
            {trip.images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(index);
                }}
                className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${selectedImageIndex === index
                  ? 'ring-2 ring-white scale-105'
                  : 'opacity-60 hover:opacity-100'
                  }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-[1400px] w-full mx-auto px-4 xl:px-6 py-8 relative flex flex-col">

        {/* Two Column Layout - Gallery Left, Sidebar Right */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column - Gallery & Content */}
          <div className="flex-1 flex flex-col min-w-0 pt-[4rem]">

            {/* Image Gallery - Dynamic Layout Based on Image Count */}
            <div className="flex overflow-hidden relative h-[380px] rounded-2xl gap-2">
              {/* Desktop Gallery - Dynamic based on image count */}
              <div className="hidden w-full h-full lg:flex gap-2">

                {/* 1 Image Layout */}
                {trip.images.length === 1 && (
                  <div
                    className="w-full relative rounded-2xl overflow-hidden"
                    onClick={() => openZoomModal(0)}
                  >
                    <Image
                      src={trip.images[0]}
                      alt="Property image"
                      fill
                      className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    />
                    <Link
                      href={`/properties/${slug}/${id}/photo`}
                      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-black font-medium hover:bg-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Camera className="w-4 h-4" />
                      <span>View photos</span>
                    </Link>
                  </div>
                )}

                {/* 2 Images Layout - Side by side */}
                {trip.images.length === 2 && (
                  <>
                    <div
                      className="w-1/2 relative rounded-xl overflow-hidden"
                      onClick={() => openZoomModal(0)}
                    >
                      <Image
                        src={trip.images[0]}
                        alt="Property image 1"
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div
                      className="w-1/2 relative rounded-xl overflow-hidden"
                      onClick={() => openZoomModal(1)}
                    >
                      <Image
                        src={trip.images[1]}
                        alt="Property image 2"
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                      <Link
                        href={`/properties/${slug}/${id}/photo`}
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-black font-medium hover:bg-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Camera className="w-4 h-4" />
                        <span>See all</span>
                      </Link>
                    </div>
                  </>
                )}

                {/* 3 Images Layout - 1 large left + 2 stacked right (like reference image) */}
                {trip.images.length === 3 && (
                  <>
                    <div
                      className="w-1/2 relative rounded-xl overflow-hidden"
                      onClick={() => openZoomModal(0)}
                    >
                      <Image
                        src={trip.images[0]}
                        alt="Main property image"
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="w-1/2 flex flex-col gap-2">
                      <div
                        className="flex-1 relative rounded-xl overflow-hidden"
                        onClick={() => openZoomModal(1)}
                      >
                        <Image
                          src={trip.images[1]}
                          alt="Property image 2"
                          fill
                          className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div
                        className="flex-1 relative rounded-xl overflow-hidden"
                        onClick={() => openZoomModal(2)}
                      >
                        <Image
                          src={trip.images[2]}
                          alt="Property image 3"
                          fill
                          className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                        <Link
                          href={`/properties/${slug}/${id}/photo`}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 text-white font-medium hover:bg-black/50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Camera className="w-5 h-5" />
                          <span>See all</span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}

                {/* 4 Images Layout - 1 large left + 1 top right + 2 bottom right */}
                {trip.images.length === 4 && (
                  <>
                    <div
                      className="w-1/2 relative rounded-xl overflow-hidden"
                      onClick={() => openZoomModal(0)}
                    >
                      <Image
                        src={trip.images[0]}
                        alt="Main property image"
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="w-1/2 flex flex-col gap-2">
                      <div
                        className="flex-1 relative rounded-xl overflow-hidden"
                        onClick={() => openZoomModal(1)}
                      >
                        <Image
                          src={trip.images[1]}
                          alt="Property image 2"
                          fill
                          className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 flex gap-2">
                        <div
                          className="flex-1 relative rounded-xl overflow-hidden"
                          onClick={() => openZoomModal(2)}
                        >
                          <Image
                            src={trip.images[2]}
                            alt="Property image 3"
                            fill
                            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div
                          className="flex-1 relative rounded-xl overflow-hidden"
                          onClick={() => openZoomModal(3)}
                        >
                          <Image
                            src={trip.images[3]}
                            alt="Property image 4"
                            fill
                            className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                          />
                          <Link
                            href={`/properties/${slug}/${id}/photo`}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 text-white font-medium hover:bg-black/50 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Camera className="w-5 h-5" />
                            <span>See all</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 5+ Images Layout - 1 large left + 2x2 grid right */}
                {trip.images.length >= 5 && (
                  <>
                    <div
                      className="w-1/2 relative rounded-xl overflow-hidden"
                      onClick={() => openZoomModal(0)}
                    >
                      <Image
                        src={trip.images[0]}
                        alt="Main property image"
                        fill
                        className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-2">
                      <div
                        className="relative rounded-xl overflow-hidden"
                        onClick={() => openZoomModal(1)}
                      >
                        <Image
                          src={trip.images[1]}
                          alt="Gallery image 2"
                          fill
                          className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div
                        className="relative rounded-xl overflow-hidden"
                        onClick={() => openZoomModal(2)}
                      >
                        <Image
                          src={trip.images[2]}
                          alt="Gallery image 3"
                          fill
                          className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div
                        className="relative rounded-xl overflow-hidden"
                        onClick={() => openZoomModal(3)}
                      >
                        <Image
                          src={trip.images[3]}
                          alt="Gallery image 4"
                          fill
                          className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div
                        className="relative rounded-xl overflow-hidden"
                        onClick={() => openZoomModal(4)}
                      >
                        <Image
                          src={trip.images[4]}
                          alt="Gallery image 5"
                          fill
                          className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                        <Link
                          href={`/properties/${slug}/${id}/photo`}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 text-white font-medium hover:bg-black/50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Camera className="w-5 h-5" />
                          <span>See all</span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Gallery - Dynamic */}
              <div className="flex-1 w-full h-full flex gap-1 lg:hidden">
                {trip.images.length === 1 ? (
                  <div
                    className="w-full relative rounded-2xl overflow-hidden"
                    onClick={() => openZoomModal(0)}
                  >
                    <Image
                      src={trip.images[0]}
                      alt="Property image"
                      fill
                      className="object-cover cursor-pointer"
                    />
                    <Link
                      href={`/properties/${slug}/${id}/photo`}
                      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-black text-sm font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Camera className="w-4 h-4" />
                      <span>View</span>
                    </Link>
                  </div>
                ) : trip.images.length === 2 ? (
                  <>
                    <div
                      className="flex-1 relative rounded-l-2xl overflow-hidden"
                      onClick={() => openZoomModal(0)}
                    >
                      <Image
                        src={trip.images[0]}
                        alt="Property image 1"
                        fill
                        className="object-cover cursor-pointer"
                      />
                    </div>
                    <div
                      className="flex-1 relative rounded-r-2xl overflow-hidden"
                      onClick={() => openZoomModal(1)}
                    >
                      <Image
                        src={trip.images[1]}
                        alt="Property image 2"
                        fill
                        className="object-cover cursor-pointer"
                      />
                      <Link
                        href={`/properties/${slug}/${id}/photo`}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 text-white text-sm font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Camera className="w-4 h-4" />
                        <span>See all</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 grid grid-cols-1 grid-rows-2 gap-1">
                      <div
                        className="flex-1 relative rounded-tl-2xl rounded-bl-2xl overflow-hidden"
                        onClick={() => openZoomModal(0)}
                      >
                        <Image
                          src={trip.images[0]}
                          alt="Gallery image 1"
                          fill
                          className="object-cover cursor-pointer"
                        />
                      </div>
                      {trip.images[1] && (
                        <div
                          className="flex-1 relative overflow-hidden"
                          onClick={() => openZoomModal(1)}
                        >
                          <Image
                            src={trip.images[1]}
                            alt="Gallery image 2"
                            fill
                            className="object-cover cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 grid grid-cols-1 grid-rows-2 gap-1">
                      {trip.images[2] && (
                        <div
                          className="flex-1 relative rounded-tr-2xl overflow-hidden"
                          onClick={() => openZoomModal(2)}
                        >
                          <Image
                            src={trip.images[2]}
                            alt="Gallery image 3"
                            fill
                            className="object-cover cursor-pointer"
                          />
                        </div>
                      )}
                      <div
                        className="flex-1 relative rounded-br-2xl overflow-hidden"
                        onClick={() => openZoomModal(trip.images.length > 3 ? 3 : trip.images.length - 1)}
                      >
                        <Image
                          src={trip.images[trip.images.length > 3 ? 3 : trip.images.length - 1]}
                          alt="Gallery image 4"
                          fill
                          className="object-cover cursor-pointer"
                        />
                        <Link
                          href={`/properties/${slug}/${id}/photo`}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 text-white text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Camera className="w-4 h-4" />
                          <span>See all</span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Property Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{trip.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{trip.summary.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Share Button */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:border-foreground/50 hover:bg-secondary/50 transition-all">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Share</span>
                </button>

                {/* Bookmark Button */}
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${isSaved
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border hover:border-foreground/50 hover:bg-secondary/50'
                    }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-primary' : ''}`} />
                  <span className="text-sm font-medium">{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                {/* Rating */}
                <div className="flex items-center gap-1 px-3 py-2 bg-secondary/50 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
            </div>

            {/* Property Stats - Matching Reference Image */}
            <div className="flex flex-wrap md:flex-nowrap items-stretch mt-6 border border-border rounded-xl bg-background overflow-hidden">
              {/* Bedroom */}
              <div className="flex-1 min-w-[120px] p-4 flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Bedroom</span>
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{trip.summary.bedrooms}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-border"></div>

              {/* Bathroom */}
              <div className="flex-1 min-w-[120px] p-4 flex flex-col gap-1 border-t md:border-t-0 border-border">
                <span className="text-sm text-muted-foreground">Bathroom</span>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{trip.summary.bathrooms || 'Three'}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-border"></div>

              {/* Area */}
              <div className="flex-1 min-w-[120px] p-4 flex flex-col gap-1 border-t md:border-t-0 border-border">
                <span className="text-sm text-muted-foreground">Area</span>
                <div className="flex items-center gap-2">
                  <Square className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{trip.summary.area || '1,024 ft'}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-border"></div>

              {/* Parking */}
              <div className="flex-1 min-w-[120px] p-4 flex flex-col gap-1 border-t md:border-t-0 border-border">
                <span className="text-sm text-muted-foreground">Parking</span>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">{trip.summary.parking || 'Indoor'}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-border"></div>

              {/* Area Safety */}
              <div className="flex-1 min-w-[140px] p-4 flex flex-col gap-1 border-t md:border-t-0 border-border">
                <span className="text-sm text-muted-foreground">Area safety</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-4 h-4 rounded bg-yellow-200"></div>
                  <div className="w-4 h-4 rounded bg-yellow-300"></div>
                  <div className="w-4 h-4 rounded bg-green-300"></div>
                  <div className="w-4 h-4 rounded bg-green-400"></div>
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px my-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">Description</h2>
              <div className="relative w-full">
                <div className={`transition-all duration-300 ease-in-out ${isDescriptionExpanded ? 'max-h-none' : 'max-h-20 overflow-hidden'
                  }`}>
                  <p className="text-muted-foreground leading-relaxed">
                    {trip.description}
                  </p>
                  {!isDescriptionExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none"></div>
                  )}
                </div>
                <button
                  onClick={toggleDescription}
                  className="mt-2 text-primary hover:underline transition-colors duration-200 font-medium text-sm"
                >
                  {isDescriptionExpanded ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px my-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Property Highlights */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold">Property Highlights</h2>
              <ul className="list-none w-full flex flex-col gap-4">
                {trip.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-lg">{highlight.icon}</span>
                    <div className="flex flex-col gap-1 mt-0.5">
                      <span>{highlight.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            {/* <div className="w-full h-px my-8">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Rooms & Features</h2>
            <div className="w-full flex flex-col gap-0">
              {trip.propertyRooms.map((room, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleRoom(room.room)}
                    className="w-full flex flex-1 items-center justify-between py-4 transition-all text-left hover:bg-muted/50 rounded-lg px-2"
                  >
                    <div className="flex flex-col gap-2 items-start text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded-full">
                          {room.room}
                        </span>
                      </div>
                      <h3 className="font-semibold">{room.description}</h3>
                    </div>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expandedRoom === room.room ? 'rotate-180' : ''
                      }`} />
                  </button>

                 
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedRoom === room.room ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-2 pb-4">
                      
                      {room.images && room.images.length > 0 && (
                        <div className={`grid gap-2 mb-4 ${room.images.length === 1 ? 'grid-cols-1' :
                          room.images.length === 2 ? 'grid-cols-2' :
                            'grid-cols-3'
                          }`}>
                          {room.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="relative h-32 rounded-lg overflow-hidden">
                              <Image
                                src={image}
                                alt={`${room.room} - Image ${imgIndex + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                     
                      <ul className="space-y-2">
                        {room.amenities.map((amenity, amenityIndex) => (
                          <li key={amenityIndex} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span>
                            <span className="text-sm text-muted-foreground leading-relaxed">{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {index < trip.propertyRooms.length - 1 && (
                    <div className="w-full my-3 h-px">
                      <div className="h-px bg-border opacity-50" style={{
                        backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 8px, transparent 8px, transparent 13px)'
                      }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div> */}

            {/* Divider */}
            <div className="w-full h-px my-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Amenities */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col flex-1 gap-6">
                <h2 className="text-xl font-semibold">Inside Amenities</h2>
                <ul className="list-none w-full flex flex-col gap-4">
                  {trip.insideAmenities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div className="flex flex-col gap-1 mt-0.5">
                        <span>{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="w-full h-px block my-2 md:hidden">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              </div>

              <div className="flex flex-col flex-1 gap-6">
                <h2 className="text-xl font-semibold">Outside Amenities</h2>
                <ul className="list-none w-full flex flex-col gap-4">
                  {trip.outsideAmenities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div className="flex flex-col gap-1 mt-0.5">
                        <span>{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px my-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Available For */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold">Available For</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trip.availableFor.map((item, index) => (
                  <div key={index} className="rounded-lg border border-border p-4 flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold">{item.label}</h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px my-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Essentials Provided */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold">Essentials Provided</h2>
              <div className="flex flex-wrap gap-2">
                {trip.essentials.map((item, index) => (
                  <div key={index} className="rounded-full border border-border px-3 py-2 flex items-center gap-1">
                    <span>{item.icon}</span>
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px my-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* Properties available in the same area */}
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold">Properties available in the same area</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((_, index) => (
                  <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer">
                    <Image
                      src={trip.images[index] || trip.images[0]}
                      alt={`Related property ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px my-8">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            {/* FAQs */}
            {/* <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">FAQs</h2>
            <div className="w-full flex flex-col gap-0">
              {[
                {
                  question: "How can I get the listed room for rent?",
                  answer: (
                    <div className="text-muted-foreground space-y-3">
                      <p>HOPO is glad that you are interested in joining one of their homes</p>
                      <p>The first step is to check out all the details of the listing and hit the Book Now button to reserve a room immediately by providing all your details in provided form.</p>
                      <p>After arranging details about your stay (location, room type preference, etc.) we will ask you to send us the required documents such as passport, visa & emirates id as part of our normal identity verification procedure.</p>
                    </div>
                  )
                },
                {
                  question: "What is included and excluded in the rent amount?",
                  answer: (
                    <div className="text-muted-foreground space-y-3">
                      <p className="font-medium text-foreground">Rent Includes:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Your stay in a fully furnished apartment / villa.</li>
                        <li>Abundant and well-decorated shared spaces</li>
                        <li>All utility costs including DEWA (Water & Electricity), unlimited high speed Wi-Fi, Chiller.</li>
                        <li>Weekly cleaning</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "How can I pay my monthly rents?",
                  answer: (
                    <p className="text-muted-foreground">Rent should be paid online to HOPO via the app / website or tenant can also do direct bank transfer or cash deposit via the cash deposit machine.</p>
                  )
                },
                {
                  question: "Whom should I contact if there are any issues in this house?",
                  answer: (
                    <p className="text-muted-foreground">A request can be raised via the HOPO Homes app dashboard under the raise maintenance request section. The request is normally resolved within 24 to 72 hours of report.</p>
                  )
                },
              ].map((faq, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex flex-1 items-center justify-between py-4 transition-all text-left hover:bg-muted/50 rounded-lg px-2"
                  >
                    <h3 className="font-semibold text-left pr-4">{faq.question}</h3>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expandedFAQ === index ? 'rotate-180' : ''
                      }`} />
                  </button>

                
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedFAQ === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-2 pb-4">
                      {faq.answer}
                    </div>
                  </div>

                  {index < 3 && (
                    <div className="w-full my-3 h-px">
                      <div className="h-px bg-border opacity-50" style={{
                        backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 8px, transparent 8px, transparent 13px)'
                      }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div> */}
          </div>

          {/* Right Sidebar - Booking Card (Sticky) - Compact */}
          <div className="hidden lg:block w-[340px] shrink-0">
            <div className="sticky top-24">
              <div className="flex rounded-xl overflow-hidden flex-col border bg-background border-border shadow-lg">
                <div className="flex flex-col p-4">
                  {/* Property Name & Tags */}
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-foreground">{trip.title.split(' ').slice(0, 2).join(' ')}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">Self check in</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">Superhost</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">Great location</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-xl font-bold text-primary">
                      {trip.pricing.currency} {trip.pricing.from.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm ml-1">/Monthly</span>
                  </div>

                  {/* Check In / Check Out */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="border border-border rounded-lg p-2">
                      <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide block mb-1">Check In</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"ghost"}
                            className={cn(
                              "w-full justify-start text-left font-medium text-xs h-auto p-0 hover:bg-transparent",
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0" />
                            {checkInDate ? format(checkInDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="border border-border rounded-lg p-2">
                      <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide block mb-1">Check Out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"ghost"}
                            className={cn(
                              "w-full justify-start text-left font-medium text-xs h-auto p-0 hover:bg-transparent",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0" />
                            {checkOutDate ? format(checkOutDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Guests */}
                  {/* Guests */}
                  <div className="border border-border rounded-lg p-2 mb-3">
                    <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide block mb-1">Guests</label>
                    <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                      <SelectTrigger className="w-full border-0 p-0 h-auto text-xs font-medium focus:ring-0 shadow-none [&>span]:line-clamp-1">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Guests</SelectLabel>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Guest{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cancellation Policies */}
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold mb-2">Cancellation Policies</h4>

                    {/* Non-Refundable */}
                    <div
                      onClick={() => setSelectedCancellation('non-refundable')}
                      className={`border rounded-lg p-2 mb-1.5 cursor-pointer transition-all ${selectedCancellation === 'non-refundable'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-foreground/30'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selectedCancellation === 'non-refundable' ? 'border-primary bg-primary' : 'border-border'
                            }`}>
                            {selectedCancellation === 'non-refundable' && <Check className="w-2 h-2 text-white" />}
                          </div>
                          <span className="font-medium text-xs">Non-Refundable</span>
                        </div>
                        <span className="text-xs font-semibold">{trip.pricing.currency} {trip.pricing.from}</span>
                      </div>
                    </div>

                    {/* Refundable */}
                    {/* <div
                    onClick={() => setSelectedCancellation('refundable')}
                    className={`border rounded-lg p-2 cursor-pointer transition-all ${selectedCancellation === 'refundable'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-foreground/30'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selectedCancellation === 'refundable' ? 'border-primary bg-primary' : 'border-border'
                          }`}>
                          {selectedCancellation === 'refundable' && <Check className="w-2 h-2 text-white" />}
                        </div>
                        <span className="font-medium text-xs">Refundable</span>
                      </div>
                      <span className="text-xs font-semibold">{trip.pricing.currency} {Math.round(trip.pricing.from * 1.1)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-5 mt-1">Free cancellation before sep21</p>
                  </div> */}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between py-2.5 border-t border-border">
                    <span className="text-xs font-medium">Total Before Taxes:</span>
                    <span className="text-base font-bold">
                      {trip.pricing.currency} {selectedCancellation === 'refundable' ? Math.round(trip.pricing.from * 1.1) : trip.pricing.from}
                    </span>
                  </div>

                  {/* Reserve Button */}
                  <Button
                    onClick={() => setIsEnquiryOpen(true)}
                    className="w-full h-10 bg-foreground hover:bg-foreground/90 text-background rounded-full font-semibold shadow-md transition-all duration-200 mt-1 text-sm"
                  >
                    Reserve
                  </Button>
                </div>

                {/* Bottom Info */}
                {/* <div className="flex flex-col gap-2 p-3 bg-secondary/30 border-t border-border">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Only 6 hours left</span>, bookings close soon.
                  </p>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Flag className="w-3.5 h-3.5" />
                  Report this listing
                </button>
              </div> */}
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t border-border p-4 z-50 flex items-center justify-between  safe-area-bottom">
            <div>
              <span className="text-lg font-bold text-primary">
                {trip.pricing.currency} {trip.pricing.from.toLocaleString()}
              </span>
              <span className="text-muted-foreground">/Monthly</span>
            </div>
            <Button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="h-11 px-6 bg-foreground hover:bg-foreground/90 text-background rounded-full font-semibold flex items-center gap-2"
            >
              <span>Reserve</span>
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Booking Drawer Overlay */}
          {isMobileDrawerOpen && (
            <div className="fixed inset-0 z-[60] lg:hidden">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsMobileDrawerOpen(false)}
              ></div>

              {/* Drawer Content */}
              <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
                {/* Handle */}
                <div
                  className="w-full flex items-center justify-center pt-4 pb-2 cursor-pointer"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <div className="w-16 h-1.5 bg-muted rounded-full"></div>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto px-6 pt-2 pb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Booking Details</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-secondary/50" onClick={() => setIsMobileDrawerOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-primary">
                      {trip.pricing.currency} {trip.pricing.from.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground ml-2 text-lg">/Monthly</span>
                  </div>

                  {/* Check In / Check Out */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="border border-border rounded-xl p-3">
                      <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Check In</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"ghost"}
                            className={cn(
                              "w-full justify-start text-left font-medium text-sm h-auto p-0 hover:bg-transparent",
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                            {checkInDate ? format(checkInDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[70]" align="start">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="border border-border rounded-xl p-3">
                      <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Check Out</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"ghost"}
                            className={cn(
                              "w-full justify-start text-left font-medium text-sm h-auto p-0 hover:bg-transparent",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                            {checkOutDate ? format(checkOutDate, "dd/MM/yyyy") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[70]" align="end">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="border border-border rounded-xl p-3 mb-5">
                    <label className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide block mb-1.5">Guests</label>
                    <Select value={guests.toString()} onValueChange={(value) => setGuests(parseInt(value))}>
                      <SelectTrigger className="w-full border-0 p-0 h-auto text-sm font-medium focus:ring-0 shadow-none [&>span]:line-clamp-1">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent className="z-[70]">
                        <SelectGroup>
                          <SelectLabel>Guests</SelectLabel>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Guest{num > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cancellation Policies */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold mb-3">Cancellation Policies</h4>

                    {/* Non-Refundable */}
                    <div
                      onClick={() => setSelectedCancellation('non-refundable')}
                      className={`border rounded-xl p-3 mb-2 cursor-pointer transition-all ${selectedCancellation === 'non-refundable'
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedCancellation === 'non-refundable' ? 'border-primary bg-primary' : 'border-border'
                            }`}>
                            {selectedCancellation === 'non-refundable' && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="font-medium text-sm">Non-Refundable</span>
                        </div>
                        <span className="text-sm font-semibold">{trip.pricing.currency} {trip.pricing.from}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border bg-background pb-8 safe-area-bottom">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">Total Estimate</span>
                    <span className="text-xl font-bold">
                      {trip.pricing.currency} {selectedCancellation === 'refundable' ? Math.round(trip.pricing.from * 1.1) : trip.pricing.from}
                    </span>
                  </div>

                  <Button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      setTimeout(() => setIsEnquiryOpen(true), 300);
                    }}
                    className="w-full h-12 text-base bg-foreground hover:bg-foreground/90 text-background rounded-full font-bold shadow-md"
                  >
                    Reserve
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
        <EnquiryDialog
          isOpen={isEnquiryOpen}
          onClose={() => setIsEnquiryOpen(false)}
          propertyId={id}
          propertyTitle={trip.title}
        // Pass collected data to enquiry dialog if supported, or just open it
        />
      </div>
    </>
  );
}
