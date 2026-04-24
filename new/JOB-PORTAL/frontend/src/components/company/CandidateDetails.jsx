import React from 'react';
import { Link } from 'react-router-dom';
import './EmployerDetails.css';

export default function MentionPage() {
  return (
    <div className="mention-page">
      {/* HEADER */}
      <header id="header" className="header header-default">
        <div className="tf-container ct2">
          <div className="row">
            <div className="col-md-12">
              <div className="sticky-area-wrap">
                <div className="header-ct-left">
                  <div id="logo" className="logo">
                    <Link to="/">
                      <img className="site-logo" src="/images/logo.png" alt="Logo" />
                    </Link>
                  </div>
                  <div className="categories">
                    <Link to="/"> <span className="icon-grid" /> Categories</Link>
                    <div className="sub-categorie">
                      <ul className="pop-up">
                        <li>
                          <Link to="#">
                            <span className="icon-categorie-1" /> Design &amp; Creative
                          </Link>
                        </li>
                        <li>
                          <Link to="#">
                            <span className="icon-categorie-8" /> Digital Marketing
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="header-ct-center">
                  <div className="nav-wrap">
                    <nav id="main-nav" className="main-nav">
                      <ul id="menu-primary-menu" className="menu">
                        <li className="menu-item"><Link to="/">Home</Link></li>
                        <li className="menu-item"><Link to="/find-jobs">Find jobs</Link></li>
                        <li className="menu-item current-item"><Link to="/employers">Employers</Link></li>
                        <li className="menu-item"><Link to="/candidates">Candidates</Link></li>
                        <li className="menu-item"><Link to="/blog">Blog</Link></li>
                      </ul>
                    </nav>
                  </div>
                </div>

                <div className="header-ct-right">
                  <div className="header-customize-item account">
                    <img src="/images/user/avatar/image-01.jpg" alt="user" />
                    <div className="name">Candidates</div>
                  </div>
                </div>

                <div className="nav-filter">
                  <div className="nav-mobile"><span /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AUTHOR / HERO */}
      <section className="wrapper-author-page-title style2 stc form-sticky fixed-space">
        <div className="tf-container">
          <div className="wd-author-page-title">
            <div className="author-archive-header">
              <img src="/images/user/avatar/avt-author-1.jpg" alt="author" className="logo-company" />
              <div className="content">
                <a href="#" className="tag-head">Available now</a>
                <h4><a href="#">Computer Systems Analyst</a></h4>
                <h3><a href="#">Maverick Nguyen</a> <span className="icon-bolt" /></h3>
                <ul className="author-list">
                  <li className="tag">Blender</li>
                  <li className="tag">Sketch</li>
                  <li className="map"><span className="icon-map-pin" /> Tokyo, Japan</li>
                  <li className="price"><span className="icon-dolar1" /> $300/day</li>
                </ul>
              </div>
            </div>
            <div className="author-archive-footer">
              <button className="tf-btn btn-popup">Download CV</button>
              <button className="tf-btn btn-author">Message</button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN SECTION */}
      <section className="candidates-section">
        <div className="tf-container">
          <div className="row">
            <div className="col-lg-8">
              <article className="job-article stc tf-tab single-job">
                <ul className="menu-tab stc">
                  <li className="ct-tab active">Resumes</li>
                  <li className="ct-tab">Portfolio</li>
                  <li className="ct-tab">Contact</li>
                </ul>

                <div className="content-tab">
                  <div className="inner-content">
                    <h5>About me</h5>
                    <p>
                      Are you a User Experience Designer with a track record of delivering intuitive digital experiences
                      that drive results? This section is a short profile summary.
                    </p>

                    <h5>Education</h5>
                    <div className="group-infor">
                      <div className="inner">
                        <div className="sub-heading">FPT University <span>2019 - 2021</span></div>
                        <div className="heading">Graphic Design</div>
                      </div>
                    </div>

                    <h5>Portfolio</h5>
                    <div className="video-thumb">
                      <div className="content-tab2">
                        <div className="inner">
                          <div className="thumb">
                            <img src="/images/review/thumbv3.jpg" alt="thumb" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-candidate">
                      <h5>Contact Candidate</h5>
                      <form method="post">
                        <div className="group-input">
                          <div className="ip">
                            <label>Subject</label>
                            <input type="text" placeholder="Subject" />
                          </div>
                          <div className="ip">
                            <label>Name</label>
                            <input type="text" placeholder="Name" />
                          </div>
                        </div>
                        <div className="ip out">
                          <label>Email</label>
                          <input type="email" placeholder="Email" />
                        </div>
                        <div className="ip out">
                          <label>Message</label>
                          <textarea placeholder="Message..." />
                        </div>
                        <button type="submit" className="tf-btn">Send Private Message</button>
                      </form>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="col-lg-4">
              <div className="cv-form-details stc po-sticky job-sg" style={{ top: 247 }}>
                <ul className="list-infor">
                  <li><div className="category">Career Finding</div><div className="detail">UI UX Designer</div></li>
                  <li><div className="category">Location</div><div className="detail">Hanoi City, VietNam</div></li>
                  <li><div className="category">Phone Number</div><div className="detail">123 456 7890</div></li>
                  <li><div className="category">Email</div><div className="detail">hi.avitex@gmail.com</div></li>
                </ul>
                <div className="wd-social d-flex aln-center">
                  <span>Socials:</span>
                  <ul className="list-social d-flex aln-center">
                    <li><a href="https://facebook.com"><i className="icon-facebook" /></a></li>
                    <li><a href="https://linkedin.com"><i className="icon-linkedin2" /></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="top-footer">
          <div className="tf-container">
            <div className="row">
              <div className="col-lg-2 col-md-4">
                <div className="footer-logo"><img src="/images/logo.png" alt="logo" /></div>
              </div>
              <div className="col-lg-10 col-md-8">
                <div className="wd-social d-flex aln-center"><span>Follow Us:</span></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
