import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpertCard from './ExpertCard';

const ExpertsPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'rating', 'reviews', 'name'
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const API_URL = 'https://studypage-76hu.onrender.com';
  const EXPERTS_PER_PAGE = 12;
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchAllExperts = useCallback(async (useCache = true) => {
    setError(null);
    
    // Try to load from cache first if allowed
    if (useCache) {
      try {
        const cached = localStorage.getItem("experts");
        const cacheTimestamp = localStorage.getItem("experts_timestamp");
        
        if (cached && cacheTimestamp) {
          const cacheAge = Date.now() - parseInt(cacheTimestamp);
          const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
          
          if (cacheAge < CACHE_EXPIRY) {
            const parsedExperts = JSON.parse(cached);
            if (Array.isArray(parsedExperts) && parsedExperts.length > 0) {
              setExperts(parsedExperts);
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        // Clear corrupted cache
        localStorage.removeItem("experts");
        localStorage.removeItem("experts_timestamp");
      }
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/experts`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch experts: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (!data.experts || data.experts.length === 0) {
        setExperts([]);
        setLoading(false);
        return;
      }
  
      setExperts(data.experts);
  
      // Store in cache with timestamp
      try {
        localStorage.setItem("experts", JSON.stringify(data.experts));
        localStorage.setItem("experts_timestamp", Date.now().toString());
      } catch (storageError) {
        // Handle quota exceeded or other storage errors
        console.warn("Could not cache experts:", storageError);
      }
    } catch (error) {
      setError(error.message || "Failed to load experts. Please try again.");
      
      // Try to use stale cache if available
      try {
        const stale = localStorage.getItem("experts");
        if (stale) {
          const parsed = JSON.parse(stale);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setExperts(parsed);
          }
        }
      } catch (e) {
        // Ignore cache errors
      }
      } finally {
        setLoading(false);
      }
  }, [API_URL]);

  useEffect(() => {
    fetchAllExperts();
  }, [fetchAllExperts]);

  // Memoized filtered and sorted experts
  const filteredAndSortedExperts = useMemo(() => {
    let filtered = experts;
    
    // Apply search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = experts.filter(expert => {
        if (!expert) return false; // Safety check
        
        // Search in name
        if (expert.name?.toLowerCase().includes(searchLower)) return true;
        
        // Search in title
        if (expert.title?.toLowerCase().includes(searchLower)) return true;
        
        // Search in expertise
        if (expert.expertise?.toLowerCase().includes(searchLower)) return true;
        
        // Search in subjects (array) - API returns array of strings
        if (Array.isArray(expert.subjects)) {
          if (expert.subjects.some(subject => {
            if (typeof subject === 'string') {
              return subject.toLowerCase().includes(searchLower);
            }
            // Handle object with name property (if any)
            return subject?.name?.toLowerCase().includes(searchLower);
          })) return true;
        }
        
        // Search in single subject (backwards compatibility)
        if (typeof expert.subject === 'string' && expert.subject.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in project types (array) - API returns array of strings
        if (Array.isArray(expert.projectTypes)) {
          if (expert.projectTypes.some(type => {
            if (typeof type === 'string') {
              return type.toLowerCase().includes(searchLower);
            }
            // Handle object with name property (if any)
            return type?.name?.toLowerCase().includes(searchLower);
          })) return true;
        }
        
        // Search in description
        if (expert.description?.toLowerCase().includes(searchLower)) return true;
        
        return false;
      });
    }
    
    // Apply sorting
    if (sortBy === 'rating') {
      filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'reviews') {
      filtered = [...filtered].sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0));
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    
    return filtered;
  }, [experts, debouncedSearchTerm, sortBy]);

  // Paginated experts
  const paginatedExperts = useMemo(() => {
    const startIndex = (currentPage - 1) * EXPERTS_PER_PAGE;
    return filteredAndSortedExperts.slice(startIndex, startIndex + EXPERTS_PER_PAGE);
  }, [filteredAndSortedExperts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedExperts.length / EXPERTS_PER_PAGE);


  // Remove full-screen loader - show skeleton instead
  // if (loading && experts.length === 0) {
  //   return (
  //     <div className="flex flex-col justify-center items-center h-screen bg-slate-200">
  //       <ClipLoader size={60} color={'#4A90E2'} />
  //       <p className="mt-4 text-gray-600">Loading experts...</p>
  //     </div>
  //   );
  // }
  
  return (
    <div className="sm:p-0 sm:bg-slate-200 sm:min-h-screen flex flex-col h-screen sm:block">
      {/* Header Section - Static on all screen sizes */}
      <div className="flex-none sm:flex-auto bg-slate-200">
        <div className="relative h-64 sm:h-[400px] mb-4 bg-cover bg-center" 
          style={{ backgroundImage: "url(https://img.freepik.com/free-photo/young-teenage-girl-sitting-her-bed-studying-using-laptop_1157-51884.jpg)" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center p-8">
            <h1 className="text-2xl sm:text-4xl text-white font-bold mb-4">
              Our Expert Network
            </h1>
            <p className="text-sm sm:text-lg text-white max-w-xl mx-auto mb-6">
              Connect with top-rated experts from various institutions offering their expertise as freelance professionals.
            </p>
            
            {/* Search Box */}
            <div className="max-w-md mx-auto relative">
              <input
                type="text"
                placeholder="Search by name or subject..."
                className="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between px-4 sm:px-6 mb-2 gap-3">
          <h2 className="text-base sm:text-lg font-medium text-gray-700 whitespace-nowrap">
            {loading && experts.length === 0 ? (
              <span className="font-semibold text-gray-900">Loading experts...</span>
            ) : (
              <>
                <span className="font-semibold text-gray-900">{filteredAndSortedExperts.length}</span> Expert{filteredAndSortedExperts.length !== 1 ? 's' : ''} Available
              </>
            )}
          </h2>
          
          {/* Sort and Filter Controls */}
          <div className="flex items-center">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="default">Default</option>
              <option value="rating">Rating ↑</option>
              <option value="reviews">Reviews ↑</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mx-4 sm:mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">
              {error}
              <button 
                onClick={() => fetchAllExperts(false)}
                className="ml-2 text-red-900 underline font-medium"
              >
                Try again
              </button>
            </p>
          </div>
        )}
        
        {/* Debug info - remove in production */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mx-4 sm:mx-6 mb-4 p-2 bg-gray-100 text-xs text-gray-600 rounded">
            Debug: {experts.length} total experts, {filteredAndSortedExperts.length} filtered, 
            search: "{debouncedSearchTerm || '(none)'}", sort: {sortBy}
          </div>
        )} */}
      </div>
      
      {/* Experts Section - Scrollable on mobile, normal on desktop */}
      <div className="flex-grow overflow-y-auto bg-slate-200 sm:overflow-visible sm:flex-none">
        {loading && experts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {[...Array(EXPERTS_PER_PAGE)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
                <div className="h-48 md:h-52 bg-gray-300"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedExperts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {paginatedExperts.map((expert) => (
                <ExpertCard 
                  key={expert.id} 
                  expert={expert} 
                  onHire={() => navigate('/userprofile/hireexpert', { state: { expertId: expert.id } })} 
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pb-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No experts found</h3>
              <p className="text-gray-600 mb-4">
                {debouncedSearchTerm 
                  ? `No experts match "${debouncedSearchTerm}". Try different keywords or clear your search.`
                  : "No experts available at the moment. Please check back later."
                }
              </p>
              {debouncedSearchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertsPage;