import React, { useState, useRef, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import './Books.css'

const BookCard = ({ book, isUrl, handleLinkClick, handleDelete }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="w-52 bg-slate-50 shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl  ">
      <div className="relative ">
        <img
          src={isUrl(book.cover) ? book.cover : `http://localhost:1010/images/${book.cover}`}
          alt={book.Title}
          className="h-44 w-52 object-contain rounded-full"
        />
         <button
          id="dropdownMenuIconButton"
          data-dropdown-toggle="dropdownDots"
          data-dropdown-placement="bottom-start"
          onClick={toggleDropdown}
          className="absolute top-2 right-2 inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
          type="button"
        >
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
            <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
          </svg>
        </button>
        {isDropdownOpen && (
          <div 
            id="dropdownDots" 
            ref={dropdownRef} 
            className="absolute top-10 right-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
          >
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
              <li>
                <Link
                  to={`/Update/${book.id}`}
                  onClick={handleLinkClick}
                  className="block w-full px-4 py-2 
                  text-center
                  text-base
                  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Edit
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="block w-full px-4 py-2
                   text-red-600 
                   text-base
                   hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <span className="text-gray-400 mr-3 uppercase text-xs">{book.Author}</span>
        <p className="text-lg font-bold text-black truncate block capitalize">{book.Title}</p>
        <p className="text-lg font-semibold text-black cursor-auto my-3">{book.Price}&nbsp; MAD</p>
        <Link to={`/View/${book.id}`} onClick={handleLinkClick}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 w-full">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BookCard;








