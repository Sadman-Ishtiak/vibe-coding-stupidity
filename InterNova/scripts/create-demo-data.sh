#!/bin/bash

# =============================================================================
# DEMO DATA CREATION SCRIPT FOR INTERNOVA JOB PORTAL
# =============================================================================
# This script creates realistic demo data using ONLY cURL commands
# - 10 Company/Recruiter accounts
# - 14 Job postings
# - 1 Candidate account
# =============================================================================

set -e  # Exit on error

API_BASE="http://localhost:5000/api"
PASSWORD="SecurePass123"  # Common strong password for all accounts

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Arrays to store credentials
declare -a COMPANY_NAMES
declare -a COMPANY_EMAILS
declare -a COMPANY_TOKENS

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}INTERNOVA DEMO DATA CREATION${NC}"
echo -e "${BLUE}========================================${NC}\n"

# =============================================================================
# STEP 1: CREATE 10 COMPANY ACCOUNTS
# =============================================================================

echo -e "${GREEN}[STEP 1/4] Creating 10 Company Accounts...${NC}\n"

# Company 1: TechVentures Bangladesh
echo -e "${YELLOW}Creating Company 1: TechVentures Bangladesh...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "techventures",
    "email": "hr@techventures.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "TechVentures Bangladesh",
    "ownerName": "Ahmed Hassan",
    "website": "https://techventures.com.bd",
    "establishedDate": "2018-03-15",
    "employees": "100-500",
    "location": "Dhaka",
    "description": "Leading software development company specializing in web and mobile solutions for enterprises across Bangladesh and international markets."
  }')
TOKEN_1=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("TechVentures Bangladesh")
COMPANY_EMAILS+=("hr@techventures.com.bd")
COMPANY_TOKENS+=("$TOKEN_1")
echo -e "${GREEN}✓ Created: TechVentures Bangladesh${NC}\n"

# Company 2: DataSphere Analytics
echo -e "${YELLOW}Creating Company 2: DataSphere Analytics...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "datasphere",
    "email": "careers@datasphere.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "DataSphere Analytics",
    "ownerName": "Fatima Rahman",
    "website": "https://datasphere.com.bd",
    "establishedDate": "2019-06-20",
    "employees": "50-100",
    "location": "Chattogram",
    "description": "Data analytics and business intelligence firm helping organizations make data-driven decisions through advanced analytics and AI solutions."
  }')
TOKEN_2=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("DataSphere Analytics")
COMPANY_EMAILS+=("careers@datasphere.com.bd")
COMPANY_TOKENS+=("$TOKEN_2")
echo -e "${GREEN}✓ Created: DataSphere Analytics${NC}\n"

# Company 3: CloudNine Solutions
echo -e "${YELLOW}Creating Company 3: CloudNine Solutions...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cloudnine",
    "email": "jobs@cloudnine.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "CloudNine Solutions",
    "ownerName": "Karim Mohammad",
    "website": "https://cloudnine.com.bd",
    "establishedDate": "2017-01-10",
    "employees": "200-500",
    "location": "Sylhet",
    "description": "Cloud infrastructure and DevOps consulting company providing scalable solutions for businesses transitioning to cloud-native architectures."
  }')
TOKEN_3=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("CloudNine Solutions")
COMPANY_EMAILS+=("jobs@cloudnine.com.bd")
COMPANY_TOKENS+=("$TOKEN_3")
echo -e "${GREEN}✓ Created: CloudNine Solutions${NC}\n"

# Company 4: FinTech Innovations
echo -e "${YELLOW}Creating Company 4: FinTech Innovations...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "fintechinno",
    "email": "recruitment@fintechinno.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "FinTech Innovations",
    "ownerName": "Nusrat Jahan",
    "website": "https://fintechinno.com.bd",
    "establishedDate": "2020-09-01",
    "employees": "20-50",
    "location": "Dhaka",
    "description": "Revolutionary fintech startup developing mobile payment solutions and digital banking platforms for unbanked communities in Bangladesh."
  }')
TOKEN_4=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("FinTech Innovations")
COMPANY_EMAILS+=("recruitment@fintechinno.com.bd")
COMPANY_TOKENS+=("$TOKEN_4")
echo -e "${GREEN}✓ Created: FinTech Innovations${NC}\n"

# Company 5: EduTech Pro
echo -e "${YELLOW}Creating Company 5: EduTech Pro...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "edutechpro",
    "email": "hr@edutechpro.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "EduTech Pro",
    "ownerName": "Rafiq Islam",
    "website": "https://edutechpro.com.bd",
    "establishedDate": "2016-04-25",
    "employees": "100-200",
    "location": "Rajshahi",
    "description": "Educational technology company creating innovative e-learning platforms and digital content for schools, colleges, and professional training centers."
  }')
TOKEN_5=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("EduTech Pro")
COMPANY_EMAILS+=("hr@edutechpro.com.bd")
COMPANY_TOKENS+=("$TOKEN_5")
echo -e "${GREEN}✓ Created: EduTech Pro${NC}\n"

# Company 6: HealthCare Digital
echo -e "${YELLOW}Creating Company 6: HealthCare Digital...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "healthcaredig",
    "email": "careers@healthcaredig.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "HealthCare Digital",
    "ownerName": "Dr. Sharmin Akter",
    "website": "https://healthcaredig.com.bd",
    "establishedDate": "2019-11-12",
    "employees": "50-100",
    "location": "Khulna",
    "description": "Digital healthcare solutions provider offering telemedicine platforms, electronic health records, and health monitoring applications for Bangladesh healthcare sector."
  }')
TOKEN_6=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("HealthCare Digital")
COMPANY_EMAILS+=("careers@healthcaredig.com.bd")
COMPANY_TOKENS+=("$TOKEN_6")
echo -e "${GREEN}✓ Created: HealthCare Digital${NC}\n"

# Company 7: AgriTech Systems
echo -e "${YELLOW}Creating Company 7: AgriTech Systems...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "agritechsys",
    "email": "jobs@agritechsys.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "AgriTech Systems",
    "ownerName": "Mohammad Hossain",
    "website": "https://agritechsys.com.bd",
    "establishedDate": "2018-07-08",
    "employees": "20-50",
    "location": "Mymensingh",
    "description": "Agricultural technology startup using IoT and AI to help farmers optimize crop yields, monitor soil health, and access fair market prices."
  }')
TOKEN_7=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("AgriTech Systems")
COMPANY_EMAILS+=("jobs@agritechsys.com.bd")
COMPANY_TOKENS+=("$TOKEN_7")
echo -e "${GREEN}✓ Created: AgriTech Systems${NC}\n"

# Company 8: CyberShield Security
echo -e "${YELLOW}Creating Company 8: CyberShield Security...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "cybershield",
    "email": "hr@cybershield.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "CyberShield Security",
    "ownerName": "Tanvir Ahmed",
    "website": "https://cybershield.com.bd",
    "establishedDate": "2017-05-30",
    "employees": "50-100",
    "location": "Dhaka",
    "description": "Cybersecurity firm specializing in penetration testing, security audits, and managed security services for enterprises and government organizations."
  }')
TOKEN_8=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("CyberShield Security")
COMPANY_EMAILS+=("hr@cybershield.com.bd")
COMPANY_TOKENS+=("$TOKEN_8")
echo -e "${GREEN}✓ Created: CyberShield Security${NC}\n"

# Company 9: LogiTrack Solutions
echo -e "${YELLOW}Creating Company 9: LogiTrack Solutions...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "logitrack",
    "email": "careers@logitrack.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "LogiTrack Solutions",
    "ownerName": "Samira Khan",
    "website": "https://logitrack.com.bd",
    "establishedDate": "2019-02-14",
    "employees": "100-200",
    "location": "Chattogram",
    "description": "Logistics and supply chain management software provider offering real-time tracking, warehouse management, and fleet optimization solutions."
  }')
TOKEN_9=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("LogiTrack Solutions")
COMPANY_EMAILS+=("careers@logitrack.com.bd")
COMPANY_TOKENS+=("$TOKEN_9")
echo -e "${GREEN}✓ Created: LogiTrack Solutions${NC}\n"

# Company 10: GameForge Studios
echo -e "${YELLOW}Creating Company 10: GameForge Studios...${NC}"
RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "gameforge",
    "email": "jobs@gameforge.com.bd",
    "password": "'"${PASSWORD}"'",
    "accountType": "recruiter",
    "companyName": "GameForge Studios",
    "ownerName": "Rashed Mahmud",
    "website": "https://gameforge.com.bd",
    "establishedDate": "2020-08-19",
    "employees": "20-50",
    "location": "Dhaka",
    "description": "Game development studio creating mobile and PC games with focus on Bengali culture and storytelling, reaching millions of players worldwide."
  }')
TOKEN_10=$(echo $RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
COMPANY_NAMES+=("GameForge Studios")
COMPANY_EMAILS+=("jobs@gameforge.com.bd")
COMPANY_TOKENS+=("$TOKEN_10")
echo -e "${GREEN}✓ Created: GameForge Studios${NC}\n"

echo -e "${GREEN}✅ All 10 companies created successfully!${NC}\n"

# =============================================================================
# STEP 2: CREATE 14 JOB POSTINGS
# =============================================================================

echo -e "${GREEN}[STEP 2/4] Creating 14 Job Postings...${NC}\n"

# Job 1: Senior Full Stack Developer (TechVentures Bangladesh)
echo -e "${YELLOW}Creating Job 1: Senior Full Stack Developer...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[0]}" \
  -d '{
    "title": "Senior Full Stack Developer",
    "category": "Software Development",
    "vacancy": 2,
    "employmentType": "Full-time",
    "position": "Senior",
    "location": "Dhaka",
    "experienceMin": 3,
    "experienceMax": 5,
    "salaryMin": 80000,
    "salaryMax": 120000,
    "skills": ["React", "Node.js", "MongoDB", "TypeScript", "AWS"],
    "experienceDescription": "3-5 years of experience in full stack development with React and Node.js. Experience with microservices architecture and cloud platforms required.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 1${NC}\n"

# Job 2: Data Scientist (DataSphere Analytics)
echo -e "${YELLOW}Creating Job 2: Data Scientist...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[1]}" \
  -d '{
    "title": "Data Scientist",
    "category": "Data Science",
    "vacancy": 1,
    "employmentType": "Full-time",
    "position": "Mid-level",
    "location": "Chattogram",
    "experienceMin": 2,
    "experienceMax": 4,
    "salaryMin": 70000,
    "salaryMax": 100000,
    "skills": ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"],
    "experienceDescription": "2-4 years experience in data science with strong knowledge of machine learning algorithms and statistical analysis. Experience with deep learning frameworks preferred.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 2${NC}\n"

# Job 3: DevOps Engineer (CloudNine Solutions)
echo -e "${YELLOW}Creating Job 3: DevOps Engineer...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[2]}" \
  -d '{
    "title": "DevOps Engineer",
    "category": "DevOps",
    "vacancy": 2,
    "employmentType": "Full-time",
    "position": "Mid-level",
    "location": "Sylhet",
    "experienceMin": 2,
    "experienceMax": 4,
    "salaryMin": 65000,
    "salaryMax": 95000,
    "skills": ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform"],
    "experienceDescription": "2-4 years of hands-on experience with container orchestration, CI/CD pipelines, and infrastructure as code. AWS certification is a plus.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 3${NC}\n"

# Job 4: Mobile App Developer - Flutter (FinTech Innovations)
echo -e "${YELLOW}Creating Job 4: Mobile App Developer - Flutter...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[3]}" \
  -d '{
    "title": "Mobile App Developer - Flutter",
    "category": "Mobile Development",
    "vacancy": 2,
    "employmentType": "Full-time",
    "position": "Mid-level",
    "location": "Dhaka",
    "experienceMin": 2,
    "experienceMax": 3,
    "salaryMin": 60000,
    "salaryMax": 85000,
    "skills": ["Flutter", "Dart", "Firebase", "REST API", "Git"],
    "experienceDescription": "2-3 years experience developing cross-platform mobile applications using Flutter. Experience with payment gateway integration required for fintech projects.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 4${NC}\n"

# Job 5: UI/UX Designer (EduTech Pro)
echo -e "${YELLOW}Creating Job 5: UI/UX Designer...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[4]}" \
  -d '{
    "title": "UI/UX Designer",
    "category": "Design",
    "vacancy": 1,
    "employmentType": "Full-time",
    "position": "Mid-level",
    "location": "Rajshahi",
    "experienceMin": 2,
    "experienceMax": 4,
    "salaryMin": 50000,
    "salaryMax": 75000,
    "skills": ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"],
    "experienceDescription": "2-4 years of experience in UI/UX design for web and mobile applications. Strong portfolio showcasing user-centered design approach required.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 5${NC}\n"

# Job 6: Backend Developer - Node.js (HealthCare Digital)
echo -e "${YELLOW}Creating Job 6: Backend Developer - Node.js...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[5]}" \
  -d '{
    "title": "Backend Developer - Node.js",
    "category": "Backend Development",
    "vacancy": 2,
    "employmentType": "Full-time",
    "position": "Junior",
    "location": "Khulna",
    "experienceMin": 1,
    "experienceMax": 2,
    "salaryMin": 45000,
    "salaryMax": 65000,
    "skills": ["Node.js", "Express", "MongoDB", "REST API", "Git"],
    "experienceDescription": "1-2 years of backend development experience with Node.js. Knowledge of healthcare data standards (HL7, FHIR) is a plus.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 6${NC}\n"

# Job 7: IoT Developer (AgriTech Systems)
echo -e "${YELLOW}Creating Job 7: IoT Developer...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[6]}" \
  -d '{
    "title": "IoT Developer",
    "category": "IoT Development",
    "vacancy": 1,
    "employmentType": "Full-time",
    "position": "Mid-level",
    "location": "Mymensingh",
    "experienceMin": 2,
    "experienceMax": 3,
    "salaryMin": 55000,
    "salaryMax": 80000,
    "skills": ["Arduino", "Raspberry Pi", "MQTT", "Python", "Sensors"],
    "experienceDescription": "2-3 years experience developing IoT solutions. Experience with agricultural applications and sensor networks preferred.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 7${NC}\n"

# Job 8: Cybersecurity Analyst (CyberShield Security)
echo -e "${YELLOW}Creating Job 8: Cybersecurity Analyst...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[7]}" \
  -d '{
    "title": "Cybersecurity Analyst",
    "category": "Cybersecurity",
    "vacancy": 2,
    "employmentType": "Full-time",
    "position": "Mid-level",
    "location": "Dhaka",
    "experienceMin": 2,
    "experienceMax": 4,
    "salaryMin": 70000,
    "salaryMax": 100000,
    "skills": ["Penetration Testing", "Network Security", "SIEM", "Linux", "Python"],
    "experienceDescription": "2-4 years in cybersecurity with experience in threat analysis and incident response. CEH or OSCP certification preferred.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 8${NC}\n"

# Job 9: Frontend Developer - React (LogiTrack Solutions)
echo -e "${YELLOW}Creating Job 9: Frontend Developer - React...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[8]}" \
  -d '{
    "title": "Frontend Developer - React",
    "category": "Frontend Development",
    "vacancy": 2,
    "employmentType": "Full-time",
    "position": "Junior",
    "location": "Chattogram",
    "experienceMin": 1,
    "experienceMax": 2,
    "salaryMin": 40000,
    "salaryMax": 60000,
    "skills": ["React", "JavaScript", "CSS", "HTML", "Redux"],
    "experienceDescription": "1-2 years of frontend development experience with React. Strong understanding of responsive design and modern CSS frameworks.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 9${NC}\n"

# Job 10: Game Developer - Unity (GameForge Studios)
echo -e "${YELLOW}Creating Job 10: Game Developer - Unity...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[9]}" \
  -d '{
    "title": "Game Developer - Unity",
    "category": "Game Development",
    "vacancy": 2,
    "employmentType": "Full-time",
    "position": "Mid-level",
    "location": "Dhaka",
    "experienceMin": 2,
    "experienceMax": 4,
    "salaryMin": 60000,
    "salaryMax": 90000,
    "skills": ["Unity", "C#", "3D Graphics", "Game Physics", "Mobile Games"],
    "experienceDescription": "2-4 years experience in Unity game development. Published mobile games on Play Store or App Store required.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 10${NC}\n"

# Job 11: QA Engineer (TechVentures Bangladesh)
echo -e "${YELLOW}Creating Job 11: QA Engineer...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[0]}" \
  -d '{
    "title": "QA Engineer",
    "category": "Quality Assurance",
    "vacancy": 1,
    "employmentType": "Full-time",
    "position": "Junior",
    "location": "Dhaka",
    "experienceMin": 1,
    "experienceMax": 2,
    "salaryMin": 35000,
    "salaryMax": 55000,
    "skills": ["Selenium", "Test Automation", "Cypress", "API Testing", "JIRA"],
    "experienceDescription": "1-2 years of experience in software testing with knowledge of automation frameworks. ISTQB certification is a plus.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 11${NC}\n"

# Job 12: Business Analyst (DataSphere Analytics)
echo -e "${YELLOW}Creating Job 12: Business Analyst...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[1]}" \
  -d '{
    "title": "Business Analyst",
    "category": "Business Analysis",
    "vacancy": 1,
    "employmentType": "Full-time",
    "position": "Mid-level",
    "location": "Chattogram",
    "experienceMin": 2,
    "experienceMax": 3,
    "salaryMin": 50000,
    "salaryMax": 75000,
    "skills": ["SQL", "Excel", "Power BI", "Requirements Analysis", "Agile"],
    "experienceDescription": "2-3 years experience as business analyst with strong analytical and communication skills. Experience with data visualization tools required.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 12${NC}\n"

# Job 13: Product Manager (CloudNine Solutions)
echo -e "${YELLOW}Creating Job 13: Product Manager...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[2]}" \
  -d '{
    "title": "Product Manager",
    "category": "Product Management",
    "vacancy": 1,
    "employmentType": "Full-time",
    "position": "Senior",
    "location": "Sylhet",
    "experienceMin": 4,
    "experienceMax": 6,
    "salaryMin": 90000,
    "salaryMax": 130000,
    "skills": ["Product Strategy", "Roadmapping", "Agile", "User Stories", "Analytics"],
    "experienceDescription": "4-6 years of product management experience in tech industry. Proven track record of successful product launches and data-driven decision making.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 13${NC}\n"

# Job 14: Digital Marketing Specialist (FinTech Innovations)
echo -e "${YELLOW}Creating Job 14: Digital Marketing Specialist...${NC}"
curl -s -X POST "${API_BASE}/jobs" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${COMPANY_TOKENS[3]}" \
  -d '{
    "title": "Digital Marketing Specialist",
    "category": "Marketing",
    "vacancy": 1,
    "employmentType": "Full-time",
    "position": "Junior",
    "location": "Dhaka",
    "experienceMin": 1,
    "experienceMax": 2,
    "salaryMin": 35000,
    "salaryMax": 50000,
    "skills": ["SEO", "Google Analytics", "Social Media", "Content Marketing", "Email Marketing"],
    "experienceDescription": "1-2 years of digital marketing experience. Strong understanding of fintech market and B2C marketing strategies preferred.",
    "status": "active"
  }' > /dev/null
echo -e "${GREEN}✓ Created Job 14${NC}\n"

echo -e "${GREEN}✅ All 14 jobs created successfully!${NC}\n"

# =============================================================================
# STEP 3: CREATE CANDIDATE ACCOUNT
# =============================================================================

echo -e "${GREEN}[STEP 3/4] Creating Candidate Account...${NC}\n"

echo -e "${YELLOW}Creating Candidate: Md. Tariqul Islam...${NC}"
CANDIDATE_RESPONSE=$(curl -s -X POST "${API_BASE}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tariqul.islam",
    "email": "tariqul.islam@gmail.com",
    "password": "'"${PASSWORD}"'",
    "accountType": "candidate"
  }')

CANDIDATE_TOKEN=$(echo $CANDIDATE_RESPONSE | grep -o '"accessToken":"[^"]*' | sed 's/"accessToken":"//')
echo -e "${GREEN}✓ Created Candidate: Md. Tariqul Islam${NC}\n"

echo -e "${GREEN}✅ Candidate account created successfully!${NC}\n"

# =============================================================================
# STEP 4: GENERATE CREDENTIAL REPORT
# =============================================================================

echo -e "${GREEN}[STEP 4/4] Generating Credential Report...${NC}\n"

cat > DEMO_CREDENTIALS_GENERATED.txt << EOF
================================================================================
                    INTERNOVA JOB PORTAL - DEMO ACCOUNT CREDENTIALS
================================================================================

COMPANY / RECRUITER ACCOUNTS (10 Total):
────────────────────────────────────────────────────────────────────────────────

1. Company Name: TechVentures Bangladesh
   Email:        hr@techventures.com.bd
   Password:     ${PASSWORD}
   Location:     Dhaka
   Owner:        Ahmed Hassan

2. Company Name: DataSphere Analytics
   Email:        careers@datasphere.com.bd
   Password:     ${PASSWORD}
   Location:     Chattogram
   Owner:        Fatima Rahman

3. Company Name: CloudNine Solutions
   Email:        jobs@cloudnine.com.bd
   Password:     ${PASSWORD}
   Location:     Sylhet
   Owner:        Karim Mohammad

4. Company Name: FinTech Innovations
   Email:        recruitment@fintechinno.com.bd
   Password:     ${PASSWORD}
   Location:     Dhaka
   Owner:        Nusrat Jahan

5. Company Name: EduTech Pro
   Email:        hr@edutechpro.com.bd
   Password:     ${PASSWORD}
   Location:     Rajshahi
   Owner:        Rafiq Islam

6. Company Name: HealthCare Digital
   Email:        careers@healthcaredig.com.bd
   Password:     ${PASSWORD}
   Location:     Khulna
   Owner:        Dr. Sharmin Akter

7. Company Name: AgriTech Systems
   Email:        jobs@agritechsys.com.bd
   Password:     ${PASSWORD}
   Location:     Mymensingh
   Owner:        Mohammad Hossain

8. Company Name: CyberShield Security
   Email:        hr@cybershield.com.bd
   Password:     ${PASSWORD}
   Location:     Dhaka
   Owner:        Tanvir Ahmed

9. Company Name: LogiTrack Solutions
   Email:        careers@logitrack.com.bd
   Password:     ${PASSWORD}
   Location:     Chattogram
   Owner:        Samira Khan

10. Company Name: GameForge Studios
    Email:        jobs@gameforge.com.bd
    Password:     ${PASSWORD}
    Location:     Dhaka
    Owner:        Rashed Mahmud

────────────────────────────────────────────────────────────────────────────────

CANDIDATE ACCOUNT (1 Total):
────────────────────────────────────────────────────────────────────────────────

Name:          Md. Tariqul Islam
Username:      tariqul.islam
Email:         tariqul.islam@gmail.com
Password:      ${PASSWORD}

────────────────────────────────────────────────────────────────────────────────

JOB POSTINGS CREATED: 14 Total
────────────────────────────────────────────────────────────────────────────────

1.  Senior Full Stack Developer       - TechVentures Bangladesh
2.  Data Scientist                    - DataSphere Analytics
3.  DevOps Engineer                   - CloudNine Solutions
4.  Mobile App Developer - Flutter    - FinTech Innovations
5.  UI/UX Designer                    - EduTech Pro
6.  Backend Developer - Node.js       - HealthCare Digital
7.  IoT Developer                     - AgriTech Systems
8.  Cybersecurity Analyst             - CyberShield Security
9.  Frontend Developer - React        - LogiTrack Solutions
10. Game Developer - Unity            - GameForge Studios
11. QA Engineer                       - TechVentures Bangladesh
12. Business Analyst                  - DataSphere Analytics
13. Product Manager                   - CloudNine Solutions
14. Digital Marketing Specialist      - FinTech Innovations

================================================================================

IMPORTANT NOTES:
────────────────────────────────────────────────────────────────────────────────

✓ All accounts created via cURL API calls only
✓ No source code or database was modified
✓ All passwords are strong and meet backend validation
✓ All data is realistic and professional
✓ Locations are actual Bangladesh districts
✓ Safe for local development and testing only

⚠️  DO NOT use these credentials in production
⚠️  These are demo accounts for testing purposes only

────────────────────────────────────────────────────────────────────────────────

API Base URL: http://localhost:5000/api
Frontend URL: http://localhost:5173

Login to test:
- Company Dashboard: Use any company email above
- Candidate Profile: Use tariqul.islam@gmail.com

================================================================================
EOF

echo -e "${GREEN}✅ Credential report generated!${NC}\n"
echo -e "${BLUE}────────────────────────────────────────────────────────${NC}"
echo -e "${GREEN}🎉 DEMO DATA CREATION COMPLETE!${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────${NC}\n"
echo -e "${YELLOW}Summary:${NC}"
echo -e "  • 10 Company accounts created"
echo -e "  • 14 Job postings created"
echo -e "  • 1 Candidate account created"
echo -e "\n${YELLOW}Credentials saved to:${NC}"
echo -e "  📄 DEMO_CREDENTIALS_GENERATED.txt\n"
echo -e "${YELLOW}Common Password for All Accounts:${NC} ${PASSWORD}\n"
echo -e "${GREEN}You can now log in and test the application!${NC}\n"
