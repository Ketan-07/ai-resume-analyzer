export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  github?: string;
  live?: string;
  image?: string;
  featured: boolean;
  category: string;
  conclusion: string;
}

export interface Skill {
  name: string;
  icon: string;
  category: string;
  level: number;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  link?: string;
  image?: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  grade: string;
}

export interface CodingProfile {
  platform: string;
  username: string;
  url: string;
  icon: string;
  rating?: string;
}

export interface NavLink {
  label: string;
  href: string;
}
