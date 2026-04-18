// Extended Mock API Data for CoachPro - Complete System
// This file simulates API responses with realistic data for all pages

// Users data (existing)
export const users = {
  admin: {
    id: 1,
    name: 'Admin User',
    email: 'admin@coachpro.com',
    role: 'admin',
    phone: '+91 98765 43210'
  },
  teacher: {
    id: 2,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@coachpro.com',
    role: 'teacher',
    phone: '+91 98765 43211',
    teacherId: 1,
    employeeId: 'TCH001',
    subject: 'Mathematics',
    qualification: 'PhD in Mathematics',
    experience: 12
  },
  student: {
    id: 3,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@coachpro.com',
    role: 'student',
    phone: '+91 98765 43212',
    studentId: 1,
    rollNumber: 'STD001',
    batch: 'Batch A',
    course: 'JEE Advanced',
    currentRank: 12,
    overallPercentage: 85.5,
    attendancePercentage: 92.0
  }
};

// Extended Students data
export const studentsData = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@coachpro.com',
    rollNumber: 'STD001',
    batch: 'Batch A',
    course: 'JEE Advanced',
    rank: 12,
    percentage: 85.5,
    attendance: 92.0,
    phone: '+91 98765 43212',
    dateOfBirth: '2005-03-15',
    address: '123 MG Road, Mumbai, Maharashtra 400001',
    parentName: 'Mr. Vijay Sharma',
    parentPhone: '+91 98765 43213',
    admissionDate: '2023-04-01'
  },
  {
    id: 2,
    name: 'Priya Desai',
    email: 'priya.desai@coachpro.com',
    rollNumber: 'STD002',
    batch: 'Batch B',
    course: 'NEET',
    rank: 2,
    percentage: 95.2,
    attendance: 96.5,
    phone: '+91 98765 43214',
    dateOfBirth: '2005-06-22',
    address: '456 FC Road, Pune, Maharashtra 411004',
    parentName: 'Mrs. Meera Desai',
    parentPhone: '+91 98765 43215',
    admissionDate: '2023-04-01'
  },
  {
    id: 3,
    name: 'Arjun Patel',
    email: 'arjun.patel@coachpro.com',
    rollNumber: 'STD003',
    batch: 'Batch A',
    course: 'JEE Advanced',
    rank: 1,
    percentage: 96.8,
    attendance: 98.0,
    phone: '+91 98765 43216',
    dateOfBirth: '2005-01-10',
    address: '789 SG Highway, Ahmedabad, Gujarat 380015',
    parentName: 'Mr. Kiran Patel',
    parentPhone: '+91 98765 43217',
    admissionDate: '2023-04-01'
  },
  {
    id: 4,
    name: 'Ananya Reddy',
    email: 'ananya.reddy@coachpro.com',
    rollNumber: 'STD004',
    batch: 'Batch C',
    course: 'JEE Mains',
    rank: 4,
    percentage: 93.5,
    attendance: 94.0,
    phone: '+91 98765 43218',
    dateOfBirth: '2005-09-18',
    address: '321 Banjara Hills, Hyderabad, Telangana 500034',
    parentName: 'Dr. Krishna Reddy',
    parentPhone: '+91 98765 43219',
    admissionDate: '2023-04-01'
  },
  {
    id: 5,
    name: 'Vikram Singh',
    email: 'vikram.singh@coachpro.com',
    rollNumber: 'STD005',
    batch: 'Batch A',
    course: 'JEE Advanced',
    rank: 3,
    percentage: 94.7,
    attendance: 95.5,
    phone: '+91 98765 43220',
    dateOfBirth: '2005-11-25',
    address: '567 Defence Colony, New Delhi 110024',
    parentName: 'Col. Rajendra Singh',
    parentPhone: '+91 98765 43221',
    admissionDate: '2023-04-01'
  },
  {
    id: 6,
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@coachpro.com',
    rollNumber: 'STD006',
    batch: 'Batch B',
    course: 'NEET',
    rank: 8,
    percentage: 89.2,
    attendance: 91.0,
    phone: '+91 98765 43222',
    dateOfBirth: '2005-04-30',
    address: '890 Indiranagar, Bangalore, Karnataka 560038',
    parentName: 'Mrs. Sunita Kapoor',
    parentPhone: '+91 98765 43223',
    admissionDate: '2023-04-01'
  },
  {
    id: 7,
    name: 'Aditya Malhotra',
    email: 'aditya.malhotra@coachpro.com',
    rollNumber: 'STD007',
    batch: 'Batch C',
    course: 'JEE Mains',
    rank: 15,
    percentage: 82.3,
    attendance: 88.5,
    phone: '+91 98765 43224',
    dateOfBirth: '2005-07-12',
    address: '234 Model Town, Chandigarh 160019',
    parentName: 'Mr. Rajiv Malhotra',
    parentPhone: '+91 98765 43225',
    admissionDate: '2023-04-01'
  },
  {
    id: 8,
    name: 'Kavya Iyer',
    email: 'kavya.iyer@coachpro.com',
    rollNumber: 'STD008',
    batch: 'Batch B',
    course: 'NEET',
    rank: 6,
    percentage: 91.8,
    attendance: 93.5,
    phone: '+91 98765 43226',
    dateOfBirth: '2005-02-28',
    address: '678 Anna Nagar, Chennai, Tamil Nadu 600040',
    parentName: 'Mr. Venkat Iyer',
    parentPhone: '+91 98765 43227',
    admissionDate: '2023-04-01'
  }
];

// Teachers data
export const teachersData = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@coachpro.com',
    employeeId: 'TCH001',
    subject: 'Mathematics',
    qualification: 'PhD in Mathematics',
    experience: 12,
    phone: '+91 98765 43230',
    joiningDate: '2020-01-15',
    totalStudents: 245,
    lecturesCompleted: 156,
    totalHours: 234,
    averageRating: 4.8
  },
  {
    id: 2,
    name: 'Prof. Amit Kumar',
    email: 'amit.kumar@coachpro.com',
    employeeId: 'TCH002',
    subject: 'Physics',
    qualification: 'M.Sc Physics, B.Ed',
    experience: 10,
    phone: '+91 98765 43231',
    joiningDate: '2020-06-01',
    totalStudents: 230,
    lecturesCompleted: 148,
    totalHours: 222,
    averageRating: 4.7
  },
  {
    id: 3,
    name: 'Ms. Lisa Chen',
    email: 'lisa.chen@coachpro.com',
    employeeId: 'TCH003',
    subject: 'Chemistry',
    qualification: 'M.Sc Chemistry',
    experience: 8,
    phone: '+91 98765 43232',
    joiningDate: '2021-03-10',
    totalStudents: 220,
    lecturesCompleted: 142,
    totalHours: 213,
    averageRating: 4.9
  },
  {
    id: 4,
    name: 'Dr. Rajesh Verma',
    email: 'rajesh.verma@coachpro.com',
    employeeId: 'TCH004',
    subject: 'Biology',
    qualification: 'PhD in Biology',
    experience: 15,
    phone: '+91 98765 43233',
    joiningDate: '2019-08-20',
    totalStudents: 210,
    lecturesCompleted: 138,
    totalHours: 207,
    averageRating: 4.6
  },
  {
    id: 5,
    name: 'Mr. David Lee',
    email: 'david.lee@coachpro.com',
    employeeId: 'TCH005',
    subject: 'English',
    qualification: 'MA English Literature',
    experience: 7,
    phone: '+91 98765 43234',
    joiningDate: '2021-07-01',
    totalStudents: 200,
    lecturesCompleted: 134,
    totalHours: 201,
    averageRating: 4.5
  }
];

// Attendance data
export const attendanceData = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Rahul Sharma',
    rollNumber: 'STD001',
    batch: 'Batch A',
    date: '2025-01-09',
    status: 'present',
    markedBy: 'Dr. Sarah Johnson',
    lectureId: 1
  },
  {
    id: 2,
    studentId: 2,
    studentName: 'Priya Desai',
    rollNumber: 'STD002',
    batch: 'Batch B',
    date: '2025-01-09',
    status: 'present',
    markedBy: 'Prof. Amit Kumar',
    lectureId: 2
  },
  {
    id: 3,
    studentId: 3,
    studentName: 'Arjun Patel',
    rollNumber: 'STD003',
    batch: 'Batch A',
    date: '2025-01-09',
    status: 'present',
    markedBy: 'Dr. Sarah Johnson',
    lectureId: 1
  },
  {
    id: 4,
    studentId: 4,
    studentName: 'Ananya Reddy',
    rollNumber: 'STD004',
    batch: 'Batch C',
    date: '2025-01-09',
    status: 'late',
    markedBy: 'Ms. Lisa Chen',
    lectureId: 3
  },
  {
    id: 5,
    studentId: 5,
    studentName: 'Vikram Singh',
    rollNumber: 'STD005',
    batch: 'Batch A',
    date: '2025-01-09',
    status: 'present',
    markedBy: 'Dr. Sarah Johnson',
    lectureId: 1
  },
  {
    id: 6,
    studentId: 6,
    studentName: 'Sneha Kapoor',
    rollNumber: 'STD006',
    batch: 'Batch B',
    date: '2025-01-09',
    status: 'absent',
    markedBy: 'Prof. Amit Kumar',
    lectureId: 2
  }
];

// Tests data
export const testsData = [
  {
    id: 1,
    name: 'Monthly Test - Mathematics',
    subject: 'Mathematics',
    batch: 'Batch A',
    date: '2025-01-05',
    maxMarks: 100,
    duration: 180,
    type: 'Monthly',
    status: 'Completed',
    totalStudents: 45,
    avgMarks: 78.5
  },
  {
    id: 2,
    name: 'Unit Test - Physics',
    subject: 'Physics',
    batch: 'Batch A',
    date: '2025-01-03',
    maxMarks: 100,
    duration: 120,
    type: 'Unit',
    status: 'Completed',
    totalStudents: 45,
    avgMarks: 75.2
  },
  {
    id: 3,
    name: 'Final Test - Chemistry',
    subject: 'Chemistry',
    batch: 'Batch B',
    date: '2025-01-15',
    maxMarks: 150,
    duration: 180,
    type: 'Final',
    status: 'Scheduled',
    totalStudents: 40,
    avgMarks: null
  },
  {
    id: 4,
    name: 'Weekly Test - Biology',
    subject: 'Biology',
    batch: 'Batch C',
    date: '2025-01-08',
    maxMarks: 50,
    duration: 60,
    type: 'Weekly',
    status: 'Completed',
    totalStudents: 38,
    avgMarks: 42.3
  },
  {
    id: 5,
    name: 'Mock Test - JEE Advanced',
    subject: 'Mathematics',
    batch: 'Batch A',
    date: '2025-01-20',
    maxMarks: 300,
    duration: 180,
    type: 'Mock',
    status: 'Scheduled',
    totalStudents: 45,
    avgMarks: null
  }
];

// Marks data
export const marksData = [
  {
    id: 1,
    testId: 1,
    testName: 'Monthly Test - Mathematics',
    studentId: 1,
    studentName: 'Rahul Sharma',
    rollNumber: 'STD001',
    batch: 'Batch A',
    marksObtained: 88,
    maxMarks: 100,
    percentage: 88,
    grade: 'A',
    remarks: 'Excellent performance'
  },
  {
    id: 2,
    testId: 1,
    testName: 'Monthly Test - Mathematics',
    studentId: 3,
    studentName: 'Arjun Patel',
    rollNumber: 'STD003',
    batch: 'Batch A',
    marksObtained: 96,
    maxMarks: 100,
    percentage: 96,
    grade: 'A+',
    remarks: 'Outstanding'
  },
  {
    id: 3,
    testId: 2,
    testName: 'Unit Test - Physics',
    studentId: 1,
    studentName: 'Rahul Sharma',
    rollNumber: 'STD001',
    batch: 'Batch A',
    marksObtained: 86,
    maxMarks: 100,
    percentage: 86,
    grade: 'A',
    remarks: 'Good work'
  },
  {
    id: 4,
    testId: 4,
    testName: 'Weekly Test - Biology',
    studentId: 4,
    studentName: 'Ananya Reddy',
    rollNumber: 'STD004',
    batch: 'Batch C',
    marksObtained: 47,
    maxMarks: 50,
    percentage: 94,
    grade: 'A+',
    remarks: 'Excellent'
  }
];

// Assignments data
export const assignmentsData = [
  {
    id: 1,
    title: 'Chapter 5 Problems',
    subject: 'Mathematics',
    batch: 'Batch A',
    description: 'Solve all problems from Chapter 5 - Differential Equations. Show complete working.',
    assignedDate: '2025-01-05',
    dueDate: '2025-01-12',
    maxMarks: 50,
    status: 'Active',
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    attachment: null,
    submittedCount: 32,
    totalStudents: 45
  },
  {
    id: 2,
    title: 'Calculus Worksheet',
    subject: 'Mathematics',
    batch: 'Batch B',
    description: 'Complete the calculus worksheet covering integration and differentiation.',
    assignedDate: '2025-01-06',
    dueDate: '2025-01-15',
    maxMarks: 40,
    status: 'Active',
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    attachment: 'calculus_worksheet.pdf',
    submittedCount: 28,
    totalStudents: 40
  },
  {
    id: 3,
    title: 'Integration Practice',
    subject: 'Mathematics',
    batch: 'Batch C',
    description: 'Practice set on definite and indefinite integration.',
    assignedDate: '2025-01-03',
    dueDate: '2025-01-10',
    maxMarks: 30,
    status: 'Active',
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    attachment: null,
    submittedCount: 35,
    totalStudents: 38
  },
  {
    id: 4,
    title: 'Newton Laws Homework',
    subject: 'Physics',
    batch: 'Batch A',
    description: 'Answer questions related to Newtons three laws of motion with real-world examples.',
    assignedDate: '2024-12-20',
    dueDate: '2024-12-31',
    maxMarks: 25,
    status: 'Completed',
    teacherId: 2,
    teacherName: 'Prof. Amit Kumar',
    attachment: null,
    submittedCount: 45,
    totalStudents: 45
  },
  {
    id: 5,
    title: 'Organic Chemistry Notes',
    subject: 'Chemistry',
    batch: 'Batch B',
    description: 'Prepare detailed notes on organic chemistry reactions. Draft saved, not published yet.',
    assignedDate: '2025-01-08',
    dueDate: '2025-01-18',
    maxMarks: 20,
    status: 'Draft',
    teacherId: 3,
    teacherName: 'Ms. Lisa Chen',
    attachment: null,
    submittedCount: 0,
    totalStudents: 40
  }
];

// Lectures data
export const lecturesData = [
  {
    id: 1,
    topic: 'Differential Equations',
    subject: 'Mathematics',
    batch: 'Batch A',
    date: '2025-01-08',
    startTime: '09:00',
    endTime: '11:00',
    duration: 2,
    type: 'Scheduled',
    status: 'Completed',
    notes: 'Covered first and second order differential equations with examples.',
    rating: 4.8,
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    attendanceMarked: true,
    presentCount: 42,
    absentCount: 3
  },
  {
    id: 2,
    topic: 'Integral Calculus',
    subject: 'Mathematics',
    batch: 'Batch B',
    date: '2025-01-09',
    startTime: '14:00',
    endTime: '15:30',
    duration: 1.5,
    type: 'Scheduled',
    status: 'Scheduled',
    notes: null,
    rating: null,
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    attendanceMarked: false,
    presentCount: null,
    absentCount: null
  },
  {
    id: 3,
    topic: 'Trigonometry Advanced',
    subject: 'Mathematics',
    batch: 'Batch A',
    date: '2025-01-10',
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    type: 'Direct',
    status: 'Scheduled',
    notes: null,
    rating: null,
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    attendanceMarked: false,
    presentCount: null,
    absentCount: null
  },
  {
    id: 4,
    topic: 'Quantum Mechanics Basics',
    subject: 'Physics',
    batch: 'Batch A',
    date: '2025-01-07',
    startTime: '11:00',
    endTime: '13:00',
    duration: 2,
    type: 'Scheduled',
    status: 'Completed',
    notes: 'Introduced wave-particle duality and uncertainty principle.',
    rating: 4.7,
    teacherId: 2,
    teacherName: 'Prof. Amit Kumar',
    attendanceMarked: true,
    presentCount: 43,
    absentCount: 2
  },
  {
    id: 5,
    topic: 'Organic Reactions',
    subject: 'Chemistry',
    batch: 'Batch B',
    date: '2025-01-09',
    startTime: '15:30',
    endTime: '17:00',
    duration: 1.5,
    type: 'Extra',
    status: 'Scheduled',
    notes: null,
    rating: null,
    teacherId: 3,
    teacherName: 'Ms. Lisa Chen',
    attendanceMarked: false,
    presentCount: null,
    absentCount: null
  }
];

// Notifications data
export const notificationsData = [
  {
    id: 1,
    title: 'New Assignment Posted',
    message: 'A new assignment "Chapter 5 Problems" has been posted for Batch A.',
    type: 'assignment',
    senderId: 2,
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'teacher',
    recipients: ['student'],
    recipientBatch: 'Batch A',
    date: '2025-01-05',
    time: '14:30',
    isRead: false,
    priority: 'normal'
  },
  {
    id: 2,
    title: 'Test Results Published',
    message: 'Results for Monthly Test - Mathematics are now available.',
    type: 'test',
    senderId: 2,
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'teacher',
    recipients: ['student'],
    recipientBatch: 'Batch A',
    date: '2025-01-06',
    time: '16:00',
    isRead: false,
    priority: 'high'
  },
  {
    id: 3,
    title: 'Holiday Announcement',
    message: 'The institute will remain closed on January 15th for Republic Day celebrations.',
    type: 'announcement',
    senderId: 1,
    senderName: 'Admin User',
    senderRole: 'admin',
    recipients: ['all'],
    recipientBatch: null,
    date: '2025-01-04',
    time: '10:00',
    isRead: true,
    priority: 'high'
  },
  {
    id: 4,
    title: 'Parent-Teacher Meeting',
    message: 'Parent-teacher meeting scheduled for January 20th. Please ensure attendance.',
    type: 'meeting',
    senderId: 1,
    senderName: 'Admin User',
    senderRole: 'admin',
    recipients: ['all'],
    recipientBatch: null,
    date: '2025-01-03',
    time: '11:30',
    isRead: true,
    priority: 'normal'
  },
  {
    id: 5,
    title: 'Low Attendance Alert',
    message: 'Your attendance has fallen below 85%. Please attend classes regularly.',
    type: 'alert',
    senderId: 1,
    senderName: 'System',
    senderRole: 'system',
    recipients: ['student'],
    recipientBatch: null,
    date: '2025-01-08',
    time: '09:00',
    isRead: false,
    priority: 'high'
  }
];

// Feedback data
export const feedbackData = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Rahul Sharma',
    teacherId: 1,
    teacherName: 'Dr. Sarah Johnson',
    subject: 'Mathematics',
    type: 'Performance',
    title: 'Excellent Progress',
    message: 'Rahul has shown excellent understanding of calculus concepts. Keep up the good work!',
    date: '2025-01-05',
    isRead: false
  },
  {
    id: 2,
    studentId: 1,
    studentName: 'Rahul Sharma',
    teacherId: 2,
    teacherName: 'Prof. Amit Kumar',
    subject: 'Physics',
    type: 'Improvement Needed',
    title: 'Practice Required',
    message: 'Need more practice on numerical problems in mechanics. Attend doubt sessions.',
    date: '2025-01-03',
    isRead: true
  },
  {
    id: 3,
    studentId: 2,
    studentName: 'Priya Desai',
    teacherId: 3,
    teacherName: 'Ms. Lisa Chen',
    subject: 'Chemistry',
    type: 'Appreciation',
    title: 'Outstanding Work',
    message: 'Priya\'s lab work and understanding of organic chemistry is exceptional.',
    date: '2025-01-07',
    isRead: false
  }
];

// Analytics data
export const analyticsData = {
  overview: {
    totalRevenue: '₹12,45,000',
    newAdmissions: 45,
    avgAttendance: 87.3,
    passPercentage: 92.5,
    topBatch: 'Batch A'
  },
  studentGrowth: [
    { month: 'Aug', students: 850 },
    { month: 'Sep', students: 900 },
    { month: 'Oct', students: 950 },
    { month: 'Nov', students: 980 },
    { month: 'Dec', students: 1000 }
  ],
  performanceDistribution: [
    { range: '90-100', count: 120 },
    { range: '80-89', count: 280 },
    { range: '70-79', count: 350 },
    { range: '60-69', count: 180 },
    { range: 'Below 60', count: 70 }
  ],
  attendanceDistribution: [
    { category: 'Excellent (>90%)', value: 450 },
    { category: 'Good (80-90%)', value: 350 },
    { category: 'Average (70-80%)', value: 150 },
    { category: 'Poor (<70%)', value: 50 }
  ],
  subjectPerformance: [
    { subject: 'Mathematics', avgScore: 78.5, students: 500 },
    { subject: 'Physics', avgScore: 75.2, students: 480 },
    { subject: 'Chemistry', avgScore: 80.1, students: 450 },
    { subject: 'Biology', avgScore: 77.8, students: 420 },
    { subject: 'English', avgScore: 82.3, students: 500 }
  ],
  teacherPerformanceDetailed: [
    { name: 'Dr. Sarah Johnson', lectures: 156, rating: 4.8, students: 245 },
    { name: 'Prof. Amit Kumar', lectures: 148, rating: 4.7, students: 230 },
    { name: 'Ms. Lisa Chen', lectures: 142, rating: 4.9, students: 220 },
    { name: 'Dr. Rajesh Verma', lectures: 138, rating: 4.6, students: 210 },
    { name: 'Mr. David Lee', lectures: 134, rating: 4.5, students: 200 }
  ],
  lectureTypeDistribution: [
    { type: 'Scheduled', count: 450 },
    { type: 'Direct', count: 120 },
    { type: 'Extra', count: 80 }
  ]
};

// Dashboard data (existing, keeping for compatibility)
export const adminDashboardData = {
  stats: {
    totalStudents: 1000,
    totalTeachers: 45,
    avgPerformance: 82.5,
    attendanceRate: 87.3,
    trends: {
      students: '+12%',
      teachers: '+5%',
      performance: '+3.2%',
      attendance: '+2.1%'
    }
  },
  batchPerformance: [
    { batch: 'Batch A', performance: 88.5 },
    { batch: 'Batch B', performance: 85.2 },
    { batch: 'Batch C', performance: 82.8 },
    { batch: 'Batch D', performance: 79.4 },
    { batch: 'Batch E', performance: 86.1 }
  ],
  attendanceToday: {
    present: 874,
    absent: 126
  },
  growthTrend: [
    { month: 'Jan', students: 850, teachers: 40 },
    { month: 'Feb', students: 900, teachers: 42 },
    { month: 'Mar', students: 950, teachers: 44 },
    { month: 'Apr', students: 1000, teachers: 45 }
  ],
  topStudents: [
    { rank: 1, name: 'Arjun Patel', batch: 'Batch A', percentage: 96.8 },
    { rank: 2, name: 'Priya Desai', batch: 'Batch B', percentage: 95.2 },
    { rank: 3, name: 'Vikram Singh', batch: 'Batch A', percentage: 94.7 },
    { rank: 4, name: 'Ananya Reddy', batch: 'Batch C', percentage: 93.5 },
    { rank: 5, name: 'Rohan Gupta', batch: 'Batch B', percentage: 92.8 }
  ],
  teacherPerformance: [
    { name: 'Dr. Sarah Johnson', subject: 'Mathematics', lectures: 156, rating: 4.8 },
    { name: 'Prof. Amit Kumar', subject: 'Physics', lectures: 148, rating: 4.7 },
    { name: 'Ms. Lisa Chen', subject: 'Chemistry', lectures: 142, rating: 4.9 },
    { name: 'Dr. Rajesh Verma', subject: 'Biology', lectures: 138, rating: 4.6 },
    { name: 'Mr. David Lee', subject: 'English', lectures: 134, rating: 4.5 }
  ]
};

export const teacherDashboardData = {
  stats: {
    totalStudents: 245,
    lecturesScheduled: 18,
    totalHours: 234,
    averageRating: 4.8
  },
  myStudents: studentsData.slice(0, 6),
  recentLectures: lecturesData.slice(0, 3),
  recentAssignments: assignmentsData.slice(0, 3)
};

export const studentDashboardData = {
  stats: {
    currentRank: 12,
    overallPercentage: 85.5,
    attendance: 92.0,
    pendingAssignments: 2
  },
  performanceTrend: [
    { month: 'Aug', percentage: 78.5 },
    { month: 'Sep', percentage: 80.2 },
    { month: 'Oct', percentage: 82.8 },
    { month: 'Nov', percentage: 84.1 },
    { month: 'Dec', percentage: 85.5 }
  ],
  subjectPerformance: [
    { subject: 'Mathematics', percentage: 88 },
    { subject: 'Physics', percentage: 86 },
    { subject: 'Chemistry', percentage: 84 },
    { subject: 'Biology', percentage: 85 },
    { subject: 'English', percentage: 82 }
  ],
  recentTests: [
    {
      id: 1,
      name: 'Monthly Test - Mathematics',
      date: '2025-01-05',
      marks: 88,
      maxMarks: 100,
      grade: 'A',
      subject: 'Mathematics'
    },
    {
      id: 2,
      name: 'Unit Test - Physics',
      date: '2025-01-03',
      marks: 86,
      maxMarks: 100,
      grade: 'A',
      subject: 'Physics'
    },
    {
      id: 3,
      name: 'Surprise Test - Chemistry',
      date: '2024-12-28',
      marks: 84,
      maxMarks: 100,
      grade: 'A',
      subject: 'Chemistry'
    }
  ],
  upcomingAssignments: assignmentsData.filter(a => a.status === 'Active').slice(0, 2).map(a => ({
    ...a,
    daysRemaining: Math.floor((new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
  }))
};

// Mock API functions
export const mockApi = {
  // Auth
  login: (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email.includes('admin')) {
          resolve({ user: users.admin, token: 'mock-admin-token' });
        } else if (email.includes('teacher') || email.includes('sarah')) {
          resolve({ user: users.teacher, token: 'mock-teacher-token' });
        } else {
          resolve({ user: users.student, token: 'mock-student-token' });
        }
      }, 500);
    });
  },

  // Admin APIs
  getAdminDashboard: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(adminDashboardData), 300);
    });
  },

  getStudents: (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...studentsData];
        if (filters.batch) {
          filtered = filtered.filter(s => s.batch === filters.batch);
        }
        if (filters.search) {
          const search = filters.search.toLowerCase();
          filtered = filtered.filter(s => 
            s.name.toLowerCase().includes(search) ||
            s.rollNumber.toLowerCase().includes(search) ||
            s.email.toLowerCase().includes(search)
          );
        }
        resolve(filtered);
      }, 300);
    });
  },

  getTeachers: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(teachersData), 300);
    });
  },

  getAttendance: (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...attendanceData];
        if (filters.date) {
          filtered = filtered.filter(a => a.date === filters.date);
        }
        if (filters.batch) {
          filtered = filtered.filter(a => a.batch === filters.batch);
        }
        resolve(filtered);
      }, 300);
    });
  },

  getTests: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(testsData), 300);
    });
  },

  getMarks: (testId = null) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (testId) {
          resolve(marksData.filter(m => m.testId === testId));
        }
        resolve(marksData);
      }, 300);
    });
  },

  getAnalytics: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(analyticsData), 300);
    });
  },

  getNotifications: (role = 'all') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (role === 'all') {
          resolve(notificationsData);
        } else {
          resolve(notificationsData.filter(n => 
            n.recipients.includes(role) || n.recipients.includes('all')
          ));
        }
      }, 300);
    });
  },

  // Teacher APIs
  getTeacherDashboard: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(teacherDashboardData), 300);
    });
  },

  getMyStudents: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(studentsData), 300);
    });
  },

  getAssignments: (status = 'all') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (status === 'all') {
          resolve(assignmentsData);
        } else {
          resolve(assignmentsData.filter(a => a.status.toLowerCase() === status.toLowerCase()));
        }
      }, 300);
    });
  },

  getLectures: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(lecturesData), 300);
    });
  },

  // Student APIs
  getStudentDashboard: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(studentDashboardData), 300);
    });
  },

  getStudentPerformance: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        overall: studentDashboardData.stats,
        subjects: studentDashboardData.subjectPerformance,
        tests: studentDashboardData.recentTests,
        trend: studentDashboardData.performanceTrend
      }), 300);
    });
  },

  getStudentAttendance: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const studentAttendance = attendanceData.filter(a => a.studentId === 1);
        const monthlyData = {};
        studentAttendance.forEach(a => {
          const month = a.date.substring(0, 7);
          if (!monthlyData[month]) monthlyData[month] = { present: 0, absent: 0, late: 0 };
          if (a.status === 'present') monthlyData[month].present++;
          else if (a.status === 'absent') monthlyData[month].absent++;
          else if (a.status === 'late') monthlyData[month].late++;
        });
        resolve({
          overall: 92.0,
          history: studentAttendance,
          monthly: monthlyData
        });
      }, 300);
    });
  },

  getStudentTests: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(marksData.filter(m => m.studentId === 1)), 300);
    });
  },

  getStudentAssignments: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(assignmentsData.filter(a => a.status === 'Active')), 300);
    });
  },

  getFeedback: (studentId = null) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (studentId) {
          resolve(feedbackData.filter(f => f.studentId === studentId));
        }
        resolve(feedbackData);
      }, 300);
    });
  }
};
