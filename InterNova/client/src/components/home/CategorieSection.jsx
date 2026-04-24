import CategoryView from "./CategoryView";

const CategorySection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section-title text-center">
              <h3 className="title">Browser Jobs Categories</h3>
              <p className="text-muted">
                Post a job to tell us about your project. We'll quickly match you
                with the right Freelancers.
              </p>
            </div>
          </div>
        </div>

        <CategoryView />
      </div>
    </section>
  );
};

export default CategorySection;
