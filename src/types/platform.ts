export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  bio?: string;
  isSoftDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CourseStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface PdfResource {
  id: string;
  title: string;
  url: string;
  fileSize?: string;
  addedAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  videoTitle?: string;
  duration: string;
  order: number;
  isPreview?: boolean;
  resourcesUrl?: string;
  pdfTitle?: string;
  imageUrl?: string;
  isPublished?: boolean;
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
  pdfResources?: PdfResource[];
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

export type ReviewStatus = 'PENDING' | 'PUBLISHED' | 'HIDDEN' | 'REJECTED';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  courseId: string;
  courseTitle?: string;
  rating: number; // 1 to 5
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt?: string;
}

export type CommentStatus = 'PUBLISHED' | 'HIDDEN' | 'REPORTED' | 'DELETED';
export type ReportReason = 'Spam' | 'Harassment' | 'Offensive Content' | 'Irrelevant' | 'Other';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: UserRole;
  courseId: string;
  lessonId?: string;
  text: string;
  status: CommentStatus;
  reportCount: number;
  reportReason?: ReportReason;
  parentId?: string; // For nested replies
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  bengaliName: string;
  description: string;
  iconName: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resource: string;
  resourceId: string;
  timestamp: string;
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
  pendingReviews: number;
  reportedComments: number;
}

export interface RatingStats {
  avgRating: number;
  reviewCount: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
