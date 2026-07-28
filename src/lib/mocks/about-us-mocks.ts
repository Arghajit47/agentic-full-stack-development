import type { HowItWorksContent, TeamContent } from "@/lib/types/about-us";

export const howItWorksMock: HowItWorksContent = {
  heading: "Navigating the Estatein Experience",
  body: "At Estatein, we've designed a straightforward process to help you find and purchase your dream property with ease. Here's a step-by-step guide to how it all works.",
  steps: [
    {
      stepNumber: "Step 01",
      title: "Discover a World of Possibilities",
      description:
        "Your journey begins with exploring our carefully curated property listings. Use our intuitive search tools to filter properties based on your preferences, including location, type, size, and budget.",
    },
    {
      stepNumber: "Step 02",
      title: "Narrowing Down Your Choices",
      description:
        "Once you've found properties that catch your eye, save them to your account or make a shortlist. This allows you to compare and revisit your favorites as you make your decision.",
    },
    {
      stepNumber: "Step 03",
      title: "Personalized Guidance",
      description:
        "Have questions about a property or need more information? Our dedicated team of real estate experts is just a call or message away.",
    },
    {
      stepNumber: "Step 04",
      title: "See It for Yourself",
      description:
        "Arrange viewings of the properties you're interested in. We'll coordinate with the property owners and accompany you to ensure you get a firsthand look at your potential new home.",
    },
    {
      stepNumber: "Step 05",
      title: "Making Informed Decisions",
      description:
        "Before making an offer, our team will assist you with due diligence, including property inspections, legal checks, and market analysis. We want you to be fully informed and confident in your choice.",
    },
    {
      stepNumber: "Step 06",
      title: "Getting the Best Deal",
      description:
        "We'll help you negotiate the best terms and prepare your offer. Our goal is to secure the property at the right price and on favorable terms.",
    },
  ],
};

export const teamMock: TeamContent = {
  heading: "Meet the Estatein Team",
  body: "At Estatein, our success is driven by the dedication and expertise of our team. Get to know the people behind our mission to make your real estate dreams a reality.",
  members: [
    {
      name: "Sarah Johnson",
      role: "Chief Real Estate Officer",
      imageUrl: "/images/team/team-sarah.png",
      twitterUrl: "https://twitter.com/estatein",
    },
    {
      name: "David Brown",
      role: "Head of Property Management",
      imageUrl: "/images/team/team-david.jpg",
      twitterUrl: "https://twitter.com/estatein",
    },
    {
      name: "Michael Turner",
      role: "Legal Counsel",
      imageUrl: "/images/team/team-michael.jpg",
      twitterUrl: "https://twitter.com/estatein",
    },
    {
      name: "Max Mitchell",
      role: "Founder",
      imageUrl: "/images/team/team-max.jpg",
      twitterUrl: "https://twitter.com/estatein",
    },
  ],
};
