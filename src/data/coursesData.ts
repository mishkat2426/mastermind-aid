export interface Course {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  image: string;
  price: number;
  originalPrice?: number;
  isFree?: boolean;
  rating: number;
  reviewCount: number;
  studentsCount: number;
  lessonsCount: number;
  durationHours: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  instructor: {
    name: string;
    avatar: string;
    title: string;
  };
  badge?: string;
  description: string;
  bengaliTitle?: string;
  bengaliDescription?: string;
  curriculum: {
    sectionTitle: string;
    lessons: { title: string; duration: string; isPreview?: boolean }[];
  }[];
  requirements: string[];
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  bengaliName: string;
  count: number;
  iconName: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  timeAgo: string;
  comment: string;
  courseTaken: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'affiliate-marketing',
    name: 'Affiliate Marketing',
    bengaliName: 'অ্যাফিলিয়েট মার্কেটিং',
    count: 3,
    iconName: 'Share2',
    description: 'Learn how to earn passive income by promoting top products globally.'
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    bengaliName: 'ডিজিটাল মার্কেটিং',
    count: 8,
    iconName: 'Megaphone',
    description: 'Master Facebook ads, Google campaigns, content strategy & social media growth.'
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    bengaliName: 'ইমেইল মার্কেটিং',
    count: 4,
    iconName: 'Mail',
    description: 'Build high-converting email funnels, Mailchimp & Klaviyo campaigns.'
  },
  {
    id: 'freelancing',
    name: 'Freelancing',
    bengaliName: 'ফ্রিল্যান্সিং',
    count: 6,
    iconName: 'Briefcase',
    description: 'Complete guide to Fiverr, Upwork, getting international clients & payout.'
  },
  {
    id: 'security-system',
    name: 'Security System',
    bengaliName: 'সিকিউরিটি সিস্টেম',
    count: 3,
    iconName: 'ShieldCheck',
    description: 'CCTV setup, ethical hacking basics, server & network security.'
  },
  {
    id: 'seo',
    name: 'SEO & Content',
    bengaliName: 'এসইও ও কনটেন্ট',
    count: 7,
    iconName: 'Search',
    description: 'Rank websites #1 on Google with On-Page, Off-Page & Technical SEO.'
  },
  {
    id: 'web-design',
    name: 'Web Design',
    bengaliName: 'ওয়েব ডিজাইন',
    count: 5,
    iconName: 'Layout',
    description: 'HTML5, CSS3, Tailwind CSS, Responsive Web Design & UI UX principles.'
  },
  {
    id: 'web-development',
    name: 'Web Development',
    bengaliName: 'ওয়েব ডেভেলপমেন্ট',
    count: 9,
    iconName: 'Code',
    description: 'Full-stack development with JavaScript, React, Node.js & Databases.'
  },
  {
    id: 'wordpress',
    name: 'WordPress Development',
    bengaliName: 'ওয়ার্ডপ্রেস ডেভেলপমেন্ট',
    count: 12,
    iconName: 'Globe',
    description: 'Custom theme creation, Elementor pro, WooCommerce & Plugin dev.'
  }
];

export const COURSES: Course[] = [
  {
    id: 'wp-plugin-dev-complete',
    title: 'WordPress Plugin Development Mastery 2026',
    bengaliTitle: 'ওয়ার্ডপ্রেস প্লাগইন ডেভেলপমেন্ট সম্পূর্ণ কোর্স',
    category: 'WordPress Development',
    categoryId: 'wordpress',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    price: 0,
    originalPrice: 3500,
    isFree: true,
    rating: 4.9,
    reviewCount: 38,
    studentsCount: 1420,
    lessonsCount: 34,
    durationHours: 22.5,
    level: 'Intermediate',
    badge: 'FREE POPULAR',
    instructor: {
      name: 'Hasibul Islam',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'Senior WordPress & PHP Architect'
    },
    description: 'Learn step-by-step how to code custom WordPress plugins from scratch using PHP, REST API, Hooks, Shortcodes, and custom database tables.',
    bengaliDescription: 'প্লাগইন তৈরির জন্য পিএইচপি, মেটা বক্স, রেন্সড ফাইল হ্যান্ডলিং ও কাস্টম ডেটাবেস টেবিল সম্পূর্ণ প্র্যাক্টিক্যালভাবে শিখুন।',
    curriculum: [
      {
        sectionTitle: 'Module 1: Introduction & Environment Setup',
        lessons: [
          { title: 'Welcome to Mastermind AidIT Academy', duration: '12:40', isPreview: true },
          { title: 'Setting Up Localhost (XAMPP & LocalWP)', duration: '18:15', isPreview: true },
          { title: 'Understanding Plugin File Structure & Headers', duration: '22:10' }
        ]
      },
      {
        sectionTitle: 'Module 2: Actions & Filter Hooks Mastery',
        lessons: [
          { title: 'Deep Dive into add_action and add_filter', duration: '35:20' },
          { title: 'Building Custom Shortcodes with Parameters', duration: '28:45' },
          { title: 'Registering Admin Menu Pages & Settings API', duration: '40:15' }
        ]
      },
      {
        sectionTitle: 'Module 3: Custom Database & AJAX Requests',
        lessons: [
          { title: 'Creating Custom DB Tables with $wpdb', duration: '45:00' },
          { title: 'Handling Secure AJAX Submissions in WP', duration: '38:10' },
          { title: 'Deploying Your Plugin to WordPress.org', duration: '25:30' }
        ]
      }
    ],
    requirements: [
      'Basic knowledge of HTML, CSS, and elementary PHP',
      'A computer with Internet connection',
      'Eagerness to learn real-world web programming'
    ],
    features: [
      'Lifetime Access to all HD video lectures',
      'Downloadable source code & boilerplate files',
      'Dedicated Student Support Group Access',
      'Certificate of Completion upon finishing'
    ]
  },
  {
    id: 'digital-marketing-pro',
    title: 'Complete Digital Marketing & Ads Specialization 2026',
    bengaliTitle: 'ডিজিটাল মার্কেটিং ও ফেসবুক এডস স্পেশালাইজেশন',
    category: 'Digital Marketing',
    categoryId: 'digital-marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    price: 1500,
    originalPrice: 4000,
    isFree: false,
    rating: 4.8,
    reviewCount: 54,
    studentsCount: 2150,
    lessonsCount: 42,
    durationHours: 28.0,
    level: 'All Levels',
    badge: 'BEST SELLER',
    instructor: {
      name: 'Hasibul Islam',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'Digital Growth Strategist'
    },
    description: 'Master Meta Ads, Pixel setup, CAPI, Google Search & Display Ads, Sales Funnels, and Client Acquisition strategies for business success.',
    bengaliDescription: 'ফেসবুক এডস, পিক্সেল সেটআপ, কনভার্সন এপিআই, গুগল সার্চ এডস ও বিজনেস গ্রোথ স্ট্র্যাটেজি শিখুন।',
    curriculum: [
      {
        sectionTitle: 'Module 1: Foundations of Digital Marketing',
        lessons: [
          { title: 'Understanding Digital Marketing & Target Audience', duration: '15:30', isPreview: true },
          { title: 'Creating High-Converting Buyer Personas', duration: '20:10' }
        ]
      },
      {
        sectionTitle: 'Module 2: Meta Ads & Pixel Mastery',
        lessons: [
          { title: 'Meta Business Suite Setup & Ads Manager', duration: '30:45', isPreview: true },
          { title: 'Advanced Audience Targeting & Retargeting', duration: '45:20' },
          { title: 'Meta Pixel & Conversion API Setup', duration: '50:00' }
        ]
      }
    ],
    requirements: [
      'No prior marketing experience needed',
      'Basic social media familiarity'
    ],
    features: [
      'Live Q&A Sessions with Instructor',
      'Fiverr & Upwork Gig Setup Templates',
      'Real Campaign Budget Case Studies'
    ]
  },
  {
    id: 'freelancing-fiverr-upwork',
    title: 'Freelancing Career Blueprint: Fiverr & Upwork Success',
    bengaliTitle: 'ফ্রিল্যান্সিং ক্যারিয়ার ও গিগ র‍্যাঙ্কিং মাস্টারক্লাস',
    category: 'Freelancing',
    categoryId: 'freelancing',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    price: 0,
    originalPrice: 2500,
    isFree: true,
    rating: 5.0,
    reviewCount: 62,
    studentsCount: 3800,
    lessonsCount: 25,
    durationHours: 16.5,
    level: 'Beginner',
    badge: 'FREE',
    instructor: {
      name: 'Tanvir Ahmed',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      title: 'Top Rated Freelancer & Mentor'
    },
    description: 'Learn how to create a winning profile, optimize Fiverr gigs for top ranking, craft compelling proposal letters on Upwork, and receive international payments safely in Bangladesh.',
    bengaliDescription: 'ফাইভার ও আপওয়ার্কে একাউন্ট খোলা, গিগ রিচার্জ, অপটিমাইজেশন এবং আন্তর্জাতিক ক্লায়েন্ট হ্যান্ডলিং গাইড।',
    curriculum: [
      {
        sectionTitle: 'Module 1: Getting Started with International Freelancing',
        lessons: [
          { title: 'Selecting Your Freelance Niche & Skills', duration: '14:20', isPreview: true },
          { title: 'Fiverr Profile Setup & Gig Keyword Research', duration: '28:10', isPreview: true }
        ]
      },
      {
        sectionTitle: 'Module 2: Winning Proposals & Payouts',
        lessons: [
          { title: 'Writing Cover Letters That Win Clients on Upwork', duration: '32:15' },
          { title: 'Payoneer to BKash / Bank Transfer Setup', duration: '18:50' }
        ]
      }
    ],
    requirements: ['Computer/Laptop', 'Basic English writing skills'],
    features: ['Proven Cover Letter Templates', 'Client Communication Scripts', 'Payoneer Setup Guide']
  },
  {
    id: 'seo-mastery-bangladesh',
    title: 'Advanced SEO & Content Ranking Blueprint 2026',
    bengaliTitle: 'অ্যাডভান্সড এসইও ও গুগল ফার্স্ট পেজ র‍্যাঙ্কিং',
    category: 'SEO & Content',
    categoryId: 'seo',
    image: 'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?auto=format&fit=crop&w=800&q=80',
    price: 2000,
    originalPrice: 4500,
    isFree: false,
    rating: 4.9,
    reviewCount: 45,
    studentsCount: 1620,
    lessonsCount: 38,
    durationHours: 24.0,
    level: 'Intermediate',
    badge: 'POPULAR',
    instructor: {
      name: 'Hasibul Islam',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'SEO Strategist & Niche Site Owner'
    },
    description: 'Learn Keyword Research, Technical SEO, On-Page Optimization, Schema Markup, Link Building, and Rank Math/Yoast SEO strategies.',
    bengaliDescription: 'কিওয়ার্ড রিসার্চ, টেকনিক্যাল এসইও, অন-পেজ ও অফ-পেজ ব্যাকলিংক স্ট্রেটেজি সম্পূর্ণ প্র্যাক্টিক্যাল।',
    curriculum: [
      {
        sectionTitle: 'Module 1: Keyword Research & Competitor Analysis',
        lessons: [
          { title: 'High Intent Keyword Research with Ahrefs & SEMrush', duration: '30:00', isPreview: true },
          { title: 'On-Page SEO Optimization & Headings Structure', duration: '35:40' }
        ]
      }
    ],
    requirements: ['Basic website understanding'],
    features: ['Keyword Checklist PDF', 'RankMath Pro Setup Tips', 'Lifetime Updates']
  },
  {
    id: 'web-design-frontend',
    title: 'Modern Responsive Web Design with HTML, CSS & Tailwind',
    bengaliTitle: 'রেসপন্সিভ ওয়েব ডিজাইন শিখুন এইচটিএমএল ও সিএসএস দিয়ে',
    category: 'Web Design',
    categoryId: 'web-design',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    price: 0,
    originalPrice: 3000,
    isFree: true,
    rating: 4.8,
    reviewCount: 29,
    studentsCount: 2450,
    lessonsCount: 30,
    durationHours: 19.5,
    level: 'Beginner',
    badge: 'FREE',
    instructor: {
      name: 'Sabbir Hossain',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      title: 'Lead Frontend UI Developer'
    },
    description: 'Build responsive, mobile-first websites using HTML5, CSS3, Flexbox, CSS Grid, and Tailwind CSS framework.',
    bengaliDescription: 'এইচটিএমএল৫, সিএসএস৩, টেলউইন্ড দিয়ে আধুনিক ওয়েবসাইট তৈরি করা শিখুন।',
    curriculum: [
      {
        sectionTitle: 'Module 1: HTML5 & CSS Layout Fundamentals',
        lessons: [
          { title: 'HTML5 Semantic Tags & Page Structure', duration: '18:30', isPreview: true },
          { title: 'CSS Flexbox & Responsive Grid Layouts', duration: '32:00', isPreview: true }
        ]
      }
    ],
    requirements: ['Computer and Code Editor (VS Code)'],
    features: ['5 Real Projects Codebase', 'Figma to HTML Conversion Guide']
  },
  {
    id: 'affiliate-marketing-mastery',
    title: 'Amazon & Niche Site Affiliate Marketing Blueprint',
    bengaliTitle: 'অ্যাফিলিয়েট মার্কেটিং ও এআই কনটেন্ট দিয়ে আয়',
    category: 'Affiliate Marketing',
    categoryId: 'affiliate-marketing',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    price: 2500,
    originalPrice: 5000,
    isFree: false,
    rating: 4.9,
    reviewCount: 31,
    studentsCount: 980,
    lessonsCount: 28,
    durationHours: 18.0,
    level: 'All Levels',
    badge: 'FEATURED',
    instructor: {
      name: 'Hasibul Islam',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'Affiliate Entrepreneur'
    },
    description: 'Learn how to build passive income affiliate blogs, research profitable niches, generate traffic, and monetize with Amazon Associates and Impact Radius.',
    bengaliDescription: 'অ্যামাজন অ্যাফিলিয়েট ওয়েবসাইটের মাধ্যমে প্যাসিভ ইনকাম শুরু করার পূর্ণাঙ্গ রূপরেখা।',
    curriculum: [
      {
        sectionTitle: 'Module 1: Niche Selection & Site Building',
        lessons: [
          { title: 'Finding Micro-Niches with Low Competition', duration: '25:10', isPreview: true },
          { title: 'Building Your Affiliate Portal on WordPress', duration: '40:00' }
        ]
      }
    ],
    requirements: ['Basic internet skills'],
    features: ['Niche Selection Matrix Sheet', 'Monetization Strategy Blueprint']
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Rakibul Hasan',
    role: 'Full-Stack Developer & Freelancer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    timeAgo: '2 months ago',
    comment: 'Mastermind AidIT-এর ওয়ার্ডপ্রেস প্লাগইন ডেভেলপমেন্ট কোর্সটি সত্যি অসাধারণ! স্যারের বোঝানোর কৌশল এবং প্র্যাক্টিক্যাল প্রজেক্টগুলো আমার ফ্রিল্যান্সিং ক্যারিয়ার পুরোপুরি বদলে দিয়েছে। এখন আমি ফাইবারে নিয়মিত কাজ পাচ্ছি।',
    courseTaken: 'WordPress Plugin Development Mastery 2026'
  },
  {
    id: 'rev-2',
    name: 'Mahmuda Akter',
    role: 'Digital Marketer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    timeAgo: '1 month ago',
    comment: 'Digital marketing and Meta Pixel setup concept was totally cleared to me through Mastermind AidIT. The free courses are even better than paid courses in other institutes!',
    courseTaken: 'Digital Marketing & Ads Specialization'
  },
  {
    id: 'rev-3',
    name: 'Kamrul Islam Siddiqui',
    role: 'SEO Consultant',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    timeAgo: '3 weeks ago',
    comment: 'Mastermind AidIT provides the highest quality e-learning content in Bangladesh. Direct instructor support in the private group is the best part.',
    courseTaken: 'Advanced SEO & Content Ranking'
  }
];

export const SEO_FAQ_ITEMS = [
  {
    question: 'Why is Mastermind AidIT considered the premier e-learning platform in Bangladesh?',
    answer: 'Mastermind AidIT focuses on high-quality, real-world skill development without fluffy theory. All courses are curated by industry experts like Hasibul Islam, offering lifetime access, project files, and dedicated student community support.'
  },
  {
    question: 'Are there completely free courses available on Mastermind AidIT?',
    answer: 'Yes! Mastermind AidIT offers premium-quality free courses in WordPress Plugin Development, Freelancing on Fiverr & Upwork, and Responsive Web Design so students can start learning without financial barrier.'
  },
  {
    question: 'How do I access course materials and videos after enrolling?',
    answer: 'Once you enroll in any course, it will immediately appear in your personal dashboard with lifetime 24/7 access on both Mobile phones and PC/Desktop.'
  },
  {
    question: 'Do I get a certificate after completing a course?',
    answer: 'Yes, after completing 100% of the course lectures and submitting practical assignments, you receive a verified Certificate of Completion from Mastermind AidIT.'
  }
];
