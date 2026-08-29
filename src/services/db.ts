import { 
  User, 
  Course, 
  Lesson, 
  Enrollment, 
  Transaction, 
  Assignment, 
  Quiz, 
  Review, 
  Comment,
  Category,
  AuditLog,
  Announcement,
  PlatformStats,
  RatingStats,
  ReviewStatus,
  CommentStatus,
  ReportReason
} from '../types/platform';
import { COURSES as INITIAL_COURSES, CATEGORIES as INITIAL_CATEGORIES } from '../data/coursesData';

const STORAGE_KEYS = {
  USERS: 'mastermind_users_v3',
  COURSES: 'mastermind_courses_v3',
  ENROLLMENTS: 'mastermind_enrollments_v3',
  TRANSACTIONS: 'mastermind_transactions_v3',
  ASSIGNMENTS: 'mastermind_assignments_v3',
  QUIZZES: 'mastermind_quizzes_v3',
  REVIEWS: 'mastermind_reviews_v3',
  COMMENTS: 'mastermind_comments_v3',
  CATEGORIES: 'mastermind_categories_v3',
  AUDIT_LOGS: 'mastermind_audit_logs_v3',
  ANNOUNCEMENTS: 'mastermind_announcements_v3',
  TEACHER_CODE: 'mastermind_teacher_code_v3',
  ADMIN_CODE: 'mastermind_admin_code_v3',
};

// Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Mastermind Admin',
    email: 'admin@mastermindaid.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    phone: '+880 1712-949410',
    bio: 'Platform Administrator & Chief Architect at Mastermind Aid.',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'usr-teacher-1',
    name: 'Hasibul Islam',
    email: 'teacher@mastermindaid.com',
    role: 'TEACHER',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    phone: '+880 1812-345678',
    bio: 'Lead WordPress & Digital Marketing Instructor with 10+ years experience.',
    createdAt: '2026-01-05T00:00:00.000Z',
    updatedAt: '2026-01-05T00:00:00.000Z',
  },
  {
    id: 'usr-student-1',
    name: 'Tanvir Ahmed',
    email: 'student@mastermindaid.com',
    role: 'STUDENT',
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '+880 1912-876543',
    bio: 'Enthusiastic Web Development Learner from Dhaka.',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

// Seed Reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'usr-student-1',
    userName: 'Tanvir Ahmed',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    courseId: 'wp-plugin-dev-2026',
    courseTitle: 'WordPress Plugin Development Mastery 2026',
    rating: 5,
    comment: 'অসাধারণ কোর্স! হাসিবুল ভাইয়া খুব সুন্দরভাবে প্র্যাকটিক্যাল প্লাগইন তৈরি শিখিয়েছেন। যেকোনো প্রশ্নের খুব দ্রত উত্তর দেওয়া হয়।',
    status: 'PUBLISHED',
    createdAt: '2026-02-15T10:00:00.000Z',
  },
  {
    id: 'rev-2',
    userId: 'usr-student-1',
    userName: 'Tanvir Ahmed',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    courseId: 'digital-marketing-pro',
    courseTitle: 'Digital Marketing & Meta Ads Specialist',
    rating: 4,
    comment: 'খুব কার্যকর গাইডলাইন। ফাইভার এবং লোকাল ক্লায়েন্ট ম্যানেজমেন্টের টিপসগুলো সবচেয়ে ভালো লেগেছে।',
    status: 'PUBLISHED',
    createdAt: '2026-02-20T14:30:00.000Z',
  },
  {
    id: 'rev-3',
    userId: 'usr-student-1',
    userName: 'Rafiqul Islam',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    courseId: 'wp-plugin-dev-2026',
    courseTitle: 'WordPress Plugin Development Mastery 2026',
    rating: 5,
    comment: 'The shortcode and custom database modules were outstanding! Highly recommended.',
    status: 'PUBLISHED',
    createdAt: '2026-02-25T09:15:00.000Z',
  },
];

// Seed Comments
const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'cmt-1',
    userId: 'usr-student-1',
    userName: 'Tanvir Ahmed',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    userRole: 'STUDENT',
    courseId: 'wp-plugin-dev-2026',
    lessonId: 'les-wp-plugin-dev-2026-0-1',
    text: 'ভাইয়া, LocalWP তে কাস্টম টেবিল ক্রিয়েট করার সময় dbDelta ফাংশন কল করতে কোনো স্পেশাল পারমিশন লাগে কি?',
    status: 'PUBLISHED',
    reportCount: 0,
    createdAt: '2026-02-18T11:20:00.000Z',
  },
  {
    id: 'cmt-2',
    userId: 'usr-teacher-1',
    userName: 'Hasibul Islam',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    userRole: 'TEACHER',
    courseId: 'wp-plugin-dev-2026',
    lessonId: 'les-wp-plugin-dev-2026-0-1',
    parentId: 'cmt-1',
    text: 'জি তানভীর, dbDelta কল করার সময় ২টা স্পেসের রুলস মেনে চলতে হবে এবং `$wpdb->get_charset_collate()` ব্যবহার করতে হবে। লেকচার ভিডিও ৩:৪৫ মিনিটে ডিটেইলস দেওয়া আছে।',
    status: 'PUBLISHED',
    reportCount: 0,
    createdAt: '2026-02-18T12:05:00.000Z',
  },
];

// Seed Categories
const INITIAL_CATEGORY_LIST: Category[] = INITIAL_CATEGORIES.map((c) => ({
  id: c.id,
  name: c.name,
  bengaliName: c.bengaliName,
  description: c.description,
  iconName: c.iconName,
}));

// Helper to getItem from LocalStorage with fallback
function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// Helper to saveData to LocalStorage
function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Database write error:', e);
  }
}

export class DBService {
  // Access Code Verification Engine
  static getTeacherAccessCode(): string {
    return loadData<string>(STORAGE_KEYS.TEACHER_CODE, 'MASTERMIND10');
  }

  static getAdminAccessCode(): string {
    return loadData<string>(STORAGE_KEYS.ADMIN_CODE, 'MASTERMIND ADMIN');
  }

  static verifyTeacherCode(inputCode: string): boolean {
    if (!inputCode) return false;
    const validCode = this.getTeacherAccessCode();
    return inputCode.trim().toUpperCase() === validCode.trim().toUpperCase();
  }

  static verifyAdminCode(inputCode: string): boolean {
    if (!inputCode) return false;
    const validCode = this.getAdminAccessCode();
    return inputCode.trim().toUpperCase() === validCode.trim().toUpperCase();
  }

  static rotateAccessCodes(adminName: string, newTeacherCode?: string, newAdminCode?: string): void {
    if (newTeacherCode && newTeacherCode.trim()) {
      saveData(STORAGE_KEYS.TEACHER_CODE, newTeacherCode.trim());
      this.logAdminAction('usr-admin-1', adminName, 'Rotated Teacher Access Code', 'Security', 'TEACHER_CODE');
    }
    if (newAdminCode && newAdminCode.trim()) {
      saveData(STORAGE_KEYS.ADMIN_CODE, newAdminCode.trim());
      this.logAdminAction('usr-admin-1', adminName, 'Rotated Admin Security Code', 'Security', 'ADMIN_CODE');
    }
  }

  // Secure Authentication Workflows
  static authenticateAdmin(email: string, password: string, adminSecurityCode: string): { success: boolean; user?: User; error?: string } {
    if (!this.verifyAdminCode(adminSecurityCode)) {
      this.logAdminAction('system', 'System Security', `Failed Admin login attempt for ${email} (Invalid Security Code)`, 'Security', email);
      return { success: false, error: 'Admin authentication failed.' };
    }

    const user = this.getUserByEmail(email);
    if (!user || user.role !== 'ADMIN') {
      this.logAdminAction('system', 'System Security', `Failed Admin login attempt for ${email} (Unauthorized Role/Missing Account)`, 'Security', email);
      return { success: false, error: 'Admin authentication failed.' };
    }

    if (user.status === 'SUSPENDED') {
      return { success: false, error: 'Account has been suspended. Please contact platform support.' };
    }

    this.logAdminAction(user.id, user.name, `Successful Admin login`, 'Auth', user.id);
    return { success: true, user };
  }

  static authenticateTeacher(email: string, password: string, teacherAccessCode?: string): { success: boolean; user?: User; error?: string } {
    let user = this.getUserByEmail(email);

    if (!user) {
      // If user doesn't exist, require Teacher Access Code for activation
      if (!teacherAccessCode || !this.verifyTeacherCode(teacherAccessCode)) {
        return { success: false, error: 'Unable to verify teacher access. Please check your credentials.' };
      }
      user = this.createUser({
        name: email.split('@')[0],
        email,
        role: 'TEACHER',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      });
      this.logAdminAction(user.id, user.name, `Teacher account created via access code`, 'Auth', user.id);
      return { success: true, user };
    }

    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return { success: false, error: 'Unable to verify teacher access. Please check your credentials.' };
    }

    if (user.status === 'SUSPENDED') {
      return { success: false, error: 'Account has been suspended. Please contact platform support.' };
    }

    this.logAdminAction(user.id, user.name, `Successful Teacher login`, 'Auth', user.id);
    return { success: true, user };
  }

  static activateTeacherAccount(name: string, email: string, phone: string, password: string, teacherAccessCode: string): { success: boolean; user?: User; error?: string } {
    if (!this.verifyTeacherCode(teacherAccessCode)) {
      return { success: false, error: 'Invalid teacher access code.' };
    }

    const existing = this.getUserByEmail(email);
    if (existing) {
      if (existing.role === 'TEACHER') {
        return { success: true, user: existing };
      }
      // Upgrade role to TEACHER if code is valid
      const updated = this.updateUser(existing.id, { role: 'TEACHER', phone, name });
      this.logAdminAction(existing.id, name, `Upgraded user to Teacher via access code`, 'Auth', existing.id);
      return { success: true, user: updated };
    }

    const newTeacher = this.createUser({
      name,
      email,
      phone,
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    });

    this.logAdminAction(newTeacher.id, name, `Activated new Teacher account via access code`, 'Auth', newTeacher.id);
    return { success: true, user: newTeacher };
  }

  static createAdminAccount(name: string, email: string, adminCreatorName: string): { success: boolean; user?: User; error?: string } {
    const existing = this.getUserByEmail(email);
    if (existing) {
      const updated = this.updateUser(existing.id, { role: 'ADMIN', name });
      this.logAdminAction('usr-admin-1', adminCreatorName, `Promoted user ${email} to Admin`, 'AdminManagement', existing.id);
      return { success: true, user: updated };
    }

    const newAdmin = this.createUser({
      name,
      email,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });

    this.logAdminAction('usr-admin-1', adminCreatorName, `Created new Admin account: ${email}`, 'AdminManagement', newAdmin.id);
    return { success: true, user: newAdmin };
  }

  // Users
  static getUsers(): User[] {
    return loadData<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  static createUser(user: Omit<User, 'id' | 'status' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveData(STORAGE_KEYS.USERS, users);
    return newUser;
  }

  static updateUser(id: string, updates: Partial<User>): User | undefined {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveData(STORAGE_KEYS.USERS, users);
    return users[idx];
  }

  static suspendUser(id: string, adminName: string): boolean {
    const user = this.updateUser(id, { status: 'SUSPENDED' });
    if (user) {
      this.logAdminAction('usr-admin-1', adminName, `Suspended user account: ${user.name} (${user.email})`, 'User', id);
      return true;
    }
    return false;
  }

  static unsuspendUser(id: string, adminName: string): boolean {
    const user = this.updateUser(id, { status: 'ACTIVE' });
    if (user) {
      this.logAdminAction('usr-admin-1', adminName, `Reactivated user account: ${user.name}`, 'User', id);
      return true;
    }
    return false;
  }

  static deleteUser(id: string, adminName: string): boolean {
    let users = this.getUsers();
    const target = users.find((u) => u.id === id);
    users = users.filter((u) => u.id !== id);
    saveData(STORAGE_KEYS.USERS, users);
    if (target) {
      this.logAdminAction('usr-admin-1', adminName, `Deleted user account: ${target.name}`, 'User', id);
    }
    return true;
  }

  // Courses
  static getCourses(): Course[] {
    const raw = loadData<Course[]>(STORAGE_KEYS.COURSES, []);
    if (raw.length === 0) {
      // Lazy init mapping from initial data
      const mapped = INITIAL_COURSES.map((c, idx) => ({
        id: c.id,
        title: c.title,
        slug: c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: c.description,
        thumbnail: c.image,
        price: c.price,
        discountPrice: c.originalPrice,
        isFree: c.isFree || false,
        category: c.category,
        categoryId: c.categoryId,
        level: c.level as any,
        durationHours: c.durationHours,
        status: 'PUBLISHED' as const,
        teacherId: 'usr-teacher-1',
        teacherName: c.instructor?.name || 'Hasibul Islam',
        teacherAvatar: c.instructor?.avatar,
        rating: c.rating,
        reviewCount: c.reviewCount,
        studentsCount: c.studentsCount,
        lessonsCount: c.lessonsCount,
        badge: c.badge,
        bengaliTitle: c.bengaliTitle,
        bengaliDescription: c.bengaliDescription,
        requirements: c.requirements,
        features: c.features,
        lessons: (c.curriculum || []).flatMap((currSection, sectionIdx) =>
          currSection.lessons.map((les, lessonIdx) => ({
            id: `les-${c.id}-${sectionIdx}-${lessonIdx}`,
            courseId: c.id,
            title: les.title,
            description: `In-depth lecture on ${les.title}`,
            videoUrl: 'https://www.youtube.com/embed/uCvNsKvIHgg',
            duration: les.duration,
            order: sectionIdx * 10 + lessonIdx,
            isPreview: les.isPreview || lessonIdx === 0,
            isPublished: true,
          }))
        ),
        createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      saveData(STORAGE_KEYS.COURSES, mapped);
      return mapped;
    }
    return raw;
  }

  static getPublishedCourses(): Course[] {
    return this.getCourses().filter((c) => c.status === 'PUBLISHED');
  }

  static getCourseById(id: string): Course | undefined {
    return this.getCourses().find((c) => c.id === id);
  }

  static createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>, adminName?: string): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: `crs-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    courses.unshift(newCourse);
    saveData(STORAGE_KEYS.COURSES, courses);

    if (adminName) {
      this.logAdminAction('usr-admin-1', adminName, `Created course: "${newCourse.title}"`, 'Course', newCourse.id);
    }
    return newCourse;
  }

  static updateCourse(id: string, updates: Partial<Course>, adminName?: string): Course | undefined {
    const courses = this.getCourses();
    const idx = courses.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    courses[idx] = { ...courses[idx], ...updates, updatedAt: new Date().toISOString() };
    saveData(STORAGE_KEYS.COURSES, courses);

    if (adminName) {
      this.logAdminAction('usr-admin-1', adminName, `Updated course: "${courses[idx].title}"`, 'Course', id);
    }
    return courses[idx];
  }

  static deleteCourse(id: string, adminName?: string): boolean {
    let courses = this.getCourses();
    const target = courses.find((c) => c.id === id);
    courses = courses.filter((c) => c.id !== id);
    saveData(STORAGE_KEYS.COURSES, courses);

    if (target && adminName) {
      this.logAdminAction('usr-admin-1', adminName, `Deleted course: "${target.title}"`, 'Course', id);
    }
    return true;
  }

  static bulkUpdateCourseStatus(ids: string[], status: Course['status'], adminName: string): void {
    const courses = this.getCourses();
    courses.forEach((c) => {
      if (ids.includes(c.id)) {
        c.status = status;
        c.updatedAt = new Date().toISOString();
      }
    });
    saveData(STORAGE_KEYS.COURSES, courses);
    this.logAdminAction('usr-admin-1', adminName, `Bulk updated ${ids.length} course(s) to status: ${status}`, 'Course', ids.join(','));
  }

  // Reviews & Dynamic Rating Engine
  static getReviews(): Review[] {
    return loadData<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static getReviewsByCourseId(courseId: string, onlyPublished: boolean = true): Review[] {
    const reviews = this.getReviews().filter((r) => r.courseId === courseId);
    if (onlyPublished) {
      return reviews.filter((r) => r.status === 'PUBLISHED');
    }
    return reviews;
  }

  static createReview(review: Omit<Review, 'id' | 'status' | 'createdAt'>): Review {
    const reviews = this.getReviews();
    
    // Check if user already reviewed this course
    const existingIdx = reviews.findIndex((r) => r.userId === review.userId && r.courseId === review.courseId);

    const newReview: Review = {
      ...review,
      id: existingIdx !== -1 ? reviews[existingIdx].id : `rev-${Date.now()}`,
      status: 'PUBLISHED', // Auto-publish for immediate feedback
      createdAt: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      reviews[existingIdx] = newReview;
    } else {
      reviews.unshift(newReview);
    }

    saveData(STORAGE_KEYS.REVIEWS, reviews);
    this.recalculateCourseRating(review.courseId);
    return newReview;
  }

  static updateReviewStatus(reviewId: string, status: ReviewStatus, adminName: string): Review | undefined {
    const reviews = this.getReviews();
    const idx = reviews.findIndex((r) => r.id === reviewId);
    if (idx === -1) return undefined;

    reviews[idx].status = status;
    reviews[idx].updatedAt = new Date().toISOString();
    saveData(STORAGE_KEYS.REVIEWS, reviews);

    this.recalculateCourseRating(reviews[idx].courseId);
    this.logAdminAction('usr-admin-1', adminName, `Updated review status to ${status}`, 'Review', reviewId);
    return reviews[idx];
  }

  static deleteReview(reviewId: string, adminName?: string): boolean {
    let reviews = this.getReviews();
    const target = reviews.find((r) => r.id === reviewId);
    reviews = reviews.filter((r) => r.id !== reviewId);
    saveData(STORAGE_KEYS.REVIEWS, reviews);

    if (target) {
      this.recalculateCourseRating(target.courseId);
      if (adminName) {
        this.logAdminAction('usr-admin-1', adminName, `Deleted review from ${target.userName}`, 'Review', reviewId);
      }
    }
    return true;
  }

  static bulkUpdateReviewStatus(ids: string[], status: ReviewStatus, adminName: string): void {
    const reviews = this.getReviews();
    const affectedCourseIds = new Set<string>();

    reviews.forEach((r) => {
      if (ids.includes(r.id)) {
        r.status = status;
        affectedCourseIds.add(r.courseId);
      }
    });

    saveData(STORAGE_KEYS.REVIEWS, reviews);
    affectedCourseIds.forEach((cId) => this.recalculateCourseRating(cId));
    this.logAdminAction('usr-admin-1', adminName, `Bulk updated ${ids.length} review(s) to ${status}`, 'Review', ids.join(','));
  }

  // Dynamic 5-Star Rating Calculation Formula
  static getCourseRatingStats(courseId: string): RatingStats {
    const publishedReviews = this.getReviewsByCourseId(courseId, true);
    
    if (publishedReviews.length === 0) {
      return {
        avgRating: 4.8,
        reviewCount: 0,
        distribution: { 5: 85, 4: 12, 3: 3, 2: 0, 1: 0 },
      };
    }

    const totalSum = publishedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalSum / publishedReviews.length) * 10) / 10;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    publishedReviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] += 1;
    });

    return {
      avgRating,
      reviewCount: publishedReviews.length,
      distribution,
    };
  }

  private static recalculateCourseRating(courseId: string): void {
    const stats = this.getCourseRatingStats(courseId);
    this.updateCourse(courseId, {
      rating: stats.avgRating,
      reviewCount: stats.reviewCount,
    });
  }

  // Comments & Discussion Engine
  static getComments(): Comment[] {
    return loadData<Comment[]>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  }

  static getCommentsByCourseId(courseId: string, lessonId?: string): Comment[] {
    const comments = this.getComments().filter((c) => c.status !== 'DELETED');
    return comments.filter((c) => {
      if (c.courseId !== courseId) return false;
      if (lessonId && c.lessonId !== lessonId) return false;
      return true;
    });
  }

  static createComment(comment: Omit<Comment, 'id' | 'status' | 'reportCount' | 'createdAt'>): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      ...comment,
      id: `cmt-${Date.now()}`,
      status: 'PUBLISHED',
      reportCount: 0,
      createdAt: new Date().toISOString(),
    };
    comments.unshift(newComment);
    saveData(STORAGE_KEYS.COMMENTS, comments);
    return newComment;
  }

  static reportComment(commentId: string, reason: ReportReason): boolean {
    const comments = this.getComments();
    const idx = comments.findIndex((c) => c.id === commentId);
    if (idx === -1) return false;

    comments[idx].reportCount = (comments[idx].reportCount || 0) + 1;
    comments[idx].status = 'REPORTED';
    comments[idx].reportReason = reason;
    saveData(STORAGE_KEYS.COMMENTS, comments);
    return true;
  }

  static updateCommentStatus(commentId: string, status: CommentStatus, adminName: string): Comment | undefined {
    const comments = this.getComments();
    const idx = comments.findIndex((c) => c.id === commentId);
    if (idx === -1) return undefined;

    comments[idx].status = status;
    comments[idx].updatedAt = new Date().toISOString();
    saveData(STORAGE_KEYS.COMMENTS, comments);

    this.logAdminAction('usr-admin-1', adminName, `Updated comment status to ${status}`, 'Comment', commentId);
    return comments[idx];
  }

  static deleteComment(commentId: string, adminName?: string): boolean {
    const comments = this.getComments();
    const idx = comments.findIndex((c) => c.id === commentId);
    if (idx === -1) return false;

    comments[idx].status = 'DELETED';
    saveData(STORAGE_KEYS.COMMENTS, comments);

    if (adminName) {
      this.logAdminAction('usr-admin-1', adminName, `Deleted comment: "${comments[idx].text.slice(0, 30)}..."`, 'Comment', commentId);
    }
    return true;
  }

  static bulkUpdateCommentStatus(ids: string[], status: CommentStatus, adminName: string): void {
    const comments = this.getComments();
    comments.forEach((c) => {
      if (ids.includes(c.id)) {
        c.status = status;
      }
    });
    saveData(STORAGE_KEYS.COMMENTS, comments);
    this.logAdminAction('usr-admin-1', adminName, `Bulk updated ${ids.length} comment(s) to ${status}`, 'Comment', ids.join(','));
  }

  // Categories Management
  static getCategories(): Category[] {
    return loadData<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORY_LIST);
  }

  static createCategory(cat: Omit<Category, 'id'>, adminName: string): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...cat,
      id: cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };
    categories.push(newCat);
    saveData(STORAGE_KEYS.CATEGORIES, categories);
    this.logAdminAction('usr-admin-1', adminName, `Created Category: "${newCat.name}"`, 'Category', newCat.id);
    return newCat;
  }

  static deleteCategory(id: string, adminName: string): boolean {
    let categories = this.getCategories();
    categories = categories.filter((c) => c.id !== id);
    saveData(STORAGE_KEYS.CATEGORIES, categories);
    this.logAdminAction('usr-admin-1', adminName, `Deleted Category ID: ${id}`, 'Category', id);
    return true;
  }

  // Audit Logs
  static getAuditLogs(): AuditLog[] {
    return loadData<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  static logAdminAction(adminId: string, adminName: string, action: string, resource: string, resourceId: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminId,
      adminName,
      action,
      resource,
      resourceId,
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    saveData(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // Transactions
  static getTransactions(): Transaction[] {
    return loadData<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  }

  static getTransactionsByUserId(userId: string): Transaction[] {
    return this.getTransactions().filter((t) => t.userId === userId);
  }

  static createTransaction(trx: Omit<Transaction, 'id' | 'createdAt' | 'status'>): Transaction {
    const transactions = this.getTransactions();
    const newTrx: Transaction = {
      ...trx,
      id: `trx-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTrx);
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);

    if (trx.amount === 0) {
      newTrx.status = 'SUCCESS';
      this.updateTransactionStatus(newTrx.id, 'SUCCESS', 'Auto Instant System');
      this.enrollUser(trx.userId, trx.courseId);
    }
    return newTrx;
  }

  static updateTransactionStatus(id: string, status: Transaction['status'], approvedBy?: string): Transaction | undefined {
    const transactions = this.getTransactions();
    const idx = transactions.findIndex((t) => t.id === id);
    if (idx === -1) return undefined;

    transactions[idx].status = status;
    if (approvedBy) transactions[idx].approvedBy = approvedBy;
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);

    if (status === 'SUCCESS') {
      this.enrollUser(transactions[idx].userId, transactions[idx].courseId);
    }

    if (approvedBy) {
      this.logAdminAction('usr-admin-1', approvedBy, `Updated Transaction ${id} status to ${status}`, 'Transaction', id);
    }

    return transactions[idx];
  }

  // Enrollments
  static getEnrollments(): Enrollment[] {
    return loadData<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, []);
  }

  static getEnrollmentsByUserId(userId: string): Enrollment[] {
    return this.getEnrollments().filter((e) => e.userId === userId);
  }

  static isUserEnrolled(userId: string, courseId: string): boolean {
    return this.getEnrollments().some(
      (e) => e.userId === userId && e.courseId === courseId && e.status === 'ACTIVE'
    );
  }

  static enrollUser(userId: string, courseId: string): Enrollment {
    const enrollments = this.getEnrollments();
    const existing = enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (existing) return existing;

    const course = this.getCourseById(courseId);
    const newEnrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      userId,
      courseId,
      courseTitle: course?.title || 'MasterMind Course',
      courseThumbnail: course?.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      progress: 0,
      completedLessons: [],
      status: 'ACTIVE',
      enrolledAt: new Date().toISOString(),
    };

    enrollments.unshift(newEnrollment);
    saveData(STORAGE_KEYS.ENROLLMENTS, enrollments);

    if (course) {
      this.updateCourse(courseId, { studentsCount: (course.studentsCount || 0) + 1 });
    }

    return newEnrollment;
  }

  static updateLessonProgress(userId: string, courseId: string, lessonId: string): Enrollment | undefined {
    const enrollments = this.getEnrollments();
    const idx = enrollments.findIndex((e) => e.userId === userId && e.courseId === courseId);
    if (idx === -1) return undefined;

    const enr = enrollments[idx];
    if (!enr.completedLessons.includes(lessonId)) {
      enr.completedLessons.push(lessonId);
    }

    const course = this.getCourseById(courseId);
    const totalLessons = course?.lessons.length || 10;
    enr.progress = Math.min(100, Math.round((enr.completedLessons.length / totalLessons) * 100));

    if (enr.progress >= 100) {
      enr.status = 'COMPLETED';
      enr.completedAt = new Date().toISOString();
    }

    saveData(STORAGE_KEYS.ENROLLMENTS, enrollments);
    return enr;
  }

  // Analytics
  static getStats(): PlatformStats {
    const users = this.getUsers();
    const courses = this.getCourses();
    const enrollments = this.getEnrollments();
    const transactions = this.getTransactions();
    const reviews = this.getReviews();
    const comments = this.getComments();

    const successfulTrx = transactions.filter((t) => t.status === 'SUCCESS');
    const totalRevenue = successfulTrx.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalUsers: users.length,
      totalTeachers: users.filter((u) => u.role === 'TEACHER').length,
      totalStudents: users.filter((u) => u.role === 'STUDENT').length,
      totalCourses: courses.length,
      totalEnrollments: enrollments.length,
      totalRevenue,
      pendingTransactions: transactions.filter((t) => t.status === 'PENDING').length,
      pendingReviews: reviews.filter((r) => r.status === 'PENDING').length,
      reportedComments: comments.filter((c) => c.status === 'REPORTED').length,
    };
  }
}
