# InterNova Server API Endpoints

This document lists all available API endpoints in the InterNova server application, organized by module.

## 1. Authentication Module (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user (Candidate/Recruiter) | Public |
| `POST` | `/login` | Authenticate user & get tokens | Public |
| `POST` | `/refresh-token` | Refresh expired access token | Public |
| `GET` | `/me` | Get current user context | Private |
| `POST` | `/logout` | Logout user | Private |
| `POST` | `/forgot-password` | Initiate password reset | Public |
| `POST` | `/reset-password` | Complete password reset | Public |

## 2. Jobs Module (`/api/jobs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a new job listing | Recruiter |
| `GET` | `/` | List jobs (filters: keyword, location, etc.) | Public |
| `GET` | `/:id` | Get single job details | Public |
| `PUT` | `/:id` | Update job details | Recruiter (Owner) |
| `DELETE` | `/:id` | Delete a job | Recruiter (Owner) |
| `PATCH` | `/:id/status` | Update status (active/paused/closed) | Recruiter (Owner) |
| `GET` | `/recruiter/my-jobs` | Get jobs posted by current recruiter | Recruiter |
| `GET` | `/recruiter/stats` | Get job statistics | Recruiter |

## 3. Companies Module (`/api/companies`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | List all companies | Public |
| `GET` | `/:id` | Get company public profile | Public |
| `GET` | `/:id/jobs` | Get jobs for a specific company | Public |
| `GET` | `/me` | Get own company profile | Recruiter |
| `PATCH` | `/me` | Update company profile & logo | Recruiter |
| `PATCH` | `/change-password` | Change account password | Recruiter |

## 4. Applications Module (`/api/applications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/apply` | Submit a job application | Candidate |
| `GET` | `/my` | List own applications | Candidate |
| `GET` | `/job/:jobId` | View applicants for a specific job | Recruiter |
| `PUT` | `/:id/status` | Update application status (shortlist/reject) | Recruiter |

## 5. Candidates Module (`/api/candidates`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Get own candidate profile | Candidate |
| `PUT` | `/me` | Update candidate profile | Candidate |
| `PUT` | `/change-password` | Change account password | Candidate |
| `GET` | `/applied-jobs` | List applied jobs (Detailed) | Candidate |
| `GET` | `/bookmarks` | Get bookmarked jobs | Candidate |
| `POST` | `/bookmarks/:jobId` | Add job to bookmarks | Candidate |
| `DELETE` | `/bookmarks/:jobId`| Remove job from bookmarks | Candidate |

---

## Small Example: Creating a Job (JavaScript/Fetch)

Here is how a Recruiter client would create a new job posting using the API.

```javascript
// 1. Setup request data
const jobData = {
  title: "Senior React Developer",
  category: "Development",
  vacancy: 2,
  employmentType: "Full Time",
  position: "Senior",
  location: "Dhaka",
  salaryRange: "80000-120000 BDT",
  experience: "3-5 Years",
  description: "We are looking for an experienced React developer...",
  skills: ["React", "Node.js", "MongoDB"]
};

// 2. Make the authenticated request
async function postJob() {
  try {
    // Assuming accessToken is stored in localStorage
    const token = localStorage.getItem('internnova.accessToken');

    const response = await fetch('http://localhost:5000/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(jobData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('Job Posted Successfully:', result.data);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
}

// 3. Execute
postJob();
```
