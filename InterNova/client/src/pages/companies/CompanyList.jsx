import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import CompanyCard from '@/components/cards/CompanyCard';
import Pagination from '@/components/common/Pagination';
import { listCompanies } from '@/services/companies.service';

export default function CompanyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 9
  });

  // Get query params
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await listCompanies({
        page: currentPage,
        limit: 9,
        sortBy,
        order
      });
      
      if (response.success) {
        setCompanies(response.data || []);
        setPagination(response.pagination || {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          limit: 9
        });
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, order]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    const params = { page: '1' }; // Reset to page 1 on sort change
    
    switch (value) {
      case 'ne': // Newest
        params.sortBy = 'createdAt';
        params.order = 'desc';
        break;
      case 'od': // Oldest
        params.sortBy = 'createdAt';
        params.order = 'asc';
        break;
      case 'az': // A-Z
        params.sortBy = 'companyName';
        params.order = 'asc';
        break;
      case 'za': // Z-A
        params.sortBy = 'companyName';
        params.order = 'desc';
        break;
      default: // Default
        params.sortBy = 'createdAt';
        params.order = 'desc';
    }
    
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    
    const params = { page: page.toString() };
    if (sortBy !== 'createdAt') params.sortBy = sortBy;
    if (order !== 'desc') params.order = order;
    
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <>
      {/* Page Title */}
      <section className="page-title-box">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center text-white">
                <h3 className="mb-4">Companies</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shape */}
      <div className="position-relative" style={{ zIndex: 1 }}>
        <div className="shape">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
            <path
              fill="#FFFFFF"
              fillOpacity="1"
              d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* Main Section */}
      <section className="section">
        <div className="container">
          {/* Header Row */}
          <div className="candidate-list-widgets d-flex justify-content-end">
            <div className="selection-widget">
              <select 
                className="form-select" 
                aria-label="Order By"
                onChange={handleSortChange}
                value={
                  sortBy === 'createdAt' && order === 'desc' ? 'ne' :
                  sortBy === 'createdAt' && order === 'asc' ? 'od' :
                  sortBy === 'companyName' && order === 'asc' ? 'az' :
                  sortBy === 'companyName' && order === 'desc' ? 'za' :
                  'df'
                }
              >
                <option value="df">Default</option>
                <option value="ne">Newest</option>
                <option value="od">Oldest</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>

          <div className="row align-items-center mb-4">
            <div className="mb-3 mb-lg-0">
              <h6 className="fs-16 mb-0">
                Showing {companies.length > 0 ? ((pagination.currentPage - 1) * pagination.limit + 1) : 0} – {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} results
              </h6>
            </div>
          </div>

          {/* Company Cards */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : companies.length > 0 ? (
            <div className="row">
              {companies.map((company) => (
                <div key={company._id} className="col-lg-4 col-md-6">
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <h5 className="text-muted">No companies found</h5>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </section>
    </>
  );
}
