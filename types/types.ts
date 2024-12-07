// CourseInterface.ts

export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  educator: string | null;
  price: string | null;

  modules: Module[] | null;
  languages: string[] | null;
  topics: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Actions {
  enrollButton: string;
  bookmarkButton: string;
}

// Main interface that brings all components together
export interface CourseInterface {
  course: Course;
  actions: Actions;
}
// ModuleInterface.ts

interface Resources {
  doc: string | null;
  video: string | null;
}

export interface Module {
  _id: string;
  title: string;
  description: string | null;
  resources: Resources | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
export interface User {
  id?: string;
  _id?: string; 
  profilePic?: string; // Optional URL or path to the profile picture
  fullName: string; // Full name of the user
  email: string; // User's email address, must be unique
  password: string; // User's hashed password
  plan: "free" | "premium" | "enterprise"; // User's subscription plan
  enrolls?: string[]; // Array of ObjectIds referencing the Course model
  userType: "student" | "educator" | "admin"; // User role
  createdAt?: Date; // Optional created timestamp, added by Mongoose
  updatedAt?: Date; // Optional updated timestamp, added by Mongoose
}

export interface Educator {
  _id?: string; // Unique identifier for the educator
  user_id: User;
  courses: string[]; // List of course IDs (can be empty)
  description?: string; // Educator's description (optional)
  fullName: string; // Full name of the educator
  profile_image?: string | null; // Profile image URL (nullable)
  background_image?: string | null; // Background image URL (nullable)
  specialties: string[]; // List of specialties (can be empty)
  contact_email?: string; // Public-facing contact email (optional)
  social_links?: {
    linkedin?: string ; // LinkedIn URL (optional)
    twitter?: string ;// Twitter URL (optional)
    [key: string]: string | undefined; // Support for other social links
  };
  createdAt: string; // Creation date of the educator record
  updatedAt: string; // Last update date of the educator record
}

export interface Modules {
  total: number;
  modules: Module[];
}
export interface Auth {
  token: string;
  user: User;
  educator?:Educator;
  message?: string | null;
}
export interface Review {
  _id: string;
  courseId: string;
  userId: {
    _id: string;
    profilePic: string | null;
    fullName: string;
  };
  reviewText: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Reviews {
  data: Review[];
  total: number;
}
