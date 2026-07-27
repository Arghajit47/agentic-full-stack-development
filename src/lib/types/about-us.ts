export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface HowItWorksContent {
  heading: string;
  body: string;
  steps: HowItWorksStep[];
}

export interface TeamMemberData {
  name: string;
  role: string;
  imageUrl: string;
  twitterUrl: string;
}

export interface TeamContent {
  heading: string;
  body: string;
  members: TeamMemberData[];
}
