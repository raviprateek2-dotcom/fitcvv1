
export type PersonalInfo = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  date: string;
  description: string;
};

export type Education = {
  id: number;
  institution: string;
  degree: string;
  date: string;
};

export type Skill = {
  id: number;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
};

export type Project = {
  id: number;
  name: string;
  description: string;
  link?: string;
};

export type Styling = {
  bodyFontSize: number;
  headingFontSize: number;
  titleFontSize: number;
  accentColor: string;
  fontFamily: string;
};

export type ResumeData = {
  userId?: string;
  title?: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills?: Skill[];
  projects?: Project[];
  jobDescription: string;
  templateId?: string;
  coverLetter?: string;
  companyInfo?: {
    name: string;
    jobTitle: string;
  };
  styling?: Styling;
  shareId?: string;
};

export interface CoverLetterPreviewProps {
  resumeData: ResumeData;
}
