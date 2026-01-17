"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Minus, Camera } from 'lucide-react';
import Link from 'next/link';

export interface TripData {
  title: string;
  images: string[];
  summary: {
    location: string;
    propertyType: string;
    bedrooms: string;
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
}

export default function TripExperienceClient({ trip }: TripExperienceClientProps) {
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);

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
    <div className="max-w-[1224px] w-full mx-auto px-4 xl:px-0 py-8 relative flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl md:text-4xl font-bold">{trip.title}</h1>
      </div>

      {/* Image Gallery */}
      <div className="flex overflow-hidden relative my-6 h-[440px] rounded-2xl">
        {/* Desktop Gallery */}
        <div className="hidden flex-1 w-full h-full lg:flex gap-2">
          <div className="w-1/4 relative">
            <Image 
              src={trip.images[0]} 
              alt="Gallery image 1" 
              fill
              className="object-cover cursor-pointer"
            />
          </div>
          <div className="w-1/4 relative">
            <Image 
              src={trip.images[1]} 
              alt="Gallery image 2" 
              fill
              className="object-cover cursor-pointer"
            />
          </div>
          <div className="w-1/4 grid grid-cols-1 grid-rows-2 gap-1 lg:gap-2">
            <div className="flex-1 relative">
              <Image 
                src={trip.images[2]} 
                alt="Gallery image 3" 
                fill
                className="object-cover cursor-pointer"
              />
            </div>
            <div className="flex-1 relative">
              <Image 
                src={trip.images[3]} 
                alt="Gallery image 4" 
                fill
                className="object-cover cursor-pointer"
              />
            </div>
          </div>
          <div className="w-1/4 relative">
            <Image 
              src={trip.images[4]} 
              alt="Gallery image 5" 
              fill
              className="object-cover cursor-pointer"
            />
          </div>
        </div>

        {/* Mobile Gallery */}
        <div className="flex-1 w-full h-full flex gap-1 lg:hidden">
          <div className="flex-1 grid grid-cols-1 grid-rows-2 gap-1">
            <div className="flex-1 relative">
              <Image 
                src={trip.images[0]} 
                alt="Gallery image 1" 
                fill
                className="object-cover cursor-pointer"
              />
            </div>
            <div className="flex-1 relative">
              <Image 
                src={trip.images[1]} 
                alt="Gallery image 2" 
                fill
                className="object-cover cursor-pointer"
              />
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 grid-rows-2 gap-1">
            <div className="flex-1 relative">
              <Image 
                src={trip.images[2]} 
                alt="Gallery image 3" 
                fill
                className="object-cover cursor-pointer"
              />
            </div>
            <div className="flex-1 relative">
              <Image 
                src={trip.images[3]} 
                alt="Gallery image 4" 
                fill
                className="object-cover cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* See All Button */}
        <button className="absolute z-10 bottom-4 right-4 bg-white text-black text-xs px-2 py-1 h-7 rounded-full shadow-lg flex items-center space-x-1">
          <Camera className="w-3 h-3" />
          <span className="font-medium">See all</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 py-2">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Summary */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">Property Overview</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{trip.summary.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">Property Type</p>
                  <p className="font-medium">{trip.summary.propertyType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">Bedrooms</p>
                  <p className="font-medium">{trip.summary.bedrooms}</p>
                </div>
              </div>
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
          <div className="w-full h-px my-8">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          {/* About this property */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold">About this property</h2>
            <div className="relative w-full">
              <div className={`transition-all duration-300 ease-in-out ${
                isDescriptionExpanded ? 'max-h-none' : 'max-h-24 overflow-hidden'
              }`}>
                <p className="text-foreground leading-relaxed">
                  {trip.description}
                </p>
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none"></div>
                )}
              </div>
              {/* <button 
                onClick={toggleDescription}
                className="mt-2 underline hover:text-primary transition-colors duration-200 font-medium"
              >
                {isDescriptionExpanded ? 'View Less' : 'View More'}
              </button> */}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px my-8">
            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>

          {/* Property Rooms & Features */}
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
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      expandedRoom === room.room ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Accordion Content */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedRoom === room.room ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-2 pb-4">
                      {/* Room Images */}
                      {room.images && room.images.length > 0 && (
                        <div className={`grid gap-2 mb-4 ${
                          room.images.length === 1 ? 'grid-cols-1' :
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
                      
                      {/* Room Amenities */}
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
          </div>

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



          {/* FAQs */}
          <div className="flex flex-col gap-6">
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
                      <p>You will then be able to visit the home (virtually or physically for a prebooking) and sign your lease online.</p>
                      <p>Alternatively, you can provide your preferred time and date for viewing the apartment for rent. HOPO's team of community managers shall provide you with virtual or physically assisted viewing and if you like the place then you can book the place online by paying a small token fee of 30 percent of the rent agreed.</p>
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
                        <li>A tech-friendly co-living environment (access to our mobile application)</li>
                        <li>All utility costs including DEWA (Water & Electricity), unlimited high speed Wi-Fi, Chiller.</li>
                        <li>Weekly cleaning</li>
                        <li>Regular maintenance & pest control</li>
                        <li>Monthly & Quarterly community events</li>
                        <li>New mates</li>
                      </ul>
                      <p className="font-medium text-foreground mt-4">Rent Excludes:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Food, groceries, utilities and Other Miscellaneous living expenses</li>
                      </ul>
                    </div>
                  )
                },
                {
                  question: "How can I pay my monthly rents?",
                  answer: (
                    <p className="text-muted-foreground">Rent should be paid online to HOPO via the app / website or tenant can also do direct bank transfer or cash deposit via the cash deposit machine. Our community managers are always available to help you in case you face any issues while making any online or offline payment.</p>
                  )
                },
                {
                  question: "Whom should I contact if there are any issues in this house?",
                  answer: (
                    <p className="text-muted-foreground">A request can be raised via the HOPO Homes app dashboard under the raise maintenance request section. The request is normally resolved within 24 to 72 hours of report.</p>
                  )
                },
                {
                  question: "Why do you charge Security Deposit and who will refund it?",
                  answer: (
                    <p className="text-muted-foreground">HOPO shall charge a minimal security deposit in order to protect its assets inside the home and to avoid overstays after the informed move out date. HOPO will fully refund your security deposit within 7-10 working days directly to your stated bank account (preferred method) or in cash /cheque after deducting cost of damage and other charges, if applicable.</p>
                  )
                },
                {
                  question: "How long can I stay in a house?",
                  answer: (
                    <p className="text-muted-foreground">The minimum length of a stay is 1 month. If you need a shorter stay then a month you can contact any of our community manager and he / she shall be happy to assist you.</p>
                  )
                },
                {
                  question: "What happens in case I decide to cancel my booking before my move in date?",
                  answer: (
                    <p className="text-muted-foreground">In case the booking is cancelled before your move in date any amount paid by you shall be refunded to same account or card except 30% of the monthly rent charged initially to reserve the room at first place.</p>
                  )
                },
                {
                  question: "Is house and room viewing available in person before the actual move-in date?",
                  answer: (
                    <p className="text-muted-foreground">Yes, you can surely schedule a visit before your move in. And in case you have any specific queries, our Community Manager shall be happy to answer.</p>
                  )
                },
                {
                  question: "Whom are you going to live with?",
                  answer: (
                    <p className="text-muted-foreground">For a shared accommodation our tenants are usually young millennials ageing between 21 and 35 and come from all across the world, from the Northern lights of Norway to the sunny beaches of South Africa. They are white collar professionals have extremely diverse career backgrounds such as health, consulting, finance, digital etc. or are actively pursuing university education and internship programs. They are curious, respectful, open-minded, helping and looking for new opportunities to connect and learn things.</p>
                  )
                }
              ].map((faq, index) => (
                <div key={index}>
                  <button 
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex flex-1 items-center justify-between py-4 transition-all text-left hover:bg-muted/50 rounded-lg px-2"
                  >
                    <h3 className="font-semibold text-left pr-4">{faq.question}</h3>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Accordion Content */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedFAQ === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-2 pb-4">
                      {faq.answer}
                    </div>
                  </div>
                  
                  {index < 8 && (
                    <div className="w-full my-3 h-px">
                      <div className="h-px bg-border opacity-50" style={{
                        backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 8px, transparent 8px, transparent 13px)'
                      }}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="fixed bottom-4 left-4 right-4 lg:w-96 shrink-0 lg:sticky lg:top-33 h-fit z-10">
          <div className="flex rounded-xl overflow-hidden flex-col border bg-background border-border shadow-lg backdrop-blur-sm">
            <div className="flex flex-col p-4 lg:p-5">
              <div className="mb-4">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  From {trip.pricing.currency} {trip.pricing.from.toLocaleString()}
                </span>
                <span className="text-base font-medium text-muted-foreground ml-1">/night</span>
              </div>

              {/* Date Selection */}
              <div className="relative w-full max-h-[240px] overflow-y-auto mb-4">
                <div className="flex lg:flex-col overflow-x-auto gap-2 lg:gap-3">
                  {trip.pricing.availableDates.map((period, index) => (
                    <div key={index} className="flex flex-col shrink-0">
                      <div 
                        onClick={() => selectDateOption(index)}
                        className="flex px-3 py-2.5 lg:p-3 rounded-lg border border-border/50 transition-all duration-200 gap-3 cursor-pointer items-center justify-between bg-secondary/50 hover:bg-secondary/80 lg:bg-background lg:hover:bg-secondary/30"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{period.dates}</span>
                          <span className="text-xs text-muted-foreground">
                            <span className="text-foreground font-semibold">{trip.pricing.currency} {period.price.toLocaleString()}</span>/night
                          </span>
                          <span className={`text-xs mt-1 px-1.5 py-0.5 rounded-md w-fit ${
                            period.available 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {period.available ? 'Available' : 'Booked'}
                          </span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedDateIndex === index
                            ? 'border-primary bg-primary' 
                            : 'border-border hover:border-primary/50'
                        }`}>
                          {selectedDateIndex === index && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Selection */}
              <div className="flex items-center justify-between gap-4 bg-secondary/30 rounded-lg p-3 mb-4">
                <span className="font-medium text-sm">Nights</span>
                <div className="flex items-center gap-3">
                  <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-background" disabled>
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-6 text-center bg-background rounded px-2 py-1">7</span>
                  <button className="text-foreground hover:text-primary transition-colors p-1 rounded hover:bg-background">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Book Now Button */}
              <Button className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                Book Now
              </Button>
            </div>

            {/* Questions Section */}
            <div className="flex items-center justify-between p-3 lg:p-4 bg-secondary/40 border-t border-border/50">
              <span className="font-medium text-sm">Questions?</span>
              <div className="flex items-center gap-2">
                <Link href="#" className="text-xs px-2.5 py-1.5 rounded-md border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 font-medium">
                  Send Enquiry
                </Link>
                <Link href="#" className="text-xs px-2.5 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white transition-all duration-200 font-medium">
                  WhatsApp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
