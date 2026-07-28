import type { OurClientsContent } from "@/lib/types/our-clients";

export const ourClientsMock: OurClientsContent = {
  heading: "Our Valued Clients",
  subheading:
    "At Estatein, we have had the privilege of working with a diverse range of clients across various industries. Here are some of the clients we've had the pleasure of serving",
  testimonials: [
    {
      since: "Since 2018",
      company: "GreenTech Enterprises",
      domain: "Commercial Real Estate",
      category: "Retail Space",
      quote:
        "Estatein's ability to identify prime retail locations helped us expand our brand presence. Their attention to detail and market insights were invaluable.",
      websiteUrl: "https://example.com",
    },
    {
      since: "Since 2019",
      company: "ABC Corporation",
      domain: "Commercial Real Estate",
      category: "Luxury Home Development",
      quote:
        "Estatein's expertise in finding the perfect office space for our growing team was outstanding. They understood our needs and delivered beyond expectations.",
      websiteUrl: "https://example.com",
    },
  ],
};
