import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/db';
import { Course, User, Transaction, Review, Comment, Category, AuditLog, ReviewStatus, CommentStatus, UserRole, WebsiteContentItem, CourseLevel, CourseStatus } from '../../types/platform';
import { 
  Layout, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  Search, 
  Check, 
  XCircle, 
  FileText, 
  Star, 
  MessageSquare, 
  Flag, 
  Tag, 
  History, 
  Eye, 
  EyeOff, 
  Copy, 
  AlertTriangle, 
  RotateCcw, 
  Key, 
  Globe, 
  Video, 
  Clock,
  X,
  Image as ImageIcon,
  User as UserIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { currentUser, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'users' | 'teachers' | 'reviews' | 'comments' | 'transactions' | 'categories' | 'audit' | 'administrators' | 'website-content'>('overview');
  
  // Administrator & Access Code Form states
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newTeacherAccessCode, setNewTeacherAccessCode] = useState('');
  const [newAdminSecurityCode, setNewAdminSecurityCode] = useState('');
  
  // Modals & Selection
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState<string[]>([]);
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Course Management Filter & Search states
  const [courseSearch, setCourseSearch] = useState('');
  const [courseFilterCategory, setCourseFilterCategory] = useState('ALL');
  const [courseFilterStatus, setCourseFilterStatus] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'UNPUBLISHED'>('ALL');

  // New Course Form state
  const [newTitle, setNewTitle] = useState('');
  const [newBengaliTitle, setNewBengaliTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newLevel, setNewLevel] = useState<CourseLevel>('All Levels');
  const [newPrice, setNewPrice] = useState('2500');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');
  const [newIsFree, setNewIsFree] = useState(false);
  const [newDurationHours, setNewDurationHours] = useState('12');
  const [newStatus, setNewStatus] = useState<CourseStatus>('PUBLISHED');
  const [newTeacherId, setNewTeacherId] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [newBengaliDescription, setNewBengaliDescription] = useState('');
  const [newFeatures, setNewFeatures] = useState('বাস্তবধর্মী লাইভ প্রজেক্ট\nলাইফটাইম এক্সেস ও মেম্বারশিপ\nঅভিজ্ঞ মেন্টর সাপোর্ট\nকোর্স সমাপ্তি সার্টিফিকেট');
  const [newRequirements, setNewRequirements] = useState('বেসিক কম্পিউটার ও ইন্টারনেট ব্যবহারের ধারণা\nশেখার আগ্রহ ও নিয়মিত অনুশীলনের মানসিকতা');

  // New Category Form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatBengali, setNewCatBengali] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const stats = DBService.getStats();
  const users = DBService.getUsers();
  const [coursesList, setCoursesList] = useState<Course[]>(() => DBService.getCourses());
  const courses = coursesList;

  useEffect(() => {
    const handleCoursesUpdated = () => {
      setCoursesList(DBService.getCourses());
    };
    window.addEventListener('mastermind_courses_updated', handleCoursesUpdated);
    window.addEventListener('storage', handleCoursesUpdated);
    return () => {
      window.removeEventListener('mastermind_courses_updated', handleCoursesUpdated);
      window.removeEventListener('storage', handleCoursesUpdated);
    };
  }, []);
  const [trxList, setTrxList] = useState<Transaction[]>(() => DBService.getTransactions());
  const [trxFilter, setTrxFilter] = useState<'ALL' | 'PENDING' | 'SUCCESS' | 'FAILED'>('ALL');
  const [trxSearch, setTrxSearch] = useState('');
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const reviews = DBService.getReviews();
  const comments = DBService.getComments();
  const categories = DBService.getCategories();
  const auditLogs = DBService.getAuditLogs();

  const teachers = users.filter((u) => u.role === 'TEACHER');
  const students = users.filter((u) => u.role === 'STUDENT');

  const pendingTrxCount = trxList.filter((t) => t.status === 'PENDING').length;

  const showAdminToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  const handleUpdateTrxStatus = (trxId: string, status: Transaction['status']) => {
    const updated = DBService.updateTransactionStatus(trxId, status, currentUser?.name || 'Admin');
    if (updated) {
      setTrxList(DBService.getTransactions());
      if (status === 'SUCCESS') {
        showAdminToast(`Enrollment approved for ${updated.userName} in "${updated.courseTitle}"! Access is now active.`);
      } else if (status === 'FAILED') {
        showAdminToast(`Request ${trxId} marked as Rejected.`);
      }
    }
  };

  // User Actions
  const handleToggleSuspendUser = (user: User) => {
    if (user.status === 'ACTIVE') {
      if (confirm(`Are you sure you want to suspend user ${user.name}?`)) {
        DBService.suspendUser(user.id, currentUser?.name || 'Admin');
        window.location.reload();
      }
    } else {
      DBService.unsuspendUser(user.id, currentUser?.name || 'Admin');
      window.location.reload();
    }
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    if (confirm(`Change user role to ${newRole}?`)) {
      DBService.updateUser(userId, { role: newRole });
      DBService.logAdminAction('usr-admin-1', currentUser?.name || 'Admin', `Changed role of user ${userId} to ${newRole}`, 'User', userId);
      window.location.reload();
    }
  };

  // Admin Course Edit & Content Modal States
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedCourseForMedia, setSelectedCourseForMedia] = useState<Course | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Website Content & CMS State
  const websiteContents = DBService.getWebsiteContents();
  const [editingContentItem, setEditingContentItem] = useState<WebsiteContentItem | null>(null);
  const [showNewLocationModal, setShowNewLocationModal] = useState(false);

  const [contentLocationKey, setContentLocationKey] = useState('');
  const [contentSectionName, setContentSectionName] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentSubtitle, setContentSubtitle] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [contentMediaType, setContentMediaType] = useState<'IMAGE' | 'VIDEO' | 'TEXT'>('IMAGE');
  const [contentMediaUrl, setContentMediaUrl] = useState('');
  const [contentAltText, setContentAltText] = useState('');
  const [contentButtonText, setContentButtonText] = useState('');
  const [contentButtonUrl, setContentButtonUrl] = useState('');

  const handleOpenEditContent = (item: WebsiteContentItem) => {
    setEditingContentItem(item);
    setContentLocationKey(item.locationKey);
    setContentSectionName(item.sectionName);
    setContentTitle(item.title || '');
    setContentSubtitle(item.subtitle || '');
    setContentDescription(item.description || '');
    setContentMediaType(item.mediaType);
    setContentMediaUrl(item.mediaUrl || '');
    setContentAltText(item.altText || '');
    setContentButtonText(item.buttonText || '');
    setContentButtonUrl(item.buttonUrl || '');
  };

  const handleSaveWebsiteContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentLocationKey.trim()) return;
    DBService.updateWebsiteContent(contentLocationKey, {
      sectionName: contentSectionName || contentLocationKey,
      title: contentTitle,
      subtitle: contentSubtitle,
      description: contentDescription,
      mediaType: contentMediaType,
      mediaUrl: contentMediaUrl,
      altText: contentAltText,
      buttonText: contentButtonText,
      buttonUrl: contentButtonUrl,
    }, currentUser?.name);
    setEditingContentItem(null);
    setShowNewLocationModal(false);
    alert('Website section content updated successfully! Public page will display updated media immediately.');
    window.location.reload();
  };

  // Course Thumbnail Presets
  const COURSE_THUMBNAIL_PRESETS = [
    { label: 'Web Development', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'SEO & Marketing', url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80' },
    { label: 'UI/UX Design', url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mobile App', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80' },
    { label: 'AI & Data', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80' },
    { label: 'Video & Media', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80' },
  ];

  // Edit Course Form State
  const [editTitle, setEditTitle] = useState('');
  const [editBengaliTitle, setEditBengaliTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBengaliDescription, setEditBengaliDescription] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editPrice, setEditPrice] = useState('2500');
  const [editDiscountPrice, setEditDiscountPrice] = useState('');
  const [editIsFree, setEditIsFree] = useState(false);
  const [editCategory, setEditCategory] = useState('Web Development');
  const [editLevel, setEditLevel] = useState<CourseLevel>('All Levels');
  const [editDuration, setEditDuration] = useState('15');
  const [editStatus, setEditStatus] = useState<CourseStatus>('PUBLISHED');
  const [editBadge, setEditBadge] = useState('');
  const [editTeacherId, setEditTeacherId] = useState('');
  const [editFeatures, setEditFeatures] = useState('');
  const [editRequirements, setEditRequirements] = useState('');

  // Video Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('15 mins');

  // PDF Form State
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  // Admin Profile & Security Modal States
  const [showAdminProfileModal, setShowAdminProfileModal] = useState(false);
  const [adminProfileName, setAdminProfileName] = useState(currentUser?.name || '');
  const [adminProfilePhone, setAdminProfilePhone] = useState(currentUser?.phone || '');
  const [adminProfileAvatar, setAdminProfileAvatar] = useState(currentUser?.avatar || '');
  const [adminProfileBio, setAdminProfileBio] = useState(currentUser?.bio || '');
  const [adminCurrentPassword, setAdminCurrentPassword] = useState('');
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState('');
  const [adminShowOldPass, setAdminShowOldPass] = useState(false);
  const [adminShowNewPass, setAdminShowNewPass] = useState(false);
  const [adminShowConfirmPass, setAdminShowConfirmPass] = useState(false);
  const [adminModalTab, setAdminModalTab] = useState<'profile' | 'password'>('profile');

  const handleOpenAdminProfile = () => {
    if (currentUser) {
      setAdminProfileName(currentUser.name || '');
      setAdminProfilePhone(currentUser.phone || '');
      setAdminProfileAvatar(currentUser.avatar || '');
      setAdminProfileBio(currentUser.bio || '');
    }
    setAdminCurrentPassword('');
    setAdminNewPassword('');
    setAdminConfirmPassword('');
    setShowAdminProfileModal(true);
  };

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfileName.trim()) {
      showAdminToast('Admin name cannot be empty.');
      return;
    }
    const res = await updateProfile({
      name: adminProfileName.trim(),
      phone: adminProfilePhone.trim(),
      avatar: adminProfileAvatar.trim(),
      bio: adminProfileBio.trim(),
    });
    if (res.success) {
      showAdminToast('Admin profile updated successfully!');
      setShowAdminProfileModal(false);
    } else {
      showAdminToast(res.error || 'Failed to update profile.');
    }
  };

  const handleSaveAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNewPassword || adminNewPassword.length < 6) {
      showAdminToast('Password must be at least 6 characters.');
      return;
    }
    if (adminNewPassword !== adminConfirmPassword) {
      showAdminToast('Passwords do not match.');
      return;
    }
    const res = await changePassword(adminCurrentPassword, adminNewPassword);
    if (res.success) {
      showAdminToast('Admin password updated successfully!');
      setAdminCurrentPassword('');
      setAdminNewPassword('');
      setAdminConfirmPassword('');
      setShowAdminProfileModal(false);
    } else {
      showAdminToast(res.error || 'Failed to update password.');
    }
  };

  // Course Actions
  const handleOpenEditCourse = (course: Course) => {
    setEditingCourse(course);
    setEditTitle(course.title);
    setEditBengaliTitle(course.bengaliTitle || course.title);
    setEditDescription(course.description || '');
    setEditBengaliDescription(course.bengaliDescription || '');
    setEditThumbnail(course.thumbnail || (course as any).image || COURSE_THUMBNAIL_PRESETS[0].url);
    const isActuallyFree = Boolean(course.isFree || course.price === 0);
    setEditIsFree(isActuallyFree);
    setEditPrice(isActuallyFree ? '0' : course.price.toString());
    setEditDiscountPrice(course.discountPrice ? course.discountPrice.toString() : (course.originalPrice ? course.originalPrice.toString() : ''));
    setEditCategory(course.category || 'Web Development');
    setEditLevel(course.level || 'All Levels');
    setEditDuration(course.durationHours ? course.durationHours.toString() : '12');
    setEditStatus(course.status || 'PUBLISHED');
    setEditBadge(course.badge || '');
    setEditTeacherId(course.teacherId || (teachers[0]?.id || ''));
    setEditFeatures((course.features || []).join('\n'));
    setEditRequirements((course.requirements || []).join('\n'));
  };

  const handleSaveEditCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !editTitle.trim()) return;

    const parsedPrice = parseFloat(editPrice) || 0;
    const isFreeFinal = editIsFree || parsedPrice === 0;
    const finalPrice = isFreeFinal ? 0 : parsedPrice;
    const discountNum = editDiscountPrice ? parseFloat(editDiscountPrice) : undefined;
    const selectedTeacher = teachers.find((t) => t.id === editTeacherId);

    const parsedFeatures = editFeatures
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedRequirements = editRequirements
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = DBService.updateCourse(editingCourse.id, {
      title: editTitle.trim(),
      bengaliTitle: editBengaliTitle.trim() || editTitle.trim(),
      description: editDescription.trim(),
      bengaliDescription: editBengaliDescription.trim(),
      thumbnail: editThumbnail.trim() || editingCourse.thumbnail,
      image: editThumbnail.trim() || editingCourse.thumbnail,
      price: finalPrice,
      originalPrice: discountNum,
      discountPrice: discountNum,
      isFree: isFreeFinal,
      category: editCategory,
      categoryId: editCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      level: editLevel,
      durationHours: parseInt(editDuration) || 12,
      status: editStatus,
      badge: editBadge.trim() || undefined,
      teacherId: selectedTeacher ? selectedTeacher.id : (editTeacherId || editingCourse.teacherId),
      teacherName: selectedTeacher ? selectedTeacher.name : (editingCourse.teacherName || 'Hasibul Islam'),
      teacherAvatar: selectedTeacher ? selectedTeacher.avatar : editingCourse.teacherAvatar,
      features: parsedFeatures.length > 0 ? parsedFeatures : editingCourse.features,
      requirements: parsedRequirements.length > 0 ? parsedRequirements : editingCourse.requirements,
    }, currentUser?.name || 'Admin');

    setCoursesList(DBService.getCourses());
    setEditingCourse(null);
    showAdminToast(`Course "${updated?.title || editTitle}" updated successfully!`);
  };

  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForMedia || !videoTitle.trim() || !videoUrl.trim()) return;
    DBService.addLessonToCourse(selectedCourseForMedia.id, {
      title: videoTitle,
      description: `Lecture on ${videoTitle}`,
      videoUrl: videoUrl,
      duration: videoDuration || '15 mins',
      order: (selectedCourseForMedia.lessons?.length || 0) + 1,
      isPreview: false,
    }, currentUser?.name);
    setCoursesList(DBService.getCourses());
    setVideoTitle('');
    setVideoUrl('');
    setShowVideoModal(false);
    showAdminToast('Video lecture added to course!');
  };

  const handleAddPdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForMedia || !pdfTitle.trim() || !pdfUrl.trim()) return;
    DBService.addPdfResourceToCourse(selectedCourseForMedia.id, {
      title: pdfTitle,
      url: pdfUrl,
      fileSize: '2.5 MB',
    }, currentUser?.name);
    setCoursesList(DBService.getCourses());
    setPdfTitle('');
    setPdfUrl('');
    setShowPdfModal(false);
    showAdminToast('PDF document attached to course!');
  };

  const handleTogglePublishCourse = (course: Course) => {
    const nextStatus = course.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
    DBService.updateCourse(course.id, { status: nextStatus }, currentUser?.name);
    setCoursesList(DBService.getCourses());
    showAdminToast(`Course "${course.title}" status changed to ${nextStatus}.`);
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showAdminToast('Please provide a course title.');
      return;
    }

    const parsedPrice = parseFloat(newPrice) || 0;
    const isFreeFinal = newIsFree || parsedPrice === 0;
    const finalPrice = isFreeFinal ? 0 : parsedPrice;
    const discountNum = newDiscountPrice ? parseFloat(newDiscountPrice) : undefined;
    const selectedTeacher = teachers.find((t) => t.id === newTeacherId) || teachers[0];

    const parsedFeatures = newFeatures
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedRequirements = newRequirements
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const created = DBService.createCourse({
      title: newTitle.trim(),
      bengaliTitle: newBengaliTitle.trim() || newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: newDescription.trim() || 'Comprehensive practical masterclass designed for career success.',
      bengaliDescription: newBengaliDescription.trim() || newDescription.trim() || 'বাস্তবধর্মী ও ক্যারিয়ারমুখী পরিপূর্ণ কোর্স।',
      thumbnail: newThumbnail.trim() || COURSE_THUMBNAIL_PRESETS[0].url,
      image: newThumbnail.trim() || COURSE_THUMBNAIL_PRESETS[0].url,
      price: finalPrice,
      originalPrice: discountNum,
      discountPrice: discountNum,
      isFree: isFreeFinal,
      category: newCategory,
      categoryId: newCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      level: newLevel,
      durationHours: parseInt(newDurationHours) || 12,
      status: newStatus,
      teacherId: selectedTeacher?.id || 'usr-teacher-1',
      teacherName: selectedTeacher?.name || 'Hasibul Islam',
      teacherAvatar: selectedTeacher?.avatar,
      badge: newBadge.trim() || undefined,
      rating: 5,
      reviewCount: 1,
      studentsCount: 0,
      lessonsCount: 10,
      requirements: parsedRequirements.length > 0 ? parsedRequirements : ['Basic computer & internet knowledge'],
      features: parsedFeatures.length > 0 ? parsedFeatures : ['Lifetime Access', 'Certificate of Completion', 'Dedicated Mentor Support'],
      lessons: [],
    }, currentUser?.name || 'Admin');

    setCoursesList(DBService.getCourses());
    setShowCourseModal(false);

    // Reset form
    setNewTitle('');
    setNewBengaliTitle('');
    setNewDescription('');
    setNewBengaliDescription('');
    setNewPrice('2500');
    setNewDiscountPrice('');
    setNewIsFree(false);
    setNewBadge('');

    showAdminToast(`Course "${created.title}" created and published successfully!`);
  };

  const handleDuplicateCourse = (course: Course) => {
    DBService.createCourse({
      ...course,
      title: `${course.title} (Copy)`,
      bengaliTitle: course.bengaliTitle ? `${course.bengaliTitle} (কপি)` : `${course.title} (Copy)`,
      slug: `${course.slug}-copy-${Date.now()}`,
      status: 'DRAFT',
      studentsCount: 0,
    }, currentUser?.name);
    setCoursesList(DBService.getCourses());
    showAdminToast('Course duplicated as DRAFT!');
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to permanently delete this course? All associated data will be removed.')) {
      DBService.deleteCourse(courseId, currentUser?.name);
      setCoursesList(DBService.getCourses());
      showAdminToast('Course deleted permanently.');
    }
  };

  // Review Actions
  const handleReviewStatus = (reviewId: string, status: ReviewStatus) => {
    DBService.updateReviewStatus(reviewId, status, currentUser?.name || 'Admin');
    window.location.reload();
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Delete this review permanently?')) {
      DBService.deleteReview(reviewId, currentUser?.name);
      window.location.reload();
    }
  };

  // Comment Actions
  const handleCommentStatus = (commentId: string, status: CommentStatus) => {
    DBService.updateCommentStatus(commentId, status, currentUser?.name || 'Admin');
    window.location.reload();
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm('Delete this comment permanently?')) {
      DBService.deleteComment(commentId, currentUser?.name);
      window.location.reload();
    }
  };

  // Category Action
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    DBService.createCategory({
      name: newCatName,
      bengaliName: newCatBengali || newCatName,
      description: newCatDesc || 'Skill development courses.',
      iconName: 'BookOpen',
    }, currentUser?.name || 'Admin');
    setNewCatName('');
    setNewCatBengali('');
    setNewCatDesc('');
    window.location.reload();
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim()) return;
    DBService.createAdminAccount(newAdminName, newAdminEmail, currentUser?.name || 'Admin');
    setNewAdminName('');
    setNewAdminEmail('');
    alert(`New Administrator account created for ${newAdminEmail}`);
    window.location.reload();
  };

  const handleRotateAccessCodes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherAccessCode.trim() && !newAdminSecurityCode.trim()) return;
    DBService.rotateAccessCodes(currentUser?.name || 'Admin', newTeacherAccessCode, newAdminSecurityCode);
    setNewTeacherAccessCode('');
    setNewAdminSecurityCode('');
    alert('Security Access Codes rotated successfully!');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0A192F] border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-brand-500 flex items-center justify-center text-white font-black shadow-lg">
              A
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight">MASTERMIND AIDIT Admin</h2>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Super CMS Portal</span>
            </div>
          </Link>

          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'overview', label: 'Overview & Analytics', icon: <Layout className="w-4 h-4" /> },
              { id: 'website-content', label: 'Website Content & CMS', icon: <Globe className="w-4 h-4 text-sky-400" /> },
              { id: 'courses', label: 'Course Management', icon: <BookOpen className="w-4 h-4" /> },
              { id: 'users', label: 'Users & Roles', icon: <Users className="w-4 h-4" /> },
              { id: 'teachers', label: 'Teachers', icon: <GraduationCap className="w-4 h-4" /> },
              { id: 'reviews', label: 'Reviews Moderation', icon: <Star className="w-4 h-4 text-amber-400" /> },
              { id: 'comments', label: 'Comments & Reports', icon: <MessageSquare className="w-4 h-4 text-rose-400" /> },
              { id: 'transactions', label: 'Transactions Ledger', icon: <CreditCard className="w-4 h-4 text-emerald-400" />, badge: pendingTrxCount },
              { id: 'categories', label: 'Category Manager', icon: <Tag className="w-4 h-4" /> },
              { id: 'administrators', label: 'Admins & Access Codes', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
              { id: 'audit', label: 'Audit Logs', icon: <History className="w-4 h-4 text-slate-400" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-900 animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div 
            onClick={handleOpenAdminProfile}
            className="flex items-center gap-2.5 text-xs text-slate-300 p-2 rounded-2xl hover:bg-white/5 cursor-pointer transition border border-transparent hover:border-purple-500/30"
            title="Click to edit Admin Profile & Password"
          >
            <img src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={currentUser?.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-400 shrink-0" />
            <div className="truncate">
              <div className="font-bold truncate text-white">{currentUser?.name}</div>
              <div className="text-[10px] text-purple-400 font-semibold truncate">{currentUser?.email}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenAdminProfile}
            className="w-full flex items-center justify-center gap-2 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <UserIcon className="w-3.5 h-3.5" /> Profile & Security
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-[#071325] p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black capitalize">Super Admin — {activeTab}</h1>
            <p className="text-xs text-slate-400 mt-1">Full management access to courses, reviews, comments, users, and audit logs.</p>
          </div>

          {activeTab === 'courses' && (
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Create Course
            </button>
          )}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {pendingTrxCount > 0 && (
              <div className="p-4 bg-amber-500/20 border border-amber-400/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-in fade-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-300">
                      {pendingTrxCount} Course Enrollment Request(s) Awaiting Approval!
                    </h4>
                    <p className="text-xs text-slate-300">
                      Students have submitted payments. Review and approve their requests to unlock their classroom.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-xl shadow transition shrink-0 cursor-pointer"
                >
                  Review Requests →
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Revenue</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">৳{stats.totalRevenue.toLocaleString()}</div>
              </div>

              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Courses</div>
                <div className="text-2xl sm:text-3xl font-black text-brand-400">{stats.totalCourses}</div>
              </div>

              <div className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Reported Comments</div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400">{stats.reportedComments}</div>
              </div>

              <div 
                onClick={() => setActiveTab('transactions')}
                className="bg-[#0A192F] p-5 rounded-2xl border border-slate-800 space-y-1 cursor-pointer hover:border-amber-400 transition"
                title="Click to view transactions"
              >
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                  <span>Pending Requests</span>
                  {pendingTrxCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-400">{pendingTrxCount}</div>
                <div className="text-[10px] text-amber-300 font-semibold">Click to manage & approve →</div>
              </div>
            </div>

            {/* Audit Feed */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                <span>Recent Admin Activity Logs</span>
              </h3>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {auditLogs.length === 0 ? (
                  <div className="text-xs text-slate-500 py-4 text-center">No recent activity logged.</div>
                ) : (
                  auditLogs.slice(0, 8).map((log) => (
                    <div key={log.id} className="p-3 bg-[#071325] rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-purple-300">{log.adminName}</span>: <span className="text-slate-200">{log.action}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Website Content CMS */}
        {activeTab === 'website-content' && (
          <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sky-400" />
                  <span>Website Content & Media Location Manager</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Manage homepage hero images, promotional videos, banner content, about section, and custom website locations dynamically.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingContentItem(null);
                  setContentLocationKey(`custom_section_${Date.now()}`);
                  setContentSectionName('New Custom Website Section');
                  setContentTitle('');
                  setContentSubtitle('');
                  setContentDescription('');
                  setContentMediaType('IMAGE');
                  setContentMediaUrl('');
                  setContentAltText('');
                  setContentButtonText('');
                  setContentButtonUrl('');
                  setShowNewLocationModal(true);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                + Add Content Location
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {websiteContents.map((item) => (
                <div key={item.id} className="bg-[#071325] p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full">
                        Location: {item.locationKey}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">{item.sectionName}</h4>
                    </div>

                    <button
                      onClick={() => handleOpenEditContent(item)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Manage
                    </button>
                  </div>

                  {item.mediaUrl && (
                    <div className="h-32 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                      {item.mediaType === 'VIDEO' ? (
                        <div className="text-center p-4">
                          <Video className="w-8 h-8 text-sky-400 mx-auto mb-1" />
                          <div className="text-[10px] text-slate-300 truncate max-w-xs font-mono">{item.mediaUrl}</div>
                        </div>
                      ) : (
                        <img src={item.mediaUrl} alt={item.altText || item.sectionName} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}

                  <div className="space-y-1 text-xs text-slate-300">
                    {item.title && <div className="font-bold text-white line-clamp-1">{item.title}</div>}
                    {item.description && <div className="text-slate-400 text-[11px] line-clamp-2">{item.description}</div>}
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/80 flex justify-between">
                    <span>Type: {item.mediaType}</span>
                    <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Courses */}
        {activeTab === 'courses' && (() => {
          const filteredCourses = coursesList.filter((c) => {
            if (courseFilterStatus !== 'ALL' && c.status !== courseFilterStatus) return false;
            if (courseFilterCategory !== 'ALL' && c.category.toLowerCase() !== courseFilterCategory.toLowerCase()) return false;
            if (courseSearch.trim()) {
              const q = courseSearch.toLowerCase();
              const matchTitle = c.title.toLowerCase().includes(q);
              const matchBengali = (c.bengaliTitle || '').toLowerCase().includes(q);
              const matchCat = c.category.toLowerCase().includes(q);
              const matchTeacher = (c.teacherName || '').toLowerCase().includes(q);
              return matchTitle || matchBengali || matchCat || matchTeacher;
            }
            return true;
          });

          return (
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-5">
              {/* Header & Controls Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      Course Management
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                        {coursesList.length} total
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Create, edit, attach video/PDF media, and publish courses live to students.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCourseModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-900/30 transition flex items-center gap-2 self-start lg:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create New Course
                </button>
              </div>

              {/* Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by title, teacher, category..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#071325] border border-slate-700/80 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={courseFilterCategory}
                    onChange={(e) => setCourseFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#071325] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="ALL">All Categories ({categories.length})</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={courseFilterStatus}
                    onChange={(e) => setCourseFilterStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#071325] border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="ALL">All Statuses ({coursesList.length})</option>
                    <option value="PUBLISHED">Published Only ({coursesList.filter((c) => c.status === 'PUBLISHED').length})</option>
                    <option value="DRAFT">Draft Only ({coursesList.filter((c) => c.status === 'DRAFT').length})</option>
                    <option value="UNPUBLISHED">Unpublished Only ({coursesList.filter((c) => c.status === 'UNPUBLISHED').length})</option>
                  </select>
                </div>
              </div>

              {/* Courses Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Course Info</th>
                      <th className="p-3">Category & Level</th>
                      <th className="p-3">Price (BDT)</th>
                      <th className="p-3">Instructor</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                          <p className="font-bold text-sm text-slate-300">No courses match your filter.</p>
                          <p className="text-xs text-slate-500 mt-1">Try resetting search or filters, or create a new course.</p>
                          <button
                            type="button"
                            onClick={() => { setCourseSearch(''); setCourseFilterCategory('ALL'); setCourseFilterStatus('ALL'); }}
                            className="mt-3 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg text-xs font-bold"
                          >
                            Reset Filters
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-900/40 transition">
                          <td className="p-3 font-bold text-white flex items-center gap-3">
                            <img
                              src={c.thumbnail || (c as any).image || COURSE_THUMBNAIL_PRESETS[0].url}
                              alt={c.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="truncate max-w-xs font-extrabold text-white text-sm" title={c.title}>
                                {c.title}
                              </div>
                              {c.bengaliTitle && c.bengaliTitle !== c.title && (
                                <div className="text-[11px] text-purple-300/80 truncate max-w-xs">
                                  {c.bengaliTitle}
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                                {c.badge && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase">
                                    {c.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-200">{c.category}</div>
                            <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              {c.level || 'All Levels'}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            {c.isFree || c.price === 0 ? (
                              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px]">FREE</span>
                            ) : (
                              <div>
                                <span className="text-emerald-400 font-extrabold text-sm">৳{c.price.toLocaleString()}</span>
                                {c.discountPrice && c.discountPrice > c.price && (
                                  <span className="text-slate-500 line-through text-[10px] ml-1.5">৳{c.discountPrice.toLocaleString()}</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="text-slate-300 font-medium">{c.teacherName || 'Hasibul Islam'}</div>
                            <span className="text-[10px] text-slate-500">{c.durationHours || 12} hrs</span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                c.status === 'PUBLISHED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : c.status === 'DRAFT'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCourse(c)}
                              className="px-2.5 py-1.5 bg-[#071325] hover:bg-slate-800 text-purple-300 border border-slate-700 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 shadow-sm transition"
                              title="Edit Course Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => { setSelectedCourseForMedia(c); setShowVideoModal(true); }}
                              className="px-2.5 py-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/30 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 transition"
                              title="Add Video Lecture"
                            >
                              + Video
                            </button>

                            <button
                              type="button"
                              onClick={() => { setSelectedCourseForMedia(c); setShowPdfModal(true); }}
                              className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-[11px] font-bold inline-flex items-center gap-1 transition"
                              title="Attach PDF Resource"
                            >
                              + PDF
                            </button>

                            <button
                              type="button"
                              onClick={() => handleTogglePublishCourse(c)}
                              className={`p-1.5 rounded-xl text-[10px] font-bold border transition inline-flex items-center ${
                                c.status === 'PUBLISHED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 text-slate-200'
                              }`}
                              title={c.status === 'PUBLISHED' ? 'Unpublish Course' : 'Publish Course Live'}
                            >
                              {c.status === 'PUBLISHED' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDuplicateCourse(c)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition inline-flex items-center"
                              title="Duplicate Course"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleDeleteCourse(c.id)}
                              className="p-1.5 bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 rounded-xl transition inline-flex items-center"
                              title="Delete Course Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* Tab 3: Users */}
        {activeTab === 'users' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                          className="bg-[#071325] border border-slate-700 text-xs text-white rounded-lg px-2 py-1"
                        >
                          <option value="STUDENT">STUDENT</option>
                          <option value="TEACHER">TEACHER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleToggleSuspendUser(u)}
                          className={`px-3 py-1 text-[11px] font-bold rounded-lg ${u.status === 'ACTIVE' ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'}`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Reviews Moderation (Requirement #8) */}
        {activeTab === 'reviews' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span>Reviews Moderation Engine</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Student</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Comment Text</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">No reviews found.</td>
                    </tr>
                  ) : (
                    reviews.map((r) => (
                      <tr key={r.id}>
                        <td className="p-3 font-bold text-white">{r.userName}</td>
                        <td className="p-3 truncate max-w-xs">{r.courseTitle}</td>
                        <td className="p-3 text-amber-400 font-bold">{r.rating} ★</td>
                        <td className="p-3 max-w-xs truncate">{r.comment}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          {r.status !== 'PUBLISHED' && (
                            <button onClick={() => handleReviewStatus(r.id, 'PUBLISHED')} className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">Approve</button>
                          )}
                          {r.status !== 'HIDDEN' && (
                            <button onClick={() => handleReviewStatus(r.id, 'HIDDEN')} className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg text-[10px]">Hide</button>
                          )}
                          <button onClick={() => handleDeleteReview(r.id)} className="p-1 bg-rose-500/20 text-rose-300 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Comments & Reports (Requirement #13 & #14) */}
        {activeTab === 'comments' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-400" />
              <span>Comment Moderation & Reported Posts</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Author</th>
                    <th className="p-3">Comment Content</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Report Reason</th>
                    <th className="p-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {comments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">No comments found.</td>
                    </tr>
                  ) : (
                    comments.map((c) => (
                      <tr key={c.id}>
                        <td className="p-3 font-bold text-white">{c.userName} ({c.userRole})</td>
                        <td className="p-3 max-w-sm truncate">{c.text}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'REPORTED' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3 text-rose-400 font-bold">{c.reportReason || '-'}</td>
                        <td className="p-3 text-right space-x-1">
                          <button onClick={() => handleCommentStatus(c.id, 'PUBLISHED')} className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]">Keep</button>
                          <button onClick={() => handleCommentStatus(c.id, 'HIDDEN')} className="px-2.5 py-1 bg-amber-600 text-white font-bold rounded-lg text-[10px]">Hide</button>
                          <button onClick={() => handleDeleteComment(c.id)} className="p-1 bg-rose-500/20 text-rose-300 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Transactions & Enrollment Requests Ledger */}
        {activeTab === 'transactions' && (
          <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>Course Enrollment Requests & Transactions Ledger</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Review student payment submissions, verify TrxID & mobile numbers, and approve course enrollments.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Total: {trxList.length}</span>
                {pendingTrxCount > 0 && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full text-xs font-black animate-pulse">
                    {pendingTrxCount} Pending Approval
                  </span>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#071325] p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-400">Total Requests</div>
                <div className="text-xl font-black text-white">{trxList.length}</div>
              </div>
              <div className="bg-[#071325] p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-amber-400">Pending Approvals</div>
                <div className="text-xl font-black text-amber-400">{pendingTrxCount}</div>
              </div>
              <div className="bg-[#071325] p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-emerald-400">Enrolled / Success</div>
                <div className="text-xl font-black text-emerald-400">
                  {trxList.filter((t) => t.status === 'SUCCESS').length}
                </div>
              </div>
              <div className="bg-[#071325] p-4 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-purple-400">Collected Revenue</div>
                <div className="text-xl font-black text-purple-400">
                  ৳{trxList.filter((t) => t.status === 'SUCCESS').reduce((sum, t) => sum + (t.amount || 0), 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student, TrxID, course, email..."
                  value={trxSearch}
                  onChange={(e) => setTrxSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {(['ALL', 'PENDING', 'SUCCESS', 'FAILED'] as const).map((filter) => {
                  const count = filter === 'ALL' ? trxList.length : trxList.filter((t) => t.status === filter).length;
                  return (
                    <button
                      key={filter}
                      onClick={() => setTrxFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                        trxFilter === filter
                          ? filter === 'PENDING'
                            ? 'bg-amber-500 text-slate-900 shadow-md font-black'
                            : 'bg-purple-600 text-white shadow-md'
                          : 'bg-[#071325] text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>{filter}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Transactions & Requests Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#071325] text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-800 tracking-wider">
                  <tr>
                    <th className="p-3.5 px-4">TrxID & Date</th>
                    <th className="p-3.5">Student Info</th>
                    <th className="p-3.5">Course Requested</th>
                    <th className="p-3.5">Amount & Gateway</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 px-4 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                  {trxList
                    .filter((t) => {
                      if (trxFilter !== 'ALL' && t.status !== trxFilter) return false;
                      if (trxSearch.trim()) {
                        const q = trxSearch.toLowerCase();
                        return (
                          t.transactionId.toLowerCase().includes(q) ||
                          t.courseTitle.toLowerCase().includes(q) ||
                          t.userName.toLowerCase().includes(q) ||
                          t.userEmail.toLowerCase().includes(q) ||
                          (t.accountNumber && t.accountNumber.includes(q))
                        );
                      }
                      return true;
                    })
                    .map((t) => (
                      <tr key={t.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-3.5 px-4 font-mono">
                          <div className="font-black text-white text-xs">{t.transactionId}</div>
                          <div className="text-[10px] text-slate-500">{new Date(t.createdAt).toLocaleString()}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-white text-xs">{t.userName}</div>
                          <div className="text-[10px] text-purple-400">{t.userEmail}</div>
                          {t.accountNumber && (
                            <div className="text-[10px] text-slate-400 font-mono">Ph: {t.accountNumber}</div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-100 max-w-xs line-clamp-2">{t.courseTitle}</div>
                          <span className="text-[10px] text-slate-500 font-mono">ID: {t.courseId}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-black text-emerald-400 text-xs">৳{t.amount.toLocaleString()} BDT</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                            {t.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {t.status === 'PENDING' ? (
                            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-black px-2.5 py-1 rounded-full animate-pulse">
                              <Clock className="w-3 h-3" /> PENDING
                            </span>
                          ) : t.status === 'SUCCESS' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="w-3 h-3" /> APPROVED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-black px-2.5 py-1 rounded-full">
                              <XCircle className="w-3 h-3" /> REJECTED
                            </span>
                          )}
                          {t.approvedBy && (
                            <div className="text-[9px] text-slate-500 mt-1 font-mono">by {t.approvedBy}</div>
                          )}
                        </td>
                        <td className="p-3.5 px-4 text-right">
                          {t.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateTrxStatus(t.id, 'SUCCESS')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition shadow flex items-center gap-1 cursor-pointer"
                                title="Approve payment & activate course enrollment for student"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateTrxStatus(t.id, 'FAILED')}
                                className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="Reject request"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : t.status === 'FAILED' ? (
                            <button
                              type="button"
                              onClick={() => handleUpdateTrxStatus(t.id, 'SUCCESS')}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                            >
                              Re-Approve
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  {trxList.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No transactions recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Teachers Directory */}
        {activeTab === 'teachers' && (
          <div className="bg-[#0A192F] p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <span>Faculty & Teachers Directory ({teachers.length})</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Instructors with teaching and curriculum management privileges.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((t) => (
                <div key={t.id} className="p-5 bg-[#071325] rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/50" />
                    <div>
                      <div className="font-extrabold text-white text-sm">{t.name}</div>
                      <div className="text-[10px] text-purple-400 font-semibold">{t.email}</div>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                        {t.status}
                      </span>
                    </div>
                  </div>
                  {t.bio && <p className="text-xs text-slate-400 line-clamp-2">{t.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 8: Categories Management */}
        {activeTab === 'categories' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-black">Manage Course Categories</h3>

            <form onSubmit={handleCreateCategory} className="grid sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                placeholder="Category Name (e.g. AI & Machine Learning)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white"
              />
              <input
                type="text"
                placeholder="Bengali Name"
                value={newCatBengali}
                onChange={(e) => setNewCatBengali(e.target.value)}
                className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-xs font-bold text-white"
              />
              <button type="submit" className="py-2.5 bg-purple-600 text-white rounded-xl text-xs font-extrabold shadow">
                + Add Category
              </button>
            </form>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 bg-[#071325] rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{cat.name}</div>
                    <div className="text-[10px] text-purple-400 font-semibold">{cat.bengaliName}</div>
                  </div>
                  <button onClick={() => DBService.deleteCategory(cat.id, currentUser?.name || 'Admin')} className="text-rose-400 hover:text-rose-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Administrators & Access Codes (Requirement #13 & #14) */}
        {activeTab === 'administrators' && (
          <div className="space-y-6">
            
            {/* Create Administrator Card */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Create Authorized Administrator Account</span>
              </h3>
              <p className="text-xs text-slate-400">Only existing authenticated Admins can provision another Administrator account.</p>

              <form onSubmit={handleCreateAdmin} className="grid sm:grid-cols-3 gap-3 text-xs font-bold">
                <input
                  type="text"
                  required
                  placeholder="Admin Name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
                <input
                  type="email"
                  required
                  placeholder="admin@mastermindaidit.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
                <button type="submit" className="py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow">
                  + Create Administrator
                </button>
              </form>
            </div>

            {/* Access Code Rotation Card */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-purple-500/30 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2 text-purple-300">
                <Key className="w-5 h-5 text-amber-400" />
                <span>Rotate System Security Access Codes</span>
              </h3>
              <p className="text-xs text-slate-400">Update server access codes for Teacher registration and Admin security login.</p>

              <form onSubmit={handleRotateAccessCodes} className="grid sm:grid-cols-3 gap-3 text-xs font-bold">
                <div>
                  <label className="block text-[11px] text-emerald-400 mb-1">New Teacher Code (Default: MASTERMIND10)</label>
                  <input
                    type="text"
                    placeholder="e.g. MASTERMIND2026"
                    value={newTeacherAccessCode}
                    onChange={(e) => setNewTeacherAccessCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-purple-400 mb-1">New Admin Code (Default: MASTERMIND ADMIN)</label>
                  <input
                    type="password"
                    placeholder="Enter new Admin security secret"
                    value={newAdminSecurityCode}
                    onChange={(e) => setNewAdminSecurityCode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-extrabold shadow">
                    Rotate Security Codes
                  </button>
                </div>
              </form>
            </div>

            {/* List of Admins */}
            <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-black text-white">Active Platform Administrators</h4>
              <div className="space-y-2">
                {users.filter((u) => u.role === 'ADMIN').map((adm) => (
                  <div key={adm.id} className="p-3.5 bg-[#071325] rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={adm.avatar} alt={adm.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500" />
                      <div>
                        <div className="font-extrabold text-white">{adm.name}</div>
                        <div className="text-[10px] text-purple-400 font-mono">{adm.email}</div>
                      </div>
                    </div>
                    <span className="bg-purple-500/20 text-purple-300 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                      SUPER ADMIN
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 9: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-[#0A192F] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-black flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              <span>Full System Audit Trail</span>
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-[#071325] rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-purple-300">{log.adminName}</span>: <span className="text-slate-200">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                    Create New Course
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      New
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    নতুন কোর্স তৈরি ও পাবলিশ করতে নিচের তথ্যগুলো পূরণ করুন।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCourseSubmit} className="space-y-5 text-xs font-bold">
              {/* Row 1: Title English & Bengali */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">
                    Course Title (English) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Full-Stack Web Development 2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">
                    বাংলা শিরোনাম (Bengali Title)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: আধুনিক ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট ২০২৬"
                    value={newBengaliTitle}
                    onChange={(e) => setNewBengaliTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Row 2: Category, Level & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {!categories.some((c) => c.name === newCategory) && newCategory && (
                      <option value={newCategory}>{newCategory}</option>
                    )}
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Course Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="All Levels">All Levels (সকল স্তর)</option>
                    <option value="Beginner">Beginner (প্রাথমিক)</option>
                    <option value="Intermediate">Intermediate (মধ্যম)</option>
                    <option value="Advanced">Advanced (উন্নত)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Publication Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="PUBLISHED">PUBLISHED (সরাসরি লাইভ)</option>
                    <option value="DRAFT">DRAFT (খসড়া)</option>
                    <option value="UNPUBLISHED">UNPUBLISHED (লুকানো)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Pricing & Duration */}
              <div className="p-4 bg-[#071325] rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
                    Pricing & Schedule
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newIsFree}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNewIsFree(checked);
                        if (checked) {
                          if (parseFloat(newPrice) > 0) {
                            setNewDiscountPrice(newPrice);
                          }
                          setNewPrice('0');
                        } else {
                          if (parseFloat(newPrice) === 0 || !newPrice) {
                            setNewPrice(newDiscountPrice && parseFloat(newDiscountPrice) > 0 ? newDiscountPrice : '2500');
                          }
                        }
                      }}
                      className="w-4 h-4 rounded text-purple-600 bg-[#0A192F] border-slate-700 focus:ring-0"
                    />
                    <span className="text-xs font-extrabold text-emerald-400">
                      {newIsFree ? '✓ Free Course (ফ্রি কোর্স)' : 'This is a FREE Course (ফ্রি কোর্স)'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 font-bold">
                      Selling Price (BDT ৳) {newIsFree && <span className="text-emerald-400">(FREE - 0 ৳)</span>}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 2500"
                      value={newPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewPrice(val);
                        const num = parseFloat(val);
                        if (!isNaN(num) && num > 0) {
                          setNewIsFree(false);
                        } else if (num === 0) {
                          setNewIsFree(true);
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Original Price (Strikethrough ৳)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 4500 (optional)"
                      value={newDiscountPrice}
                      onChange={(e) => setNewDiscountPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Total Duration (Hours)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 12"
                      value={newDurationHours}
                      onChange={(e) => setNewDurationHours(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Instructor & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Assigned Teacher</label>
                  <select
                    value={newTeacherId}
                    onChange={(e) => setNewTeacherId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Default: Hasibul Islam</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Badge / Tag (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller, New, Popular, Featured"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Row 5: Thumbnail with Presets and Live Preview */}
              <div className="p-4 bg-[#071325] rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase text-purple-400 tracking-wider">
                    Thumbnail Image
                  </label>
                  <span className="text-[10px] text-slate-400">Click a preset below or enter custom URL</span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {COURSE_THUMBNAIL_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNewThumbnail(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                        newThumbnail === preset.url
                          ? 'bg-purple-600 text-white'
                          : 'bg-[#0A192F] hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={newThumbnail}
                    onChange={(e) => setNewThumbnail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                  />

                  {/* Thumbnail Preview Box */}
                  <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
                    <img
                      src={newThumbnail || COURSE_THUMBNAIL_PRESETS[0].url}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = COURSE_THUMBNAIL_PRESETS[0].url;
                      }}
                    />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[8px] px-1 py-0.2 rounded text-white font-mono">
                      Preview
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 6: Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Course Summary (English)</label>
                  <textarea
                    rows={3}
                    placeholder="Brief summary of the course content and learning goals..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">কোর্সের বিবরণ (Bengali)</label>
                  <textarea
                    rows={3}
                    placeholder="কোর্সের বাংলা সংক্ষিপ্ত বিবরণ ও শিক্ষার্থীদের অর্জিত দক্ষতা..."
                    value={newBengaliDescription}
                    onChange={(e) => setNewBengaliDescription(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Row 7: Key Features & Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">
                    Key Features / What You'll Learn <span className="text-[10px] text-slate-400">(one per line)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={newFeatures}
                    onChange={(e) => setNewFeatures(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">
                    Prerequisites / Requirements <span className="text-[10px] text-slate-400">(one per line)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={newRequirements}
                    onChange={(e) => setNewRequirements(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-extrabold shadow-lg shadow-purple-900/40 flex items-center gap-2 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create & Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-600/30 border border-purple-500/40 text-purple-300 shadow-lg">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    Edit Course
                    <span className="text-[10px] text-slate-400 font-mono">({editingCourse.id})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update course details, pricing, level, and content across all platform pages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditCourse} className="space-y-5 text-xs font-bold">
              {/* Row 1: Title English & Bengali */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">
                    Course Title (English) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">
                    বাংলা শিরোনাম (Bengali Title)
                  </label>
                  <input
                    type="text"
                    value={editBengaliTitle}
                    onChange={(e) => setEditBengaliTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 2: Category, Level & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {!categories.some((c) => c.name === editCategory) && editCategory && (
                      <option value={editCategory}>{editCategory}</option>
                    )}
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Course Level</label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="All Levels">All Levels (সকল স্তর)</option>
                    <option value="Beginner">Beginner (প্রাথমিক)</option>
                    <option value="Intermediate">Intermediate (মধ্যম)</option>
                    <option value="Advanced">Advanced (উন্নত)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Publication Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-bold"
                  >
                    <option value="PUBLISHED">PUBLISHED (সরাসরি লাইভ)</option>
                    <option value="DRAFT">DRAFT (খসড়া)</option>
                    <option value="UNPUBLISHED">UNPUBLISHED (লুকানো)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Pricing & Duration */}
              <div className="p-4 bg-[#071325] rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
                    Pricing & Schedule
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editIsFree}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditIsFree(checked);
                        if (checked) {
                          if (parseFloat(editPrice) > 0) {
                            setEditDiscountPrice(editPrice);
                          }
                          setEditPrice('0');
                        } else {
                          if (parseFloat(editPrice) === 0 || !editPrice) {
                            setEditPrice(editDiscountPrice && parseFloat(editDiscountPrice) > 0 ? editDiscountPrice : '2500');
                          }
                        }
                      }}
                      className="w-4 h-4 rounded text-purple-600 bg-[#0A192F] border-slate-700 focus:ring-0"
                    />
                    <span className="text-xs font-extrabold text-emerald-400">
                      {editIsFree ? '✓ Free Course (ফ্রি কোর্স)' : 'This is a FREE Course (ফ্রি কোর্স)'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 font-bold">
                      Selling Price (BDT ৳) {editIsFree && <span className="text-emerald-400">(FREE - 0 ৳)</span>}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 2500"
                      value={editPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditPrice(val);
                        const num = parseFloat(val);
                        if (!isNaN(num) && num > 0) {
                          setEditIsFree(false);
                        } else if (num === 0) {
                          setEditIsFree(true);
                        }
                      }}
                      className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 font-bold">Original Price (Strikethrough ৳)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 4500 (optional)"
                      value={editDiscountPrice}
                      onChange={(e) => setEditDiscountPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1 font-bold">Total Duration (Hours)</label>
                    <input
                      type="number"
                      min="1"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Instructor & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Assigned Teacher</label>
                  <select
                    value={editTeacherId}
                    onChange={(e) => setEditTeacherId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {!teachers.some((t) => t.id === editTeacherId) && editTeacherId && (
                      <option value={editTeacherId}>{editingCourse.teacherName || 'Assigned Teacher'}</option>
                    )}
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Badge / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller, New, Popular, Featured"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 5: Thumbnail with Presets & Live Preview */}
              <div className="p-4 bg-[#071325] rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase text-purple-400 tracking-wider">
                    Thumbnail Image
                  </label>
                  <span className="text-[10px] text-slate-400">Click a preset below or enter custom URL</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {COURSE_THUMBNAIL_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setEditThumbnail(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                        editThumbnail === preset.url
                          ? 'bg-purple-600 text-white'
                          : 'bg-[#0A192F] hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="url"
                    required
                    value={editThumbnail}
                    onChange={(e) => setEditThumbnail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0A192F] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                  />

                  <div className="w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 relative">
                    <img
                      src={editThumbnail || COURSE_THUMBNAIL_PRESETS[0].url}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = COURSE_THUMBNAIL_PRESETS[0].url;
                      }}
                    />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[8px] px-1 py-0.2 rounded text-white font-mono">
                      Preview
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 6: Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">Course Summary (English)</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">কোর্সের বিবরণ (Bengali)</label>
                  <textarea
                    rows={3}
                    value={editBengaliDescription}
                    onChange={(e) => setEditBengaliDescription(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 7: Key Features & Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">
                    Key Features / What You'll Learn <span className="text-[10px] text-slate-400">(one per line)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={editFeatures}
                    onChange={(e) => setEditFeatures(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1.5 font-bold">
                    Prerequisites / Requirements <span className="text-[10px] text-slate-400">(one per line)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={editRequirements}
                    onChange={(e) => setEditRequirements(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow-lg shadow-purple-900/40 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Video Modal */}
      {showVideoModal && selectedCourseForMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">Add Video to {selectedCourseForMedia.title}</h3>
            <form onSubmit={handleAddVideoSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 1: System Overview"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Video URL (YouTube embed or MP4)</label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/embed/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="15 mins"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowVideoModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-500 text-white rounded-xl font-extrabold shadow">+ Add Video</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin PDF Modal */}
      {showPdfModal && selectedCourseForMedia && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-xl font-black">Attach PDF to {selectedCourseForMedia.title}</h3>
            <form onSubmit={handleAddPdfSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1">PDF Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cheat Sheet PDF"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">PDF File Document URL</label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com/file.pdf"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowPdfModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-white rounded-xl font-extrabold shadow">+ Attach PDF</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Website Content Editor Modal */}
      {(editingContentItem || showNewLocationModal) && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A192F] text-white p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black">
              {editingContentItem ? `Manage Content: ${editingContentItem.sectionName}` : 'Add New Content Location'}
            </h3>

            <form onSubmit={handleSaveWebsiteContent} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-300 mb-1">Section Location Key (Unique identifier)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. homepage_hero"
                  value={contentLocationKey}
                  onChange={(e) => setContentLocationKey(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Section Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Homepage Hero Showcase"
                  value={contentSectionName}
                  onChange={(e) => setContentSectionName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Media Type</label>
                  <select
                    value={contentMediaType}
                    onChange={(e) => setContentMediaType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="VIDEO">Video</option>
                    <option value="TEXT">Text Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Media File / Video URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or https://youtube.com/embed/..."
                    value={contentMediaUrl}
                    onChange={(e) => setContentMediaUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Headline Title</label>
                <input
                  type="text"
                  placeholder="Main Section Headline"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Subtitle / Badge Text</label>
                <input
                  type="text"
                  placeholder="Subtitle or Badge Label"
                  value={contentSubtitle}
                  onChange={(e) => setContentSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  placeholder="Section overview paragraph..."
                  value={contentDescription}
                  onChange={(e) => setContentDescription(e.target.value)}
                  className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Explore All Courses"
                    value={contentButtonText}
                    onChange={(e) => setContentButtonText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Button Target Link URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /courses"
                    value={contentButtonUrl}
                    onChange={(e) => setContentButtonUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setEditingContentItem(null); setShowNewLocationModal(false); }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-extrabold shadow"
                >
                  Save Section Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Profile & Security Modal */}
      {showAdminProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0B1B33] border border-purple-500/40 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Admin Profile & Security</h3>
                  <p className="text-[11px] text-slate-400">Manage administrator account and reset password</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminProfileModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-[#071325] rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setAdminModalTab('profile')}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                  adminModalTab === 'profile' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin Profile Details
              </button>
              <button
                type="button"
                onClick={() => setAdminModalTab('password')}
                className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                  adminModalTab === 'password' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Reset / Change Password
              </button>
            </div>

            {/* Profile Tab */}
            {adminModalTab === 'profile' && (
              <form onSubmit={handleSaveAdminProfile} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-300 mb-1">Admin Display Name</label>
                  <input
                    type="text"
                    required
                    value={adminProfileName}
                    onChange={(e) => setAdminProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Admin Email (Readonly)</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full px-4 py-2.5 bg-[#071325]/50 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +880 1712-949410"
                    value={adminProfilePhone}
                    onChange={(e) => setAdminProfilePhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Avatar Image URL</label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="url"
                      placeholder="Paste avatar URL"
                      value={adminProfileAvatar}
                      onChange={(e) => setAdminProfileAvatar(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                    />
                    <img
                      src={adminProfileAvatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt="Avatar Preview"
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500 shrink-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Admin Bio</label>
                  <textarea
                    rows={2}
                    value={adminProfileBio}
                    onChange={(e) => setAdminProfileBio(e.target.value)}
                    className="w-full p-3 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-normal"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminProfileModal(false)}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-extrabold shadow-lg transition cursor-pointer"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}

            {/* Password Tab */}
            {adminModalTab === 'password' && (
              <form onSubmit={handleSaveAdminPassword} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-slate-300 mb-1">Current Password (if configured)</label>
                  <div className="relative">
                    <input
                      type={adminShowOldPass ? 'text' : 'password'}
                      placeholder="Enter current password"
                      value={adminCurrentPassword}
                      onChange={(e) => setAdminCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowOldPass(!adminShowOldPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"
                    >
                      {adminShowOldPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={adminShowNewPass ? 'text' : 'password'}
                      required
                      placeholder="At least 6 characters"
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowNewPass(!adminShowNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"
                    >
                      {adminShowNewPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={adminShowConfirmPass ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={adminConfirmPassword}
                      onChange={(e) => setAdminConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#071325] border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setAdminShowConfirmPass(!adminShowConfirmPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"
                    >
                      {adminShowConfirmPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminProfileModal(false)}
                    className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white rounded-xl font-extrabold shadow-lg transition cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Toast Notification Popup */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}

    </div>
  );
};
