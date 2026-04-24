import { useState, useEffect } from 'react';
import { applyPublic, applyForJob, checkIfApplied } from '@/services/applications.service';
import { useAuth } from '@/context/AuthContext';

const ApplyJobModal = ({ jobId }) => {
  const { isAuth, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if user has already applied when modal mounts or jobId changes
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (!jobId) {
        setCheckingStatus(false);
        return;
      }

      // Only check if user is authenticated
      if (!isAuth) {
        setCheckingStatus(false);
        setHasApplied(false);
        return;
      }

      try {
        setCheckingStatus(true);
        const applied = await checkIfApplied(jobId);
        setHasApplied(applied);
      } catch (error) {
        console.error('Error checking application status:', error);
        setHasApplied(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkApplicationStatus();
  }, [jobId, isAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting || hasApplied) return;

    setIsSubmitting(true);

    try {
      let response;

      if (isAuth && user) {
        // Authenticated user - use authenticated endpoint
        response = await applyForJob(jobId, null);
      } else {
        // Guest user - use public endpoint (requires email)
        response = await applyPublic({ jobId });
      }

      console.log('Apply response:', response);

      // Mark as applied
      setHasApplied(true);

      // Show success message
      alert('Application submitted successfully!');

      // Close modal
      const modalElement = document.getElementById('applyNow');
      const modal = window.bootstrap?.Modal?.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }

      // Redirect after successful apply
      setTimeout(() => {
        window.location.href = '/applied-jobs';
      }, 500);

    } catch (err) {
      console.error('Apply error:', err);
      
      // Handle 409 Conflict - already applied
      if (err.response?.status === 409) {
        setHasApplied(true);
        alert('You have already applied for this job.');
      } else {
        alert(err.response?.data?.message || 'Failed to submit application');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="applyNow"
      tabIndex="-1"
      aria-labelledby="applyNowLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-5 position-relative text-center">

              {/* Close Button */}
              <div className="position-absolute end-0 top-0 p-3">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>

              {/* Icon (optional but professional) */}
              <div className="mb-3">
                <i className="bi bi-question-circle fs-1 text-primary"></i>
              </div>

              {/* Confirmation Message */}
              <h5 className="mb-2 fw-semibold">
                {hasApplied ? 'Already Applied' : 'Are you sure you want to apply?'}
              </h5>

              <p className="text-muted mb-4">
                {hasApplied 
                  ? 'You have already submitted your application for this job.'
                  : 'Your profile will be submitted to the employer for review.'
                }
              </p>

              {/* Actions */}
              <div className="d-flex gap-3 justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  {hasApplied ? 'Close' : 'Cancel'}
                </button>

                {!hasApplied && (
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={isSubmitting || checkingStatus}
                  >
                    {isSubmitting ? 'Submitting...' : 'Send Application'}
                  </button>
                )}
              </div>

            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
