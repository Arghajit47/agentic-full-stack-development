export interface Review {
  id: number;
  clientName: string;
  clientAvatarUrl: string;
  rating: number;
  reviewText: string;
  propertyTitle?: string;
}

export const testimonials: Review[] = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    clientAvatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    reviewText:
      "Finding our dream home was effortless. The team understood exactly what we wanted and delivered beyond expectations.",
    propertyTitle: "Modern Luxury Villa",
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientAvatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    reviewText:
      "Professional, responsive, and genuinely caring. The entire buying process was smooth from start to finish.",
    propertyTitle: "Downtown Penthouse",
  },
  {
    id: 3,
    clientName: "Emily Rodriguez",
    clientAvatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    rating: 4,
    reviewText:
      "Great experience overall. They helped us sell our old home and find the perfect new one in record time.",
    propertyTitle: "Suburban Family Home",
  },
  {
    id: 4,
    clientName: "David Thompson",
    clientAvatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    reviewText:
      "Outstanding service. The attention to detail and market knowledge is unmatched. Highly recommended.",
  },
  {
    id: 5,
    clientName: "Jessica Williams",
    clientAvatarUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    rating: 4,
    reviewText:
      "Smooth transaction and excellent communication throughout. Couldn't be happier with our new loft.",
    propertyTitle: "Contemporary Loft",
  },
];