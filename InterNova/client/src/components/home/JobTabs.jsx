import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ApplyJobModal from "@/components/common/ApplyJobModal";
import { normalizeImageUrl } from '@/utils/imageHelpers';

const JobTabs = ({ jobs = [] }) => {
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedJobId, setSelectedJobId] = useState(null);

  // Filter jobs based on active tab (using employmentType from backend)
  const filteredJobs = useMemo(() => {
    switch (activeTab) {
      case "Internship":
        return jobs.filter(job => 
          job.employmentType?.toLowerCase() === "internship"
        );

      case "part-time":
        return jobs.filter(job => 
          job.employmentType?.toLowerCase() === "part time" ||
          job.employmentType?.toLowerCase() === "part-time"
        );

      case "full-time":
        return jobs.filter(job => 
          job.employmentType?.toLowerCase() === "full time" ||
          job.employmentType?.toLowerCase() === "full-time"
        );

      case "recent":
      default:
        // Return all jobs sorted by createdAt (already sorted from backend)
        return jobs.slice(0, 3); // Show top 6 recent jobs
    }
  }, [activeTab, jobs]);

  return (
    <>
      {/* ================= FILTER TABS ================= */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <ul className="job-list-menu nav nav-pills nav-justified flex-column flex-sm-row mb-4">
            {[
              { key: "recent", label: "Recent Jobs" },
              { key: "Internship", label: "Internship" },
              { key: "part-time", label: "Part Time" },
              { key: "full-time", label: "Full Time" }
            ].map(tab => (
              <li className="nav-item" key={tab.key}>
                <button
                  type="button"
                  className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= JOB LIST ================= */}
      <div className="row">
        <div className="col-lg-12">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => {
              const companyName = job.company?.name || "Unknown Company";
              const companyLogo = normalizeImageUrl(job.company?.logo) || "/assets/images/featured-job/img-01.png";
              const jobId = job._id;
              const companyId = job.company?._id;
              
              return (
                <div key={job._id} className="job-box card mt-4">
                  <div className="p-4">
                    <div className="row align-items-center">
                      {/* Company Logo */}
                      <div className="col-md-2">
                        <div className="text-center mb-4 mb-lg-0">
                          <Link to={`/company-details?id=${companyId}`}>
                            <img 
                              src={companyLogo}
                              alt={companyName}
                              className="img-fluid rounded-3"
                              onError={(e) => {
                                e.target.src = '/assets/images/featured-job/img-01.png';
                              }}
                            />
                          </Link>
                        </div>
                      </div>

                      {/* Job Title & Company */}
                      <div className="col-md-3">
                        <div className="mb-2 mb-md-0">
                          <h5 className="fs-18 mb-0">
                            <Link className="text-dark" to={`/job-details?id=${jobId}`}>
                              {job.title}
                            </Link>
                          </h5>
                          <p className="text-muted fs-14 mb-0">{companyName}</p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="col-md-3">
                        <div className="d-flex mb-2">
                          <div className="flex-shrink-0">
                            <i className="mdi mdi-map-marker text-primary me-1"></i>
                          </div>
                          <p className="text-muted mb-0">{job.location || "Remote"}</p>
                        </div>
                      </div>

                      {/* Salary */}
                      <div className="col-md-2">
                        <div className="d-flex mb-0">
                          <div className="flex-shrink-0">
                            <i className="uil uil-wallet text-primary me-1"></i>
                          </div>
                          <p className="text-muted mb-0">{job.salaryRange || "Negotiable"}</p>
                        </div>
                      </div>

                      {/* Employment Type Badge */}
                      <div className="col-md-2">
                        <div>
                          <span className="badge bg-soft-success fs-13 mt-1">
                            {job.employmentType || "Full Time"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Footer */}
                  <div className="p-3 bg-light">
                    <div className="row justify-content-between">
                      <div className="col-md-8">
                        <div>
                          <p className="text-muted mb-0">
                            <span className="text-dark">Experience:</span> {job.experience || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="text-md-end">
                          <button
                            type="button"
                            className="primary-link border-0 bg-transparent"
                            data-bs-toggle="modal"
                            data-bs-target="#applyNow"
                            onClick={() => setSelectedJobId(jobId)}
                            style={{ cursor: 'pointer' }}
                          >
                            Apply Now <i className="mdi mdi-chevron-double-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center mt-4">
              <p className="text-muted">No jobs found for this category</p>
            </div>
          )}

          {/* View More Button */}
          {filteredJobs.length > 0 && (
            <div className="text-center mt-4 pt-2">
              <Link to="/job-list" className="btn btn-primary">
                View More <i className="uil uil-arrow-right"></i>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Apply Job Modal */}
      <ApplyJobModal jobId={selectedJobId} />
    </>
  );
};

export default JobTabs;
