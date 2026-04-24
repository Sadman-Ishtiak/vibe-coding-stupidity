import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import User from './src/models/User.js';
import Internship from './src/models/Internship.js';
import Application from './src/models/Application.js';
import Notification from './src/models/Notification.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const categories = [
  'Engineering', 'Business', 'Marketing', 'Design', 'Data Science',
  'Finance', 'Human Resources', 'Legal', 'Sales'
];

const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'London, UK', 'Toronto, ON', 'Berlin, DE'];

const titlesMap = {
  'Engineering': ['Software Engineer Intern', 'Frontend Developer', 'Backend Developer', 'DevOps Intern', 'Full Stack Engineer', 'QA Tester', 'Mobile App Developer'],
  'Business': ['Business Analyst Intern', 'Product Management Intern', 'Strategy Intern', 'Operations Intern', 'Project Manager', 'Consultant Intern'],
  'Marketing': ['Social Media Intern', 'Content Marketing', 'SEO Specialist', 'Digital Marketing Intern', 'Brand Ambassador', 'Copywriter'],
  'Design': ['UI/UX Designer', 'Graphic Designer', 'Product Designer', 'Motion Graphics Intern', 'Web Designer', 'Illustrator'],
  'Data Science': ['Data Scientist Intern', 'Machine Learning Engineer', 'Data Analyst', 'AI Researcher', 'Big Data Intern'],
  'Finance': ['Financial Analyst', 'Investment Banking Intern', 'Accounting Intern', 'Audit Intern', 'Tax Intern'],
  'Human Resources': ['HR Generalist Intern', 'Recruiting Coordinator', 'Talent Acquisition', 'People Operations'],
  'Legal': ['Legal Intern', 'Paralegal', 'Corporate Law Intern', 'Compliance Intern'],
  'Sales': ['Sales Development Rep', 'Account Executive Intern', 'Business Development', 'Client Success Intern']
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seed = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Internship.deleteMany({});
  await Application.deleteMany({});
  await Notification.deleteMany({});
  console.log('Cleared Database');

  const salt = await bcryptjs.genSalt(10);
  const password = await bcryptjs.hash('password123', salt);

  // --- Create Base Users ---
  // 1. TechCorp (Engineering focus)
  const techCorp = await User.create({
    firstName: 'Tech', lastName: 'Corp', email: 'hr@techcorp.com', password,
    role: 'company', companyName: 'TechCorp Inc.', companyLocation: 'San Francisco, CA', isApproved: true
  });

  // 2. BizSolutions (Business/Marketing focus)
  const bizSol = await User.create({
    firstName: 'Biz', lastName: 'Solutions', email: 'hr@biz.com', password,
    role: 'company', companyName: 'BizSolutions', companyLocation: 'New York, NY', isApproved: true
  });

  // 3. CreativeStudios (Design focus)
  const creative = await User.create({
    firstName: 'Creative', lastName: 'Director', email: 'hr@creative.com', password,
    role: 'company', companyName: 'Creative Studios', companyLocation: 'Remote', isApproved: true
  });

  // 4. FinServe (Finance focus)
  const finServe = await User.create({
    firstName: 'Fin', lastName: 'Serve', email: 'hr@finserve.com', password,
    role: 'company', companyName: 'Global FinServe', companyLocation: 'London, UK', isApproved: true
  });

  // 5. InnovateAI (Data focus)
  const innovate = await User.create({
    firstName: 'Innovate', lastName: 'AI', email: 'hr@innovate.com', password,
    role: 'company', companyName: 'Innovate AI', companyLocation: 'Austin, TX', isApproved: true
  });

  const companies = [techCorp, bizSol, creative, finServe, innovate];
  console.log('Created 5 Company Accounts');

  // --- Create Candidates ---
  const alice = await User.create({
    firstName: 'Alice', lastName: 'Wonder', email: 'alice@example.com', password,
    role: 'candidate', skills: ['React', 'JavaScript', 'Design'], isApproved: true
  });
  const bob = await User.create({
    firstName: 'Bob', lastName: 'Builder', email: 'bob@example.com', password,
    role: 'candidate', skills: ['Python', 'Data Science'], isApproved: true
  });

  console.log('Created Candidates: alice@example.com, bob@example.com');

  // --- Generate Job Listings ---
  const internshipDocs = [];

  for (const category of categories) {
    const titles = titlesMap[category] || ['General Intern'];
    // Generate 6-9 jobs per category
    const count = getRandomInt(6, 9);
    
    for (let i = 0; i < count; i++) {
      const title = getRandom(titles);
      const company = getRandom(companies);
      
      internshipDocs.push({
        title: title,
        description: `We are looking for a passionate ${title} to join our ${category} team. You will work on real-world projects, collaborate with senior mentors, and gain hands-on experience in ${category}. 
        
Responsibilities:
- Assist in daily ${category} tasks.
- Participate in team meetings and brainstorming sessions.
- Contribute to project documentation and execution.

Requirements:
- Currently pursuing a degree in a related field.
- Strong communication skills.
- Eagerness to learn.`,
        company: company._id,
        location: getRandom(locations),
        category: category,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-08-30'),
        stipend: getRandomInt(0, 1) === 0 ? 0 : getRandomInt(1000, 5000),
        stipendType: getRandom(['Fixed', 'Hourly', 'None']),
        duration: getRandom(['3 months', '6 months', 'Summer 2025']),
        requirements: ['Communication', 'Teamwork', category],
        perks: ['Remote Work', 'Flexible Hours', 'Certificate'],
        isActive: true,
        applicationCount: 0
      });
    }
  }

  const createdInternships = await Internship.insertMany(internshipDocs);
  console.log(`Created ${createdInternships.length} Internships across ${categories.length} categories.`);

  // --- Create Sample Applications ---
  // Alice applies to first 2
  await Application.create({
    internship: createdInternships[0]._id,
    candidate: alice._id,
    status: 'Applied',
    coverLetter: 'I am interested!'
  });
  
  // Create Notification for Company
  await Notification.create({
    recipient: createdInternships[0].company,
    message: `New application for ${createdInternships[0].title} from Alice Wonder`,
    type: 'new_application'
  });

  console.log('Seeding Complete. Press Ctrl+C to exit if it hangs.');
  process.exit(0);
};

seed();