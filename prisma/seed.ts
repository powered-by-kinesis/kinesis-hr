import { PrismaClient, Stage } from '@prisma/client';
import { EmploymentType } from '../constants/enums/employment-type';
import { JobStatus } from '../constants/enums/job-status';

const prisma = new PrismaClient();

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

// Helper function to get random date within last N days
const getRandomDate = (daysBack = 90): Date => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  return new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000);
};

// Helper function to get random boolean with probability
const getRandomBoolean = (probability = 0.5): boolean => Math.random() < probability;

// Job titles for different categories
const jobTitles = [
  // Engineering
  'Senior Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Senior Software Engineer',
  'Mobile Developer',
  'Data Engineer',
  'Machine Learning Engineer',
  'Software Architect',
  'Platform Engineer',
  'QA Engineer',
  'Site Reliability Engineer',

  // Product & Design
  'Product Manager',
  'Senior Product Manager',
  'UX/UI Designer',
  'Product Designer',
  'UX Researcher',
  'Product Owner',
  'Technical Product Manager',
  'Design Lead',

  // Data & Analytics
  'Data Scientist',
  'Data Analyst',
  'Business Intelligence Analyst',
  'Analytics Engineer',
  'Senior Data Scientist',
  'Machine Learning Specialist',
  'Business Analyst',

  // Marketing & Sales
  'Digital Marketing Specialist',
  'Marketing Manager',
  'Content Marketing Manager',
  'Sales Representative',
  'Account Executive',
  'Marketing Analytics Specialist',
  'Growth Marketing Manager',
  'Performance Marketing Specialist',

  // Operations & HR
  'Operations Manager',
  'HR Business Partner',
  'Talent Acquisition Specialist',
  'Operations Analyst',
  'HR Generalist',
  'Recruiting Coordinator',
  'Office Manager',

  // Finance & Legal
  'Financial Analyst',
  'Accounting Specialist',
  'Finance Manager',
  'Legal Counsel',
  'Tax Specialist',
  'Compliance Officer',
  'Investment Analyst',

  // Customer Success
  'Customer Success Manager',
  'Technical Support Specialist',
  'Customer Support Representative',
  'Customer Experience Manager',
  'Account Manager',
  'Solutions Engineer',
];

// Job descriptions
const jobDescriptions = [
  'Join our dynamic team and contribute to building cutting-edge solutions that impact millions of users worldwide. We offer competitive compensation, comprehensive benefits, and opportunities for professional growth.',
  'We are seeking a talented professional to help drive innovation and growth in our expanding organization. This role offers excellent career development opportunities and the chance to work with cutting-edge technologies.',
  "Exciting opportunity to work with modern technologies and collaborate with a world-class team of experts. You'll be working on challenging projects that make a real difference in our industry.",
  'Lead strategic initiatives and make a significant impact on our product development and business outcomes. This position offers the opportunity to shape the future direction of our technology stack.',
  'Work in a fast-paced environment with opportunities for career growth and professional development. We value innovation, collaboration, and continuous learning in our diverse and inclusive workplace.',
  'Collaborate with cross-functional teams to deliver exceptional results and drive company success. This role requires strong technical skills and the ability to work effectively in an agile environment.',
  "Be part of our mission to transform the industry through innovative technology solutions. We're looking for passionate individuals who are excited about solving complex challenges.",
  'Join a company that values creativity, innovation, and work-life balance in a supportive environment. We offer flexible working arrangements and comprehensive professional development programs.',
  'Opportunity to shape the future of our products while working with the latest tools and technologies. This role offers significant autonomy and the chance to drive technical decisions.',
  "Help us build scalable solutions that solve real-world problems for our growing customer base. We're committed to fostering an inclusive environment where everyone can thrive and contribute their best work.",
];

// Indonesian cities
const locations = [
  'Jakarta, Indonesia',
  'Surabaya, Indonesia',
  'Bandung, Indonesia',
  'Medan, Indonesia',
  'Semarang, Indonesia',
  'Makassar, Indonesia',
  'Palembang, Indonesia',
  'Tangerang, Indonesia',
  'Depok, Indonesia',
  'Bekasi, Indonesia',
  'Yogyakarta, Indonesia',
  'Malang, Indonesia',
  'Bogor, Indonesia',
  'Batam, Indonesia',
  'Denpasar, Indonesia',
  'Remote',
];

const employmentTypes = [
  EmploymentType.FULL_TIME,
  EmploymentType.PART_TIME,
  EmploymentType.CONTRACT,
  EmploymentType.INTERNSHIP,
];
const jobStatuses = [JobStatus.PUBLISHED, JobStatus.DRAFT];

// Indonesian names
const firstNames = [
  'Ahmad',
  'Siti',
  'Muhammad',
  'Ani',
  'Budi',
  'Sri',
  'Agus',
  'Rina',
  'Eko',
  'Dewi',
  'Hendra',
  'Maya',
  'Rizki',
  'Indira',
  'Fajar',
  'Sari',
  'Dimas',
  'Lestari',
  'Arif',
  'Putri',
  'Bayu',
  'Wulan',
  'Cahya',
  'Nur',
  'Gilang',
  'Ratna',
  'Yoga',
  'Fitri',
  'Wahyu',
  'Ayu',
  'Reza',
  'Kartika',
  'Andi',
  'Mega',
  'Faisal',
  'Diah',
  'Gani',
  'Sinta',
  'Hadi',
  'Dwi',
  'Irfan',
  'Lina',
  'Joko',
  'Puspita',
  'Kevin',
  'Amanda',
  'Ryan',
  'Jessica',
  'Daniel',
  'Michelle',
];

const lastNames = [
  'Pratama',
  'Sari',
  'Wijaya',
  'Permata',
  'Kusuma',
  'Maharani',
  'Santoso',
  'Indrawati',
  'Putra',
  'Anggraini',
  'Setiawan',
  'Rahayu',
  'Wibowo',
  'Sartika',
  'Kurniawan',
  'Handayani',
  'Gunawan',
  'Safitri',
  'Pranowo',
  'Melati',
  'Atmaja',
  'Cahyani',
  'Nugroho',
  'Kartini',
  'Adiputra',
  'Kusumawati',
  'Hakim',
  'Purnama',
  'Suharto',
  'Dewi',
  'Rahman',
  'Astuti',
  'Firmansyah',
  'Utami',
  'Nugraha',
  'Pertiwi',
  'Saputra',
  'Lestari',
  'Wicaksono',
  'Arimbi',
  'Hidayat',
  'Ningrum',
  'Sudarmanto',
  'Fitriani',
  'Maulana',
  'Kusumadewi',
  'Hartono',
  'Syafitri',
];

const expectedSalaries = [
  '5-8 juta',
  '8-12 juta',
  '12-18 juta',
  '18-25 juta',
  '25-35 juta',
  '35-50 juta',
  '50-75 juta',
  'Negotiable',
  'Competitive',
];

const applicationStages: Stage[] = [
  'APPLIED',
  'AI_SCREENING',
  'REVIEW',
  'OFFER',
  'HIRED',
  'REJECTED',
];

async function main() {
  console.log('🌱 Starting Prisma seed...');

  // Clean existing data (optional - uncomment if you want fresh data)
  // console.log('🧹 Cleaning existing data...')
  // await prisma.application.deleteMany()
  // await prisma.applicant.deleteMany()
  // await prisma.jobPost.deleteMany()

  // Generate Job Posts
  console.log('📝 Creating job posts...');
  const jobPosts = [];

  for (let i = 0; i < 50; i++) {
    const createdAt = getRandomDate(90);
    const updatedAt = getRandomBoolean(0.3)
      ? new Date(createdAt.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
      : createdAt;

    const jobPost = await prisma.jobPost.create({
      data: {
        title: getRandomItem(jobTitles),
        description: getRandomItem(jobDescriptions),
        location: getRandomBoolean(0.9) ? getRandomItem(locations) : null,
        employmentType: getRandomItem(employmentTypes),
        status: getRandomItem(jobStatuses),
        createdAt,
        updatedAt,
      },
    });

    jobPosts.push(jobPost);
  }

  console.log(`✅ Created ${jobPosts.length} job posts`);

  // Generate Applicants
  console.log('👥 Creating applicants...');
  const applicants = [];

  for (let i = 0; i < 50; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const fullName = `${firstName} ${lastName}`;

    // Generate email based on name
    const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'email.com', 'company.co.id'];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${getRandomItem(emailDomains)}`;

    // 20% chance of no phone number
    const phone = getRandomBoolean(0.8)
      ? `+62-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900000) + 100000}`
      : null;

    // 15% chance of no resume
    const resumeUrl = getRandomBoolean(0.85)
      ? `https://storage.example.com/resumes/${firstName.toLowerCase()}-${lastName.toLowerCase()}-resume.pdf`
      : null;

    const applicant = await prisma.applicant.create({
      data: {
        fullName,
        email,
        phone,
        resumeUrl,
        appliedAt: getRandomDate(60), // Applied within last 60 days
      },
    });

    applicants.push(applicant);
  }

  console.log(`✅ Created ${applicants.length} applicants`);

  // Generate Applications (relationships between job posts and applicants)
  console.log('📋 Creating applications...');
  const applications = [];

  // Create 75-100 applications (some applicants can apply to multiple jobs)
  const numApplications = 75 + Math.floor(Math.random() * 26); // 75-100

  for (let i = 0; i < numApplications; i++) {
    const applicant = getRandomItem(applicants);
    const jobPost = getRandomItem(jobPosts);

    // Check if this combination already exists
    const existingApplication = await prisma.application.findFirst({
      where: {
        applicantId: applicant.id,
        jobPostId: jobPost.id,
      },
    });

    if (existingApplication) {
      continue; // Skip if already exists
    }

    const application = await prisma.application.create({
      data: {
        applicantId: applicant.id,
        jobPostId: jobPost.id,
        currentStage: getRandomItem(applicationStages),
        expectedSalary: getRandomItem(expectedSalaries),
        appliedAt: getRandomDate(45),
        notes: getRandomBoolean(0.3) ? 'Initial application notes' : null,
      },
    });

    applications.push(application);
  }

  console.log(`✅ Created ${applications.length} applications`);

  // Generate summary
  const summary = {
    jobPosts: {
      total: jobPosts.length,
      byStatus: await Promise.all(
        jobStatuses.map(async (status) => ({
          [status]: await prisma.jobPost.count({ where: { status } }),
        })),
      ).then((results) => Object.assign({}, ...results)),
      byEmploymentType: await Promise.all(
        employmentTypes.map(async (type) => ({
          [type]: await prisma.jobPost.count({ where: { employmentType: type } }),
        })),
      ).then((results) => Object.assign({}, ...results)),
    },
    applicants: {
      total: applicants.length,
      withPhone: await prisma.applicant.count({ where: { phone: { not: null } } }),
      withResume: await prisma.applicant.count({ where: { resumeUrl: { not: null } } }),
    },
    applications: {
      total: applications.length,
      byStage: await Promise.all(
        applicationStages.map(async (stage) => ({
          [stage]: await prisma.application.count({ where: { currentStage: stage } }),
        })),
      ).then((results) => Object.assign({}, ...results)),
    },
  };

  console.log('\n📊 Seed Summary:');
  console.log('Job Posts:', summary.jobPosts);
  console.log('Applicants:', summary.applicants);
  console.log('Applications:', summary.applications);

  console.log('\n🎉 Prisma seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
