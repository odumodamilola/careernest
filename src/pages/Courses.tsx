import { BookOpen, Search, Filter, Star, Clock, Users, Play, Award, Globe, DollarSign, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const courses = [
  {
    id: 1,
    title: "Machine Learning Specialization",
    instructor: "Andrew Ng",
    institution: "Stanford University",
    price: 49,
    originalPrice: 79,
    duration: "11 weeks",
    level: "Beginner",
    rating: 4.9,
    students: "4.7M",
    image: "🤖",
    category: "Data Science",
    skills: ["Python", "TensorFlow", "Neural Networks", "Deep Learning"],
    description: "Learn the fundamentals of machine learning from Andrew Ng, co-founder of Coursera and former head of Stanford AI Lab.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    weeks: 11,
    hoursPerWeek: "5-7 hours"
  },
  {
    id: 2,
    title: "CS50: Introduction to Computer Science",
    instructor: "David J. Malan",
    institution: "Harvard University",
    price: 0,
    duration: "12 weeks",
    level: "Beginner",
    rating: 4.8,
    students: "3.2M",
    image: "💻",
    category: "Computer Science",
    skills: ["C", "Python", "JavaScript", "SQL"],
    description: "Harvard's introduction to computer science and programming. Learn to think algorithmically and solve problems efficiently.",
    isFree: true,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Portuguese"],
    weeks: 12,
    hoursPerWeek: "10-20 hours"
  },
  {
    id: 3,
    title: "Google Data Analytics Professional Certificate",
    instructor: "Google Career Certificates",
    institution: "Google",
    price: 39,
    originalPrice: 49,
    duration: "6 months",
    level: "Beginner",
    rating: 4.6,
    students: "2.1M",
    image: "📊",
    category: "Data Science",
    skills: ["R", "Tableau", "SQL", "Spreadsheets"],
    description: "Prepare for a career in data analytics with hands-on training from Google. No degree or experience required.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Arabic"],
    weeks: 24,
    hoursPerWeek: "3-5 hours"
  },
  {
    id: 4,
    title: "Financial Markets",
    instructor: "Robert Shiller",
    institution: "Yale University",
    price: 0,
    duration: "7 weeks",
    level: "Intermediate",
    rating: 4.7,
    students: "1.8M",
    image: "📈",
    category: "Finance",
    skills: ["Financial Analysis", "Risk Management", "Investment", "Economics"],
    description: "Nobel Prize winner Robert Shiller explains how financial markets work and their role in the global economy.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Chinese", "Spanish"],
    weeks: 7,
    hoursPerWeek: "8-10 hours"
  },
  {
    id: 5,
    title: "AWS Cloud Practitioner Essentials",
    instructor: "AWS Training Team",
    institution: "Amazon Web Services",
    price: 29,
    originalPrice: 39,
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.5,
    students: "890K",
    image: "☁️",
    category: "Cloud Computing",
    skills: ["AWS", "Cloud Architecture", "EC2", "S3"],
    description: "Learn AWS cloud fundamentals and prepare for the AWS Certified Cloud Practitioner exam.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Japanese", "Korean"],
    weeks: 4,
    hoursPerWeek: "4-6 hours"
  },
  {
    id: 6,
    title: "Introduction to Psychology",
    instructor: "Paul Bloom",
    institution: "Yale University",
    price: 0,
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.8,
    students: "2.3M",
    image: "🧠",
    category: "Psychology",
    skills: ["Cognitive Psychology", "Social Psychology", "Research Methods"],
    description: "Explore the human mind with Yale's most popular psychology course, covering perception, communication, and social behavior.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Chinese", "Spanish"],
    weeks: 6,
    hoursPerWeek: "5-7 hours"
  },
  {
    id: 7,
    title: "Full Stack Web Development with React",
    instructor: "Jogesh K. Muppala",
    institution: "Hong Kong University",
    price: 59,
    originalPrice: 89,
    duration: "4 months",
    level: "Intermediate",
    rating: 4.7,
    students: "650K",
    image: "⚛️",
    category: "Web Development",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    description: "Master full-stack web development with React, Node.js, Express, and MongoDB through hands-on projects.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Portuguese"],
    weeks: 16,
    hoursPerWeek: "6-8 hours"
  },
  {
    id: 8,
    title: "Digital Marketing Specialization",
    instructor: "Aric Rindfleisch",
    institution: "University of Illinois",
    price: 49,
    originalPrice: 79,
    duration: "8 months",
    level: "Beginner",
    rating: 4.6,
    students: "1.2M",
    image: "📱",
    category: "Marketing",
    skills: ["SEO", "Social Media", "Analytics", "Content Marketing"],
    description: "Learn digital marketing strategies including SEO, social media marketing, and digital analytics.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Arabic"],
    weeks: 32,
    hoursPerWeek: "3-5 hours"
  },
  {
    id: 9,
    title: "Python for Everybody Specialization",
    instructor: "Charles Severance",
    institution: "University of Michigan",
    price: 0,
    duration: "8 months",
    level: "Beginner",
    rating: 4.8,
    students: "2.8M",
    image: "🐍",
    category: "Programming",
    skills: ["Python", "Data Structures", "Web Scraping", "Databases"],
    description: "Learn Python programming from scratch with the University of Michigan's popular specialization.",
    isFree: true,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Russian"],
    weeks: 32,
    hoursPerWeek: "2-4 hours"
  },
  {
    id: 10,
    title: "IBM Data Science Professional Certificate",
    instructor: "IBM Skills Network",
    institution: "IBM",
    price: 39,
    originalPrice: 49,
    duration: "10 months",
    level: "Beginner",
    rating: 4.5,
    students: "420K",
    image: "🔬",
    category: "Data Science",
    skills: ["Python", "Jupyter", "Pandas", "Machine Learning"],
    description: "Launch your data science career with IBM's comprehensive professional certificate program.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    weeks: 40,
    hoursPerWeek: "3-5 hours"
  },
  {
    id: 11,
    title: "Introduction to Game Development",
    instructor: "Brian Winn",
    institution: "Michigan State University",
    price: 29,
    originalPrice: 39,
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.4,
    students: "180K",
    image: "🎮",
    category: "Game Development",
    skills: ["Unity", "C#", "Game Design", "3D Modeling"],
    description: "Learn the fundamentals of game development using Unity and C# programming.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish"],
    weeks: 6,
    hoursPerWeek: "5-7 hours"
  },
  {
    id: 12,
    title: "Blockchain Basics",
    instructor: "Bina Ramamurthy",
    institution: "University at Buffalo",
    price: 0,
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.6,
    students: "320K",
    image: "⛓️",
    category: "Blockchain",
    skills: ["Blockchain", "Cryptocurrency", "Smart Contracts", "Ethereum"],
    description: "Understand blockchain technology, cryptocurrencies, and decentralized applications.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Chinese", "Spanish"],
    weeks: 4,
    hoursPerWeek: "3-4 hours"
  },
  {
    id: 13,
    title: "UX Design Professional Certificate",
    instructor: "Google UX Team",
    institution: "Google",
    price: 39,
    originalPrice: 49,
    duration: "6 months",
    level: "Beginner",
    rating: 4.7,
    students: "540K",
    image: "🎨",
    category: "Design",
    skills: ["Figma", "User Research", "Prototyping", "Wireframing"],
    description: "Learn UX design fundamentals and create a professional portfolio with Google's certificate program.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Portuguese"],
    weeks: 24,
    hoursPerWeek: "3-5 hours"
  },
  {
    id: 14,
    title: "Introduction to Artificial Intelligence",
    instructor: "IBM Cognitive Class",
    institution: "IBM",
    price: 0,
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.5,
    students: "750K",
    image: "🤖",
    category: "Artificial Intelligence",
    skills: ["AI Fundamentals", "Machine Learning", "Neural Networks"],
    description: "Explore the fascinating world of artificial intelligence and its real-world applications.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    weeks: 4,
    hoursPerWeek: "2-3 hours"
  },
  {
    id: 15,
    title: "Cybersecurity Specialization",
    instructor: "Herbert J. Mattord",
    institution: "University of Maryland",
    price: 59,
    originalPrice: 89,
    duration: "6 months",
    level: "Intermediate",
    rating: 4.6,
    students: "290K",
    image: "🔒",
    category: "Cybersecurity",
    skills: ["Network Security", "Cryptography", "Risk Assessment", "Incident Response"],
    description: "Master cybersecurity fundamentals and prepare for a career in information security.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish"],
    weeks: 24,
    hoursPerWeek: "4-6 hours"
  },
  {
    id: 16,
    title: "Photography Basics and Beyond",
    instructor: "Peter Glendinning",
    institution: "Michigan State University",
    price: 0,
    duration: "5 weeks",
    level: "Beginner",
    rating: 4.8,
    students: "450K",
    image: "📸",
    category: "Arts",
    skills: ["Photography", "Composition", "Lighting", "Post-processing"],
    description: "Learn photography fundamentals from basic camera operation to advanced composition techniques.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    weeks: 5,
    hoursPerWeek: "3-4 hours"
  },
  {
    id: 17,
    title: "Project Management Professional Certificate",
    instructor: "Google Project Management",
    institution: "Google",
    price: 39,
    originalPrice: 49,
    duration: "6 months",
    level: "Beginner",
    rating: 4.8,
    students: "680K",
    image: "📋",
    category: "Business",
    skills: ["Agile", "Scrum", "Risk Management", "Stakeholder Management"],
    description: "Prepare for a career in project management with Google's comprehensive certificate program.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Arabic"],
    weeks: 24,
    hoursPerWeek: "3-5 hours"
  },
  {
    id: 18,
    title: "Introduction to Data Science with R",
    instructor: "Roger Peng",
    institution: "Johns Hopkins University",
    price: 29,
    originalPrice: 39,
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.3,
    students: "380K",
    image: "📈",
    category: "Data Science",
    skills: ["R Programming", "Statistics", "Data Visualization", "Reproducible Research"],
    description: "Learn data science fundamentals using R programming language from Johns Hopkins experts.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Chinese"],
    weeks: 4,
    hoursPerWeek: "4-6 hours"
  },
  {
    id: 19,
    title: "The Science of Well-Being",
    instructor: "Laurie Santos",
    institution: "Yale University",
    price: 0,
    duration: "10 weeks",
    level: "Beginner",
    rating: 4.9,
    students: "4.1M",
    image: "😊",
    category: "Psychology",
    skills: ["Positive Psychology", "Mindfulness", "Habit Formation", "Well-being"],
    description: "Yale's most popular course teaches the science of happiness and how to live a more satisfying life.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "Portuguese"],
    weeks: 10,
    hoursPerWeek: "3-4 hours"
  },
  {
    id: 20,
    title: "Mobile App Development with Flutter",
    instructor: "Angela Yu",
    institution: "University of London",
    price: 49,
    originalPrice: 69,
    duration: "3 months",
    level: "Intermediate",
    rating: 4.7,
    students: "150K",
    image: "📱",
    category: "Mobile Development",
    skills: ["Flutter", "Dart", "Firebase", "Mobile UI"],
    description: "Build beautiful, native mobile apps for iOS and Android using Google's Flutter framework.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish"],
    weeks: 12,
    hoursPerWeek: "6-8 hours"
  },
  // New diverse field courses for students and young graduates
  {
    id: 21,
    title: "Introduction to Environmental Science",
    instructor: "Dr. Sarah Johnson",
    institution: "University of California, Berkeley",
    price: 0,
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.7,
    students: "680K",
    image: "🌱",
    category: "Environmental Science",
    skills: ["Climate Change", "Sustainability", "Ecology", "Conservation"],
    description: "Explore environmental challenges and solutions for a sustainable future. Perfect for students concerned about climate change.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "Chinese"],
    weeks: 8,
    hoursPerWeek: "4-5 hours"
  },
  {
    id: 22,
    title: "Creative Writing: The Craft of Character",
    instructor: "Janet Burroway",
    institution: "Wesleyan University",
    price: 39,
    originalPrice: 59,
    duration: "5 weeks",
    level: "Beginner",
    rating: 4.8,
    students: "220K",
    image: "✍️",
    category: "Literature & Writing",
    skills: ["Character Development", "Storytelling", "Narrative Writing", "Plot Structure"],
    description: "Develop compelling characters and master the art of storytelling. Ideal for aspiring writers and English majors.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish"],
    weeks: 5,
    hoursPerWeek: "3-4 hours"
  },
  {
    id: 23,
    title: "Introduction to Philosophy",
    instructor: "Dr. Michael Sandel",
    institution: "Harvard University",
    price: 0,
    duration: "12 weeks",
    level: "Beginner",
    rating: 4.9,
    students: "1.8M",
    image: "🤔",
    category: "Philosophy",
    skills: ["Critical Thinking", "Ethics", "Logic", "Moral Reasoning"],
    description: "Explore fundamental questions about justice, morality, and the good life with Harvard's most popular philosophy course.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "Portuguese"],
    weeks: 12,
    hoursPerWeek: "6-8 hours"
  },
  {
    id: 24,
    title: "Nutrition and Health",
    instructor: "Dr. David Ludwig",
    institution: "Harvard T.H. Chan School",
    price: 29,
    originalPrice: 49,
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.6,
    students: "450K",
    image: "🥗",
    category: "Health & Medicine",
    skills: ["Nutrition Science", "Public Health", "Diet Planning", "Food Policy"],
    description: "Learn evidence-based nutrition science and its impact on health. Essential for pre-med and health science students.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    weeks: 6,
    hoursPerWeek: "4-6 hours"
  },
  {
    id: 25,
    title: "International Relations Theory",
    instructor: "Prof. Joseph Nye",
    institution: "Harvard Kennedy School",
    price: 0,
    duration: "10 weeks",
    level: "Intermediate",
    rating: 4.7,
    students: "320K",
    image: "🌍",
    category: "Political Science",
    skills: ["Diplomacy", "Global Politics", "Foreign Policy", "International Law"],
    description: "Understand global politics and international relations in the 21st century. Perfect for political science majors.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "Arabic"],
    weeks: 10,
    hoursPerWeek: "5-7 hours"
  },
  {
    id: 26,
    title: "Introduction to Journalism",
    instructor: "Dan Gillmor",
    institution: "University of California, Berkeley",
    price: 25,
    originalPrice: 39,
    duration: "4 weeks",
    level: "Beginner",
    rating: 4.5,
    students: "180K",
    image: "📰",
    category: "Journalism & Media",
    skills: ["News Writing", "Investigative Reporting", "Media Ethics", "Digital Journalism"],
    description: "Learn fundamental journalism skills and media literacy in the digital age. Great for communications majors.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish"],
    weeks: 4,
    hoursPerWeek: "5-6 hours"
  },
  {
    id: 27,
    title: "Social Psychology",
    instructor: "Dr. Scott Plous",
    institution: "Wesleyan University",
    price: 0,
    duration: "9 weeks",
    level: "Beginner",
    rating: 4.8,
    students: "890K",
    image: "👥",
    category: "Psychology",
    skills: ["Social Behavior", "Group Dynamics", "Prejudice", "Social Influence"],
    description: "Explore how people think about, influence, and relate to one another. Essential for psychology and sociology students.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Chinese", "Spanish"],
    weeks: 9,
    hoursPerWeek: "4-5 hours"
  },
  {
    id: 28,
    title: "Microeconomics Principles",
    instructor: "Dr. Paul Krugman",
    institution: "Princeton University",
    price: 35,
    originalPrice: 55,
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.6,
    students: "540K",
    image: "📊",
    category: "Economics",
    skills: ["Supply & Demand", "Market Analysis", "Consumer Behavior", "Economic Theory"],
    description: "Master fundamental economic principles with Nobel Prize winner Paul Krugman. Perfect for business and economics majors.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Chinese"],
    weeks: 8,
    hoursPerWeek: "6-8 hours"
  },
  {
    id: 29,
    title: "Art History: From Impressionism to Contemporary",
    instructor: "Dr. Catherine Grant",
    institution: "Museum of Modern Art",
    price: 0,
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.9,
    students: "380K",
    image: "🎨",
    category: "Art & History",
    skills: ["Art Analysis", "Cultural History", "Visual Literacy", "Museum Studies"],
    description: "Journey through modern art movements and learn to analyze visual culture. Ideal for art and history majors.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "French", "Italian"],
    weeks: 6,
    hoursPerWeek: "3-4 hours"
  },
  {
    id: 30,
    title: "Introduction to Anthropology",
    instructor: "Dr. Ruth Benedict",
    institution: "Columbia University",
    price: 29,
    originalPrice: 45,
    duration: "7 weeks",
    level: "Beginner",
    rating: 4.7,
    students: "260K",
    image: "🏺",
    category: "Anthropology",
    skills: ["Cultural Analysis", "Ethnography", "Human Evolution", "Archaeological Methods"],
    description: "Explore human cultures, societies, and evolution. Perfect introduction for anthropology and sociology students.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Portuguese"],
    weeks: 7,
    hoursPerWeek: "4-5 hours"
  },
  {
    id: 31,
    title: "Climate Change Mitigation",
    instructor: "Dr. Michael Mann",
    institution: "Penn State University",
    price: 0,
    duration: "5 weeks",
    level: "Intermediate",
    rating: 4.8,
    students: "420K",
    image: "🌡️",
    category: "Environmental Science",
    skills: ["Climate Science", "Renewable Energy", "Policy Analysis", "Environmental Impact"],
    description: "Learn about climate change solutions and mitigation strategies. Essential for environmental studies students.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "German"],
    weeks: 5,
    hoursPerWeek: "5-6 hours"
  },
  {
    id: 32,
    title: "Criminal Justice System",
    instructor: "Prof. Angela Davis",
    institution: "University of California System",
    price: 35,
    originalPrice: 50,
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.5,
    students: "290K",
    image: "⚖️",
    category: "Criminal Justice",
    skills: ["Legal System", "Criminology", "Prison Reform", "Social Justice"],
    description: "Examine the criminal justice system and explore reform opportunities. Great for pre-law and criminal justice majors.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish"],
    weeks: 8,
    hoursPerWeek: "5-7 hours"
  },
  {
    id: 33,
    title: "Introduction to Public Health",
    instructor: "Dr. Sandro Galea",
    institution: "Boston University",
    price: 0,
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.7,
    students: "510K",
    image: "🏥",
    category: "Health & Medicine",
    skills: ["Epidemiology", "Health Policy", "Community Health", "Disease Prevention"],
    description: "Learn the fundamentals of population health and disease prevention. Perfect for pre-med and public health students.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    weeks: 6,
    hoursPerWeek: "4-6 hours"
  },
  {
    id: 34,
    title: "Modern World History",
    instructor: "Dr. Niall Ferguson",
    institution: "Harvard University",
    price: 25,
    originalPrice: 40,
    duration: "10 weeks",
    level: "Beginner",
    rating: 4.6,
    students: "730K",
    image: "📚",
    category: "History",
    skills: ["Historical Analysis", "Global Perspectives", "Research Methods", "Critical Thinking"],
    description: "Explore major events and trends that shaped the modern world. Essential for history and political science majors.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Chinese"],
    weeks: 10,
    hoursPerWeek: "6-8 hours"
  },
  {
    id: 35,
    title: "Music Theory Fundamentals",
    instructor: "Prof. Robert Greenberg",
    institution: "University of California, Berkeley",
    price: 0,
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.8,
    students: "340K",
    image: "🎵",
    category: "Music & Arts",
    skills: ["Music Theory", "Composition", "Harmony", "Rhythm Analysis"],
    description: "Master the building blocks of music theory and composition. Perfect for music majors and aspiring musicians.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "German"],
    weeks: 8,
    hoursPerWeek: "4-5 hours"
  },
  {
    id: 36,
    title: "Introduction to Law",
    instructor: "Prof. Kimberlé Crenshaw",
    institution: "Columbia Law School",
    price: 45,
    originalPrice: 65,
    duration: "9 weeks",
    level: "Beginner",
    rating: 4.7,
    students: "450K",
    image: "⚖️",
    category: "Law",
    skills: ["Legal Reasoning", "Constitutional Law", "Case Analysis", "Legal Writing"],
    description: "Learn fundamental legal concepts and reasoning skills. Essential preparation for pre-law students.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish"],
    weeks: 9,
    hoursPerWeek: "7-9 hours"
  },
  {
    id: 37,
    title: "Calculus: Single Variable",
    instructor: "Prof. Dennis DeTurck",
    institution: "University of Pennsylvania",
    price: 0,
    duration: "16 weeks",
    level: "Intermediate",
    rating: 4.5,
    students: "890K",
    image: "📐",
    category: "Mathematics",
    skills: ["Derivatives", "Integrals", "Limits", "Mathematical Proofs"],
    description: "Master single-variable calculus with rigorous mathematical approach. Essential for STEM majors.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "Chinese"],
    weeks: 16,
    hoursPerWeek: "8-10 hours"
  },
  {
    id: 38,
    title: "Introduction to Sociology",
    instructor: "Dr. Matthew Salganik",
    institution: "Princeton University",
    price: 30,
    originalPrice: 45,
    duration: "7 weeks",
    level: "Beginner",
    rating: 4.6,
    students: "620K",
    image: "🏛️",
    category: "Sociology",
    skills: ["Social Theory", "Research Methods", "Social Inequality", "Cultural Analysis"],
    description: "Examine society, social institutions, and human behavior. Perfect introduction for sociology and social work majors.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Portuguese"],
    weeks: 7,
    hoursPerWeek: "5-6 hours"
  },
  {
    id: 39,
    title: "Astronomy: Exploring Time and Space",
    instructor: "Dr. Alex Filippenko",
    institution: "University of California, Berkeley",
    price: 0,
    duration: "10 weeks",
    level: "Beginner",
    rating: 4.9,
    students: "780K",
    image: "🌌",
    category: "Astronomy & Physics",
    skills: ["Stellar Evolution", "Cosmology", "Planetary Science", "Astrophysics"],
    description: "Journey through the universe and explore cosmic phenomena. Great for physics and astronomy students.",
    isFree: true,
    certificate: false,
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    weeks: 10,
    hoursPerWeek: "5-7 hours"
  },
  {
    id: 40,
    title: "Gender and Women's Studies",
    instructor: "Dr. bell hooks",
    institution: "The New School",
    price: 25,
    originalPrice: 40,
    duration: "6 weeks",
    level: "Beginner",
    rating: 4.8,
    students: "280K",
    image: "♀️",
    category: "Gender Studies",
    skills: ["Feminist Theory", "Gender Analysis", "Intersectionality", "Social Justice"],
    description: "Explore gender, sexuality, and feminist theory in contemporary society. Essential for gender studies majors.",
    isFree: false,
    certificate: true,
    language: "English",
    subtitles: ["English", "Spanish", "Portuguese"],
    weeks: 6,
    hoursPerWeek: "4-5 hours"
  }
];

const categories = ["All", "Data Science", "Computer Science", "Web Development", "Business", "Design", "Marketing", "Psychology", "Finance", "Programming", "Environmental Science", "Literature & Writing", "Philosophy", "Health & Medicine", "Political Science", "Journalism & Media", "Economics", "Art & History", "Anthropology", "Criminal Justice", "History", "Music & Arts", "Law", "Mathematics", "Sociology", "Astronomy & Physics", "Gender Studies"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const types = ["All", "Free", "Paid"];

export function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'All' || course.level === levelFilter;
    const matchesType = typeFilter === 'All' || 
                       (typeFilter === 'Free' && course.isFree) || 
                       (typeFilter === 'Paid' && !course.isFree);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn Without Limits
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start, switch, or advance your career with courses from world-class universities and companies.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses, skills, instructors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              {/* Course Header */}
              <div className="relative p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{course.image}</div>
                  <div className="flex flex-col items-end">
                    {course.isFree ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Free
                      </span>
                    ) : (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          ${course.price}/mo
                        </div>
                        {course.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ${course.originalPrice}/mo
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>

                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <span className="font-medium">{course.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>{course.institution}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {course.skills.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{course.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Course Details */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Level:</span> {course.level}
                  </div>
                  <div>
                    <span className="font-medium">Hours/week:</span> {course.hoursPerWeek}
                  </div>
                </div>

                {/* Features */}
                <div className="flex items-center space-x-4 text-xs text-gray-600 mb-4">
                  {course.certificate && (
                    <div className="flex items-center">
                      <Award className="h-3 w-3 mr-1 text-yellow-500" />
                      <span>Certificate</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Globe className="h-3 w-3 mr-1" />
                    <span>Subtitles</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    {course.isFree ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Enroll for Free
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Start Free Trial
                      </>
                    )}
                  </button>
                  
                  {!course.isFree && (
                    <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                      View Course Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredCourses.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors">
              Load More Courses
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or explore our featured courses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}