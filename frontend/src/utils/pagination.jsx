









import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-wrap justify-center items-center bg-white rounded-lg font-sans p-2 mb-10">
      {currentPage > 1 && (
        <button 
          onClick={handlePreviousPage} 
          className="h-10 sm:h-12 border-2 border-blue-500 px-3 sm:px-6 rounded-l-lg hover:bg-blue-500 hover:text-white mr-1 sm:mr-2"
        >
          <h3 className="text-sm sm:text-xl font-medium">Prev</h3>
        </button>
      )}
      
      {getPages().map((page, index) => (
        <button 
          key={index} 
          onClick={() => handlePageClick(page)} 
          className={`text-sm sm:text-lg rounded-full h-10 sm:h-12 border-2 ${index === 0 ? 'border-r-0' : 'border-l-0'} border-blue-500 w-10 sm:w-14 mr-1 sm:mr-2 ${currentPage === page ? 'bg-blue-500 text-white' : 'text-black'}`}
        >
          {page}
        </button>
      ))}
      
      {currentPage < totalPages && (
        <button 
          onClick={handleNextPage} 
          className="h-10 sm:h-12 border-2 border-blue-500 px-3 sm:px-4 rounded-r-lg hover:bg-blue-500 hover:text-white ml-1 sm:ml-2"
        >
          <h3 className="text-sm sm:text-xl font-medium">Next</h3>
        </button>
      )}
    </div>
  );
};

export default Pagination;
