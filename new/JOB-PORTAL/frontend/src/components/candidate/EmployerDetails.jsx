import React from 'react';
import { useParams } from 'react-router-dom';

export default function EmployerDetails() {
	const { id } = useParams();
	const companyName = id ? `Company ${id}` : 'Avitex Agency';
	return (
		<div className="employer-page">
			{/* HEADER (simplified) */}
			<header id="header" className="header header-default">
				<div className="tf-container ct2">
					<div className="row">
						<div className="col-md-12">
							<div className="sticky-area-wrap">
								<div className="header-ct-left">
									<div id="logo" className="logo">
										<a href="/">
											<img className="site-logo" src="/images/logo.png" alt="Logo" />
										</a>
									</div>
									<div className="categories">
										<a href="/"><span className="icon-grid" />Categories</a>
									</div>
								</div>
								<div className="header-ct-center">
									<div className="nav-wrap">
										<nav id="main-nav" className="main-nav">
											<ul id="menu-primary-menu" className="menu">
												<li className="menu-item"><a href="/">Home</a></li>
												<li className="menu-item"><a href="/find-jobs">Find jobs</a></li>
												<li className="menu-item current-item"><a href="/employers">Employers</a></li>
												<li className="menu-item"><a href="/candidates">Candidates</a></li>
												<li className="menu-item"><a href="/blog">Blog</a></li>
												<li className="menu-item"><a href="/pages">Pages</a></li>
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

			{/* Hero */}
			<section className="single-job-thumb">
				<img src="/images/review/singlejob.jpg" alt="hero" />
			</section>

			{/* Company sticky bar */}
			<section className="form-sticky fixed-space">
				<div className="tf-container">
					<div className="row">
						<div className="col-lg-12">
							<div className="wd-job-author stc-em">
								<div className="inner-job-left">
									<img src="/images/logo-company/cty4.png" alt="company" className="logo-company" />
									<div className="content">
										<h3><a href="/employers">{companyName}</a><span className="icon-bolt" /></h3>
										<div className="job-info">
											<span className="icon-map-pin" />
											<span>Las Vegas, NV 89107, USA</span>
										</div>
										<div className="group-btn">
											<button className="tf-btn">Follow</button>
											<button className="tf-btn">2 job openings</button>
										</div>
									</div>
								</div>
								<div className="inner-job-right">
									<span className="icon-share2" />
									<div className="group-btn">
										<button className="tf-btn-submit btn-popup">Write a review</button>
										<button className="tf-btn">Message</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Main content */}
			<section className="inner-employer-section">
				<div className="tf-container">
					<div className="row">
						<div className="col-lg-8">
							<article className="job-article tf-tab single-job single-employer">
								<ul className="menu-tab">
									<li className="ct-tab">About</li>
									<li className="ct-tab">Jobs (2)</li>
									<li className="ct-tab">Reviews</li>
								</ul>
								<div className="content-tab">
									<div className="inner-content">
										<h5>About Company</h5>
										<p>Are you a User Experience Designer with a track record of delivering intuitive digital experiences that drive results?</p>
										<p>Deloitte's Green Dot Agency is looking to add a Lead User Experience Designer to our experience design team.</p>

										<div className="post-navigation d-flex aln-center">
											<div className="wd-social d-flex aln-center">
												<span>Social Profiles:</span>
												<ul className="list-social d-flex aln-center">
													<li><a href="https://facebook.com"><i className="icon-facebook" /></a></li>
													<li><a href="https://linkedin.com"><i className="icon-linkedin2" /></a></li>
													<li><a href="https://twitter.com"><i className="icon-twitter" /></a></li>
												</ul>
											</div>
											<a href="/report" className="frag-btn">Report job</a>
										</div>

										<div className="related-job">
											<h6>Related Jobs</h6>
											<div className="features-job mg-bt-0">
												<div className="job-archive-header">
													<div className="inner-box">
														<div className="logo-company">
															<img src="/images/logo-company/cty4.png" alt="logo" />
														</div>
														<div className="box-content">
															<h4><a href="/employers/tamari-law">Tamari Law Group LLC</a></h4>
															<h3><a href="/jobs/hr-administration">HR Administration</a><span className="icon-bolt" /></h3>
															<ul>
																<li><span className="icon-map-pin" />Las Vegas, NV 89107, USA</li>
																<li><span className="icon-calendar" />2 days ago</li>
															</ul>
															<span className="icon-heart" />
														</div>
													</div>
												</div>
												<div className="job-archive-footer">
													<div className="job-footer-left">
														<ul className="job-tag"><li><a href="/tags/part-time">Part-time</a></li><li><a href="/tags/remote">Remote</a></li></ul>
													</div>
													<div className="job-footer-right">
														<div className="price"><span className="icon-dolar1" /><p>$83,000 - $110,000 <span className="year">/year</span></p></div>
														<p className="days">24 days left to apply</p>
													</div>
												</div>
											</div>
										</div>

										<div className="job-rating">
											<h6>Reviews</h6>
											<div className="rating-review">
												<div className="left-rating">
													<h2>4.8</h2>
													<ul className="list-star"><li className="icon-star-full" /><li className="icon-star-full" /><li className="icon-star-full" /></ul>
													<p className="count-rating">(1,968 Ratings)</p>
												</div>
												<div className="right-rating">
													<ul className="rating-list">
														<li className="rating-details">5 <div className="progress-item"><div className="donat-bg"><div className="custom-donat" style={{width: '60%'}} /></div></div></li>
													</ul>
												</div>
											</div>
										</div>

										<form method="post" className="wd-form-rating">
											<div className="row">
												<div className="col-lg-12">
													<div className="form-rating-heading">
														<h3>Be the first to review</h3>
														<div className="group-rating">
															<label>Your Rating:</label>
															<div className="list-rating">
																<input type="radio" id="star5" name="rate" value="5" />
																<label htmlFor="star5" />
																<input type="radio" id="star4" name="rate" value="4" />
																<label htmlFor="star4" />
															</div>
														</div>
													</div>
												</div>

												<div className="col-lg-12">
													<div className="form-rating-content">
														<div className="row">
															<div className="col-lg-6"><div className="wrap-input"><label>Name</label><input type="text" placeholder="Tony Nguyen |" /></div></div>
															<div className="col-lg-6"><div className="wrap-input"><label>Email</label><input type="text" placeholder="jobtex@mail.com" /></div></div>
															<div className="col-lg-12"><div className="wrap-checkbox"><input type="checkbox" /><label>Save your name, email for the next time review</label></div></div>
															<div className="col-lg-12"><div className="wrap-notes"><label>Review</label><textarea cols="30" rows="6" placeholder="Write comment" /></div></div>
														</div>
													</div>
												</div>
												<div className="col-lg-12"><button className="tf-btn-submit style-2">submit review</button></div>
											</div>
										</form>

									</div>
								</div>
							</article>
						</div>

						{/* Right sidebar */}
						<div className="col-lg-4">
							<div className="cv-form-details po-sticky job-sg" style={{top: 194}}>
								<div className="map-content">
									<iframe title="Company location" className="map-box" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d7302.453092836291!2d90.47477022812872!3d23.77494577893369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1627293157601!5m2!1svi!2s" allowFullScreen loading="lazy" />
								</div>
								<ul className="list-infor">
									<li><div className="category">Website</div><div className="detail"><a href="https://avitex.vn">avitex.vn</a></div></li>
									<li><div className="category">Email</div><div className="detail">hi.avitex@gmail.com</div></li>
									<li><div className="category">Industry</div><div className="detail">Internet Publishing</div></li>
								</ul>
								<div className="wd-social d-flex aln-center">
									<span>Socials:</span>
									<ul className="list-social d-flex aln-center">
										<li><a href="https://facebook.com"><i className="icon-facebook" /></a></li>
										<li><a href="https://linkedin.com"><i className="icon-linkedin2" /></a></li>
									</ul>
								</div>
								<div className="form-job-single">
									<h6>Contact Us</h6>
									<form action="post">
										<input type="text" placeholder="Subject" />
										<input type="text" placeholder="Name" />
										<input type="email" placeholder="Email" />
										<textarea placeholder="Message..." />
										<button>Send Message</button>
									</form>
								</div>
							</div>
						</div>

					</div>
				</div>
			</section>

			{/* Footer (simplified) */}
			<footer className="footer">
				<div className="top-footer">
					<div className="tf-container">
						<div className="row">
							<div className="col-lg-2 col-md-4"><div className="footer-logo"><img src="/images/logo.png" alt="logo" /></div></div>
							<div className="col-lg-10 col-md-8"><div className="wd-social d-flex aln-center"><span>Follow Us:</span></div></div>
						</div>
					</div>
				</div>
				<div className="bottom">
					<div className="tf-container">
						<div className="row">
							<div className="col-lg-6 col-md-6"><div className="bt-left"><div className="copyright">©2023 Themesflat. All Rights Reserved.</div></div></div>
							<div className="col-lg-6 col-md-6"><ul className="menu-bottom d-flex aln-center"><li><a href="/terms">Terms Of Services</a></li></ul></div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
