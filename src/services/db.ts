import { 
  User, 
  Course, 
  Lesson, 
  Enrollment, 
  Transaction, 
  Assignment, 
  Quiz, 
  Review, 
  Announcement,
  PlatformStats 
} from '../types/platform';
import { COURSES as INITIAL_COURSES } from '../data/coursesData';

const STORAGE_KEYS = {
  USERS: 'mastermind_users_v2',
  COURSES: 'mastermind_courses_v2',
  ENROLLMENTS: 'mastermind_enrollments_v2',
  TRANSACTIONS: 'mastermind_transactions_v2',
  ASSIGNMENTS: 'mastermind_assignments_v2',
  QUIZZES: 'mastermind_quizzes_v2',
  REVIEWS: 'mastermind_reviews_v2',
  ANNOUNCEMENTS: 'mastermind_announcements_v2',
};

// Seed Users
const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Mastermind Admin',
    email: 'admin@mastermindaid.com',
    role: 'ADMIN',
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
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    phone: '+880 1912-876543',
    bio: 'Enthusiastic Web Development Learner from Dhaka.',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

// Map initial courses from data file to domain model
const mapInitialCourses = (): Course[] => {
  return INITIAL_COURSES.map((c, idx) => ({
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
    status: 'PUBLISHED',
    teacherId: 'usr-teacher-1',
    teacherName: c.instructor.name || 'Hasibul Islam',
    teacherAvatar: c.instructor.avatar,
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
      }))
    ),
    createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

// Seed Transactions
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx-1001',
    userId: 'usr-student-1',
    userName: 'Tanvir Ahmed',
    userEmail: 'student@mastermindaid.com',
    courseId: 'wp-plugin-dev-2026',
    courseTitle: 'WordPress Plugin Development Mastery 2026',
    amount: 2500,
    paymentMethod: 'bKash',
    transactionId: '9J47A8X9K',
    accountNumber: '01912876543',
    status: 'SUCCESS',
    createdAt: '2026-02-10T14:30:00.000Z',
    approvedBy: 'Mastermind Admin',
  },
  {
    id: 'trx-1002',
    userId: 'usr-student-1',
    userName: 'Tanvir Ahmed',
    userEmail: 'student@mastermindaid.com',
    courseId: 'digital-marketing-pro',
    courseTitle: 'Digital Marketing & Meta Ads Specialist',
    amount: 3000,
    paymentMethod: 'Nagad',
    transactionId: 'NGD882741X',
    accountNumber: '01912876543',
    status: 'PENDING',
    createdAt: '2026-02-28T10:15:00.000Z',
  },
];

// Seed Enrollments
const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-1001',
    userId: 'usr-student-1',
    courseId: 'wp-plugin-dev-2026',
    courseTitle: 'WordPress Plugin Development Mastery 2026',
    courseThumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    progress: 40,
    completedLessons: ['les-wp-plugin-dev-2026-0-0', 'les-wp-plugin-dev-2026-0-1'],
    status: 'ACTIVE',
    enrolledAt: '2026-02-10T14:30:00.000Z',
  },
];

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

  static createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}`,
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

  static deleteUser(id: string): boolean {
    let users = this.getUsers();
    users = users.filter((u) => u.id !== id);
    saveData(STORAGE_KEYS.USERS, users);
    return true;
  }

  // Courses
  static getCourses(): Course[] {
    return loadData<Course[]>(STORAGE_KEYS.COURSES, mapInitialCourses());
  }

  static getPublishedCourses(): Course[] {
    return this.getCourses().filter((c) => c.status === 'PUBLISHED');
  }

  static getCourseById(id: string): Course | undefined {
    return this.getCourses().find((c) => c.id === id);
  }

  static createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: `crs-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    courses.unshift(newCourse);
    saveData(STORAGE_KEYS.COURSES, courses);
    return newCourse;
  }

  static updateCourse(id: string, updates: Partial<Course>): Course | undefined {
    const courses = this.getCourses();
    const idx = courses.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    courses[idx] = { ...courses[idx], ...updates, updatedAt: new Date().toISOString() };
    saveData(STORAGE_KEYS.COURSES, courses);
    return courses[idx];
  }

  static deleteCourse(id: string): boolean {
    let courses = this.getCourses();
    courses = courses.filter((c) => c.id !== id);
    saveData(STORAGE_KEYS.COURSES, courses);
    return true;
  }

  // Lessons inside Course
  static addLesson(courseId: string, lesson: Omit<Lesson, 'id' | 'courseId'>): Lesson | undefined {
    const course = this.getCourseById(courseId);
    if (!course) return undefined;

    const newLesson: Lesson = {
      ...lesson,
      id: `les-${Date.now()}`,
      courseId,
    };

    course.lessons.push(newLesson);
    course.lessonsCount = course.lessons.length;
    this.updateCourse(courseId, { lessons: course.lessons, lessonsCount: course.lessonsCount });
    return newLesson;
  }

  // Transactions
  static getTransactions(): Transaction[] {
    return loadData<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
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

    // If instant auto-approval or free course
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

    // If transaction becomes SUCCESS, ensure enrollment exists
    if (status === 'SUCCESS') {
      this.enrollUser(transactions[idx].userId, transactions[idx].courseId);
    }

    return transactions[idx];
  }

  // Enrollments
  static getEnrollments(): Enrollment[] {
    return loadData<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
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

    // Increment course studentsCount
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

  // Platform Analytics Stats
  static getStats(): PlatformStats {
    const users = this.getUsers();
    const courses = this.getCourses();
    const enrollments = this.getEnrollments();
    const transactions = this.getTransactions();

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
    };
  }
}
