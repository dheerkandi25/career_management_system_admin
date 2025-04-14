export interface Certification {
    id: number;
    certification_name: string;
    issuing_date: string;
  }
  
  export interface Education {
    id: number;
    degree: string;
    major: string;
    institute_name: string;
    start_date: string;
    end_date: string | null;
  }
  
  export interface Experience {
    id: number;
    title: string;
    company: string;
    start_date: string;
    end_date: string | null;
  }
  
  export interface Skill {
    id: number;
    skill_name: string;
  }
  
  export interface Applicant {
    id: number;
    first_name: string;
    last_name: string;
    email_id: string;
    phone: string;
    address: string | null;
    resume_name: string;
    location_id: number;
    certifications: Certification[];
    education: Education[];
    experience: Experience[];
    skills: Skill[];
  }