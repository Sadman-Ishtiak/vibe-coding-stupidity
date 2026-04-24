export default function PrivacyPolicy() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <section className="page-title-box">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center text-white">
                <h3 className="mb-4">Privacy & Policy</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="position-relative" style={{ zIndex: 1 }}>
        <div className="shape">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
            <path fill="#FFFFFF" fillOpacity="1" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <h5 className="mb-4">Use for InternNova</h5>
              <ul className="about-list list-unstyled text-muted mb-4 pb-2">
                <li>
                  At InternNova, accessible at Website.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by InternNova and how we use it. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at <b className="text-danger">internnova@technologypvt.ltd.com</b>
                </li>
                <li>
                  If you have additional questions or require more information about our Privacy Policy
                </li>
                <li>
                  This privacy policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in InternNova. This policy is not applicable to any information collected offline or via channels other than this website.
                </li>
                <li>
                  Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity to our website with regards to the information that they shared and/or collect in InternNova. This policy is not applicable to any information collected offline or via channels other than this website.
                </li>
              </ul>

              <h5 className="mb-4">We use your information to:</h5>
              <ul className="about-list list-unstyled text-muted mb-4 pb-2">
                <li>Digital Marketing Solutions for Tomorrow</li>
                <li>Our Talented & Experienced Marketing Agency</li>
                <li>It is said that song composers of the past used texts.</li>
                <li>Create your own skin to match your brand</li>
              </ul>
              
              <h5 className="mb-4">Privacy and copyright protection</h5>
              <ul className="about-list list-unstyled text-muted mb-4 pb-2">
                <li>
                  There is now an <b className="text-danger">abundance</b> of readable dummy texts. These are usually used when a text is required purely to fill a space. These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or nonsensical stories.
                </li>
                <li>
                  It seems that only fragments of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added or deleted at various positions within the text.
                </li>
              </ul>

              <div className="text-end">
                <button onClick={handlePrint} className="btn btn-primary">
                  <i className="uil uil-print"></i> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
