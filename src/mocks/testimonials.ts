export interface Review {
  id: number;
  clientName: string;
  clientLocation: string;
  clientAvatarUrl: string;
  rating: number;
  reviewText: string;
  reviewTitle?: string;
  propertyTitle: string | null;
}

export const testimonials: Review[] = [
  {
    id: 1,
    clientName: "Wade Warren",
    clientLocation: "USA, California",
    clientAvatarUrl: "/images/reviewers/wade-warren.jpg",
    rating: 5,
    reviewTitle: "Exceptional Service!",
    reviewText:
      "Our experience with Estatein was outstanding. Their team's dedication and professionalism made finding our dream home a breeze. Highly recommended!",
    propertyTitle: null,
  },
  {
    id: 2,
    clientName: "Emelie Thomson",
    clientLocation: "USA, Florida",
    clientAvatarUrl: "/images/reviewers/emelie-thomson.jpg",
    rating: 5,
    reviewTitle: "Efficient and Reliable",
    reviewText:
      "Estatein provided us with top-notch service. They helped us sell our property quickly and at a great price. We couldn't be happier with the results.",
    propertyTitle: "Metropolitan Haven",
  },
  {
    id: 3,
    clientName: "John Mans",
    clientLocation: "USA, Nevada",
    clientAvatarUrl: "/images/reviewers/john-mans.jpg",
    rating: 5,
    reviewTitle: "Trusted Advisors",
    reviewText:
      "The Estatein team guided us through the entire buying process. Their knowledge and commitment to our needs were impressive. Thank you for your support!",
    propertyTitle: "Rustic Retreat Cottage",
  },
  {
    id: 4,
    clientName: "Emily Raynald",
    clientLocation: "France, Rennes",
    clientAvatarUrl: "/images/reviewers/emily-raynald.jpg",
    rating: 5,
    reviewTitle: "Exceptional Service!",
    reviewText:
      "Estatein made buying our first home a breeze. The team was professional, attentive, and guided us every step of the way. Highly recommend!",
    propertyTitle: null,
  },
  {
    id: 5,
    clientName: "Maksym Voznichka",
    clientLocation: "Ukraine, Odessa",
    clientAvatarUrl: "/images/reviewers/maksym-voznichka.jpg",
    rating: 5,
    reviewTitle: "Trusted Advisors",
    reviewText:
      "Exceptional service from Estatein! They found us the perfect property within our budget and handled all the details seamlessly. Truly a stress-free experience.",
    propertyTitle: null,
  },
];
