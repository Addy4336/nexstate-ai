import React from 'react';
import TripExperienceClient from './trip-experience-client';


interface TripExperiencePageProps {
  params: Promise<{
    experienceId: string;
  }>;
}

// Sample property experience data
const getPropertyData = (experienceId: string) => {
  // Parse the experience ID (e.g., "experience-agra-4" -> destination: "agra", id: "4")
  const match = experienceId ? experienceId.match(/^experience-(.+)-(\d+)$/) : null;
  const locationName = match ? match[1] : 'dubai-marina';
  const propertyId = match ? match[2] : '1';
  
  const formattedName = locationName ? locationName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Property Experience';
  
  return {
    title: `Beautiful Villa in ${formattedName}`,
    images: [
      'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmlsbGFzfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1601221998768-c0cdf463a393?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHZpbGxhcyUyMHJvb21zfGVufDB8fDB8fHww',
      'https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dmlsbGFzJTIwa2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1720486620020-c70516e9b69f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHZpbGxhcyUyMGJhdGhyb29tfGVufDB8fDB8fHww',
      'https://plus.unsplash.com/premium_photo-1687996107444-10614a7de48a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHZpbGxhcyUyMGJhbGNvbnl8ZW58MHx8MHx8fDA%3D'
    ],
    summary: {
      location: formattedName,
      propertyType: 'Villa',
      bedrooms: '4 Bedrooms'
    },
    highlights: [
      { icon: '🏊‍♂️', text: 'Private swimming pool with stunning city views' },
      { icon: '🚗', text: 'Dedicated parking space for 2 cars with security' },
      { icon: '🏋️‍♀️', text: 'Access to fully equipped fitness center and spa' },
      { icon: '🛡️', text: '24/7 security and concierge service' },
      { icon: '🌳', text: 'Beautiful garden and outdoor entertainment area' },
      { icon: '📶', text: 'High-speed WiFi and smart home technology' }
    ],
    description: `Experience comfortable living in this spacious ${formattedName} villa. This well-appointed property features modern design, quality furnishings, and excellent amenities. Perfect for families or groups seeking a comfortable stay with easy access to local attractions, shopping, and dining.`,
    propertyRooms: [
      { 
        room: 'Living Room', 
        description: 'Spacious living area with comfortable seating',
        images: [
          'https://plus.unsplash.com/premium_photo-1682094026083-fc4329ef6771?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHZpbGxhcyUyMGxpdmluZyUyMHJvb218ZW58MHx8MHx8fDA%3D',
          'https://plus.unsplash.com/premium_photo-1733266961456-5bd3f7e5c8b5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHZpbGxhcyUyMGxpdmluZyUyMHJvb218ZW58MHx8MHx8fDA%3D'
        ],
        amenities: [
          'Smart TV with streaming services',
          'Air conditioning with climate control',
          'Premium sound system',
          'Floor-to-ceiling windows with city views'
        ]
      },
      { 
        room: 'Kitchen', 
        description: 'Fully equipped modern kitchen with all appliances',
        images: [
          'https://images.unsplash.com/photo-1601760561441-16420502c7e0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmlsbGFzJTIwa2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D',
          'https://images.unsplash.com/photo-1713514021506-cdcbab2a7859?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHZpbGxhcyUyMGtpdGNoZW58ZW58MHx8MHx8fDA%3D'
        ],
        amenities: [
          'Full-size refrigerator and freezer',
          'Electric cooking stove and oven',
          'Microwave and dishwasher',
          'Coffee machine and kettle',
          'Complete cookware and utensils'
        ]
      },
      { 
        room: 'Master Bedroom', 
        description: 'Comfortable bedroom with en-suite bathroom',
        images: [
          'https://plus.unsplash.com/premium_photo-1675615667752-2ccda7042e7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGFzJTIwbWFzdGVyJTIwYmVkcm9vbXxlbnwwfHwwfHx8MA%3D%3D',
          'https://plus.unsplash.com/premium_photo-1673014202228-65e0e9064a34?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHZpbGxhcyUyMG1hc3RlciUyMGJlZHJvb218ZW58MHx8MHx8fDA%3D'
          
        ],
        amenities: [
          'King-size bed with quality linens',
          'Individual AC units in each room',
          'Built-in wardrobes with ample storage',
          'En-suite bathroom with shower',
          'Work desk with high-speed WiFi'
        ]
      },
      { 
        room: 'Additional Bedrooms', 
        description: 'Three comfortable bedrooms for guests',
        images: [
          'https://images.unsplash.com/photo-1592229505678-cf99a9908e03?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHZpbGxhcyUyMG1hc3RlciUyMGJlZHJvb20lMjBmb3IlMjBndWVzdHxlbnwwfHwwfHx8MA%3D%3D',
          'https://images.unsplash.com/photo-1560598522-75edd73f8473?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHZpbGxhcyUyMG1hc3RlciUyMGJlZHJvb20lMjBmb3IlMjBndWVzdHxlbnwwfHwwfHx8MA%3D%3D'
        ],
        amenities: [
          'Queen-size beds with fresh linens',
          'Air conditioning in all rooms',
          'Storage space and hangers',
          'Shared bathroom facilities'
        ]
      }
    ],
    insideAmenities: [
      { icon: '❄️', text: 'Air conditioning in all rooms with individual controls' },
      { icon: '🧊', text: 'Full-size refrigerator and freezer for food storage' },
      { icon: '🍳', text: 'Electric cooking stove, oven, and microwave for meal preparation' },
      { icon: '📺', text: 'Smart TV with cable channels and streaming services' },
      { icon: '📶', text: 'High-speed WiFi internet throughout the property' },
      { icon: '🛁', text: 'Hot water shower and modern bathroom facilities' },
      { icon: '☕', text: 'Coffee machine, kettle, and complete kitchen utensils' },
      { icon: '🧺', text: 'Washing machine and laundry facilities' }
    ],
    outsideAmenities: [
      { icon: '🏊‍♂️', text: 'Swimming pool with pool deck and lounge chairs' },
      { icon: '🏋️‍♀️', text: 'Fully equipped gym and fitness center access' },
      { icon: '🚗', text: 'Dedicated parking space with 24/7 security' },
      { icon: '🏪', text: 'On-site convenience store and pharmacy nearby' },
      { icon: '🛡️', text: 'Round-the-clock security and concierge services' },
      { icon: '🌳', text: 'Landscaped gardens and outdoor entertainment area' },
      { icon: '🍽️', text: 'BBQ area and outdoor dining facilities' },
      { icon: '🚲', text: 'Bicycle rental and recreational facilities' }
    ],
    availableFor: [
      { icon: '👨‍💼', label: 'Single Men', description: 'Individual male guests welcome' },
      { icon: '👩‍💼', label: 'Single Women', description: 'Female-friendly accommodation' },
      { icon: '💑', label: 'Couples', description: 'Perfect for romantic getaways' },
      { icon: '👨‍👩‍👧‍👦', label: 'Families', description: 'Family-friendly with child amenities' }
    ],
    essentials: [
      { icon: '🔑', label: 'Key Access' },
      { icon: '🧼', label: 'Toiletries' },
      { icon: '🛏️', label: 'Fresh Linens' },
      { icon: '🧴', label: 'Towels' },
      { icon: '🧽', label: 'Cleaning Supplies' }
    ],
    faqs: [
      'What is the minimum stay duration for this property?',
      'Is the property suitable for families with children?',
      'What amenities and services are included in the rental?',
      'How do I access the property and get the keys?',
      'Is parking available and what are the arrangements?',
      'Are pets allowed in this property?',
      'What is the cancellation and refund policy?',
      'Is there a security deposit required?'
    ],
    pricing: {
      from: 2500,
      currency: 'AED',
      availableDates: [
        { dates: 'Dec 2025 - Jan 2026', price: 2800, available: true, selected: true },
        { dates: 'Feb - Mar 2026', price: 2500, available: true, selected: false },
        { dates: 'Apr - May 2026', price: 2650, available: true, selected: false }
      ]
    }
  };
};

export default async function PropertyDetailsPage({ params }: TripExperiencePageProps) {
  const { experienceId } = await params;
  const property = getPropertyData(experienceId);

  return <TripExperienceClient trip={property} />;
}