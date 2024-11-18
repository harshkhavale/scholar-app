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
  profilePic?: string; // Optional URL or path to the profile picture
  fullName: string; // Full name of the user
  email: string; // User's email address, must be unique
  password: string; // User's hashed password
  plan: "free" | "premium" | "enterprise"; // User's subscription plan
  enrolls?: Course[]; // Array of ObjectIds referencing the Course model
  userType: "student" | "educator" | "admin"; // User role
  createdAt?: Date; // Optional created timestamp, added by Mongoose
  updatedAt?: Date; // Optional updated timestamp, added by Mongoose
}

export interface Educator {
  user_id: User; // Reference to the User model's ObjectId
  courses: Course[]; // Array of ObjectIds referencing the Course model
  description?: string; // Optional description of the educator's background or courses
  createdAt?: Date; // Timestamp for document creation, added by Mongoose
  updatedAt?: Date; // Timestamp for document updates, added by Mongoose
}
export interface Modules {
  total: number;
  modules: Module[];
}
export interface Auth {
  token: string;
  user: User;
  message?: string | null;
}
