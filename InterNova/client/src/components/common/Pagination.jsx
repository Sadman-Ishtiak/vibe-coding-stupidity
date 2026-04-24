export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="row">
      <div className="col-lg-12 mt-5">
        <nav>
          <ul className="pagination job-pagination mb-0 justify-content-center">

            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage - 1)}
              >
                <i className="mdi mdi-chevron-double-left fs-15"></i>
              </button>
            </li>

            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
              >
                <i className="mdi mdi-chevron-double-right fs-15"></i>
              </button>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
}
