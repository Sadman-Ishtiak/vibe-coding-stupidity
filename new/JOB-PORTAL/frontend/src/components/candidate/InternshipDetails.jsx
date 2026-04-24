import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './InternshipDetails.css';

const InternshipDetails = () => {
  const [tab, setTab] = useState('about');
  const params = useParams();
  const jobId = params?.id || null;

  return (
    <div className="internship-details">
      <header id="header" className="header header-default">
        <div className="tf-container ct2">
          <div className="row">
            <div className="col-md-12">
              <div className="sticky-area-wrap">
                <div className="header-ct-left">
                  <div id="logo" className="logo">
                    <a href="/">
                      <img className="site-logo" src="/images/logo.png" alt="logo" />
                    </a>
                  </div>
                </div>
                <div className="header-ct-center">
                  <div className="nav-wrap">
                    <nav id="main-nav" className="main-nav">
                      <ul id="menu-primary-menu" className="menu">
                        <li className="menu-item"><a href="/">Home</a></li>
                        <li className="menu-item current-item"><a href="/find-jobs">Find jobs</a></li>
                        <li className="menu-item"><a href="/employers">Employers</a></li>
                        <li className="menu-item"><a href="/candidates">Candidates</a></li>
                        <li className="menu-item"><a href="/blog">Blog</a></li>
                        <li className="menu-item"><a href="/pages">Pages</a></li>
                      </ul>
                    </nav>
                  </div>
                </div>
                <div className="header-ct-right">
                  <div className="header-customize-item account">
                    <img src="/images/user/avatar/image-01.jpg" alt="avatar" />
                    <div className="name">Candidates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="single-job-thumb">
        <img src="/images/review/singlejob.jpg" alt="hero" />
      </section>

      <section className="form-sticky fixed-space">
        <div className="tf-container">
          <div className="row">
            <div className="col-lg-12">
              <div className="wd-job-author2">
                <div className="content-left">
                  <div className="thumb">
                    <img src="/images/logo-company/cty4.png" alt="logo" />
                  </div>
                  <div className="content">
                    <a href="/" className="category">Rockstar Games New York</a>
                    <h6>
                      <a href="/">Senior UI/UX Designer <span className="icon-bolt" /></a>
                      {jobId && <small className="ms-2 text-muted">(Job ID: {jobId})</small>}
                    </h6>
                    <ul className="job-info">
                      <li><span className="icon-map-pin" /> <span>Las Vegas, NV 89107, USA</span></li>
                      <li><span className="icon-calendar" /> <span>2 days ago</span></li>
                    </ul>
                    <ul className="tags">
                      <li><a href="/">Full-time</a></li>
                      <li><a href="/">Remote</a></li>
                    </ul>
                  </div>
                </div>
                <div className="content-right">
                  <div className="top">
                    <a href="/" className="share">Share</a>
                    <a href="/" className="wishlist">Save</a>
                    <Link to={`/internship/${jobId}/apply`} className="btn btn-popup">Apply Now</Link>
                  </div>
                  <div className="bottom">
                    <div className="gr-rating">
                      <p>32 days left to apply</p>
                    </div>
                    <div className="price">
                      <span className="icon-dollar" />
                      <p>$83,000 - $110,000 <span className="year">/year</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="inner-jobs-section">
        <div className="tf-container">
          <div className="row">
            <div className="col-lg-8">
              <article className="job-article tf-tab single-job">
                <ul className="menu-tab">
                  <li className={`ct-tab ${tab === 'about' ? 'active' : ''}`} onClick={() => setTab('about')}>About</li>
                  <li className={`ct-tab ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>Jobs (2)</li>
                  <li className={`ct-tab ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>Reviews</li>
                </ul>

                <div className="content-tab">
                  {tab === 'about' && (
                    <div className="inner-content">
                      <h5>Full Job Description</h5>
                      <p>Are you a User Experience Designer with a track record of delivering intuitive digital experiences that drive results?</p>
                      <h6>The Work You'll Do:</h6>
                      <ul className="list-dot">
                        <li>Support the Creative Directors and Associate Creative Directors of experience design.</li>
                        <li>Make strategic and tactical UX decisions related to design and usability.</li>
                        <li>Creates low- and high-fidelity wireframes that represent a user's journey.</li>
                      </ul>
                    </div>
                  )}

                  {tab === 'jobs' && (
                    <div className="inner-content">
                      <h5>Other Jobs</h5>
                      <p>List of similar jobs appears here.</p>
                    </div>
                  )}

                  {tab === 'reviews' && (
                    <div className="inner-content">
                      <h5>Reviews</h5>
                      <div className="job-rating">
                        <h6>reviews</h6>
                        <div className="rating-review">
                          <div className="left-rating">
                            <h2>4.8</h2>
                            <p className="count-rating">(1,968 Ratings)</p>
                          </div>
                        </div>
                        <ul className="client-review">
                          <li className="client-item">
                            <div className="content">
                              <div className="top-content">
                                <div className="avatar">
                                  <div className="avt"><img src="/images/review/avt.jpg" alt="avt" /></div>
                                  <div className="infor">
                                    <h5><a href="/">Dianne Russell</a></h5>
                                    <a href="/" className="date">August 13, 2023</a>
                                    <ul className="list-star"><li className="icon-star-full"/></ul>
                                    <p>Great 401K benefits - not based on a match but is 8% contribution</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>

            <div className="col-lg-4">
              <div className="cv-form-details po-sticky job-sg" style={{ top: 200 }}>
                <div className="map-content">
                  <iframe
                    className="map-box"
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7302.453092836291!2d90.47477022812872!3d23.77494577893369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1627293157601!5m2!1svi!2s"
                    allowFullScreen
                    loading="lazy"
                    title="company-map"
                  />
                </div>
                <ul className="list-infor">
                  <li><div className="category">Website</div><div className="detail"><a href="https://avitex.vn">avitex.vn</a></div></li>
                  <li><div className="category">Email</div><div className="detail">hi.avitex@gmail.com</div></li>
                  <li><div className="category">Industry</div><div className="detail">Internet Publishing</div></li>
                </ul>

                <div className="wd-social d-flex aln-center">
                  <span>Socials:</span>
                  <ul className="list-social d-flex aln-center">
                    <li><a href="/"><i className="icon-facebook"/></a></li>
                    <li><a href="/"><i className="icon-linkedin2"/></a></li>
                    <li><a href="/"><i className="icon-twitter"/></a></li>
                  </ul>
                </div>

                <div className="form-job-single">
                  <h6>Contact Us</h6>
                  <form>
                    <input type="text" placeholder="Subject" />
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <textarea placeholder="Message..." />
                    <button type="button">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="top-footer">
          <div className="tf-container">
            <div className="row">
              <div className="col-lg-2">
                <div className="footer-logo"><img src="/images/logo.png" alt="logo" /></div>
              </div>
              <div className="col-lg-10">
                <div className="wd-social d-flex aln-center">
                  <span>Follow Us:</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="tf-container">
            <div className="row">
              <div className="col-lg-6">
                <div className="bt-left">©2025 Your Company. All Rights Reserved.</div>
              </div>
              <div className="col-lg-6">
                <ul className="menu-bottom d-flex aln-center">
                  <li><a href="/terms">Terms Of Services</a></li>
                  <li><a href="/privacy">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InternshipDetails;
