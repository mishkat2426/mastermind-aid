export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  isPreview?: boolean;
  resourcesUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  discountPrice?: number;
  isFree?: boolean;
  category: string;
  categoryId: string;
  level: CourseLevel;
  durationHours: number;
  status: CourseStatus;
  teacherId: string;
  teacherName: string;
  teacherAvatar?: string;
  rating: number;
  reviewCount: number;
  studentsCount: number;
  lessonsCount: number;
  badge?: string;
  bengaliTitle?: string;
  bengaliDescription?: string;
  requirements: string[];
  features: string[];
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  courseThumbnail: string;
  progress: number; // 0 to 100
  completedLessons: string[]; // lessonIds
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
}

export type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'bKash' | 'Nagad' | 'Rocket' | 'Card';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  accountNumber?: string;
  status: TransactionStatus;
  createdAt: string;
  approvedBy?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  deadline: string;
  submissionsCount: number;
  createdAt: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  questionsCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: 'ALL' | 'STUDENT' | 'TEACHER';
  createdAt: string;
  author: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  pendingTransactions: number;
}
