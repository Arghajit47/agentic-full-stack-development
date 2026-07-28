export interface ClientTestimonial {
  since: string;
  company: string;
  domain: string;
  category: string;
  quote: string;
  websiteUrl: string;
}

export interface OurClientsContent {
  heading: string;
  subheading: string;
  testimonials: ClientTestimonial[];
}
