
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = ({ setBooks, setTotalPages, page }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isbn, setIsbn] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const handleSearch = async (e) => {
        const Title = e.target.value;
        setSearchQuery(Title);
        if (Title.trim() === '') {
            try {
                const res = await axios.get(`http://localhost:1010/books?page=1&pageSize=8`);
                setBooks(res.data.books);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                console.error('Error fetching books for current page:', err);
            }
        } else {
            try {
                console.log(`Searching for books with title containing: ${Title}`);
                const res = await axios.get(`http://localhost:1010/search/${Title}`);
                setBooks(res.data);
                setTotalPages(1);
            } catch (err) {
                console.error('Error searching for books:', err);
            }
        }
    };

    const handleIsbnInputChange = (e) => {
        setIsbn(e.target.value);
    };

   

    const handleImportBook = async () => {
        try {
            const res = await axios.get(`http://localhost:1010/import/${isbn}`);
            const importedBook = res.data.data; // Extract imported book from response
    
            // Update the books state by adding the imported book
            setBooks(prevBooks => [...prevBooks, importedBook]);
            setIsbn('');
        } catch (err) {
            console.error(err);
        }
    };
    
    
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-slate-100 p-3 sticky  top-0 z-50 w-full  ">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto">
                <button 
                    onClick={toggleMenu} 
                    type="button" 
                    className="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
                    aria-controls="navbar-hamburger" 
                    aria-expanded={isMenuOpen}
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div ref={menuRef} className={`${isMenuOpen ? 'block' : 'hidden'} w-full sm:w-auto`} id="navbar-hamburger">
                    <ul className="flex flex-col sm:flex-row sm:items-center font-medium mt-4 sm:mt-0 rounded-lg bg-gray-50 sm:bg-transparent dark:bg-gray-800 sm:dark:bg-transparent dark:border-gray-700">
                        <li>
                            <Link to="/DeletedBooks" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                Deleted Books
                            </Link>
                        </li>
                        <li>
                            <Link to="/add" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                Add New book
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col sm:flex-row items-center ml-auto">
                    <input
                        type="text"
                        value={searchQuery}
                        placeholder="Search by title..."
                        className="px-3 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0 sm:mr-2"
                        onChange={handleSearch}
                    />
                    <input
                        type="text"
                        placeholder="Enter ISBN..."
                        value={isbn}
                        onChange={handleIsbnInputChange}
                        className="px-3 py-2 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0 sm:mr-2"
                    />
                    <button onClick={handleImportBook} className="px-3 py-2 rounded-lg hover:bg-blue-500 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        Import
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
