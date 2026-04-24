import { Link } from "react-router-dom";

const CategoryCard = ({ icon, title, jobCount }) => {
  return (
    <div className="col-lg-3 col-md-6 mt-4 pt-2">
      <div className="popu-category-box rounded text-center">
        <div className="popu-category-icon icons-md">
          <i className={icon}></i>
        </div>

        <div className="popu-category-content mt-4">
          <Link to="/job-categories" className="text-dark stretched-link">
            <h5 className="fs-18">{title}</h5>
          </Link>
          <p className="text-muted mb-0">{jobCount} Jobs</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
