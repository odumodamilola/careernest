export type UserRole = 'mentee' | 'mentor' | 'recruiter' | 'institution' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  coverImage?: string;
  headline?: string;
  bio?: string;
  role: UserRole;
  location?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
  languages?: Language[];
  certificates?: Certificate[];
  interests?: string[];
  availability?: {
    mentorship: boolean;
    hiring: boolean;
    openToWork: boolean;
  };
  stats?: {
    followers: number;
    following: number;
    posts: number;
    mentorshipSessions: number;
  };
  isVerified: boolean;
  createdAt: string;
  profileComplete: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
  skills?: string[];
}

export interface Language {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  skills?: string[];
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: User;
  images?: string[];
  video?: string;
  document?: string;
  link?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  hasLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  visibility: 'public' | 'followers' | 'mentors' | 'private';
  type: 'text' | 'media' | 'link' | 'certificate' | 'job';
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: User;
  postId: string;
  parentId?: string;
  likesCount: number;
  hasLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  remote: boolean;
  authorId: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  applicantsCount: number;
  hasApplied?: boolean;
  hasSaved?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: User;
  thumbnail: string;
  duration: string;
  modules: CourseModule[];
  enrolledCount: number;
  rating: number;
  price?: number;
  currency?: string;
  isFree: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  isEnrolled?: boolean;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: {
    id: string;
    title: string;
    type: 'video' | 'text' | 'quiz';
    duration: string;
    completed?: boolean;
  }[];
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  mentor: User;
  menteeId: string;
  mentee: User;
  date: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  rating?: number;
  feedback?: string;
  price?: number;
  currency?: string;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'like' | 'comment' | 'follow' | 'message' | 'job' | 'course' | 'mentorship';
  message: string;
  read: boolean;
  entityId?: string;
  entityType?: 'post' | 'comment' | 'job' | 'course' | 'mentorship' | 'user';
  actorId?: string;
  actor?: User;
  createdAt: string;
}