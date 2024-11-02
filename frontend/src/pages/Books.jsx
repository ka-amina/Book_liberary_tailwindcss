import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import BookCard from "./bookCard.jsx";
import "./Books.css";
import axios from "axios";

import Pagination from "../utils/pagination";
import Navbar from "../utils/navbar.jsx";

const Cache = "books_cache";
const Cache_exp = 10000; // 30 seconds

const Books = () => {
  const [books, setBooks] = useState([]);

  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? JSON.parse(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      // Check if cached data exists for the current page
      const cacheKey = `${Cache}_${page}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const {
          data,
          timestamp,
          totalPages: cachedTotalPages,
        } = JSON.parse(cachedData);
        // Use cached data if it's not expired
        if (Date.now() - timestamp < Cache_exp) {
          setBooks(data);
          setTotalPages(cachedTotalPages); // Set total pages from cache
          return;
        }
      }
      // Fetch data from the API if no cached data or expired
      try {
        const res = await axios.get(
          `http://localhost:1010/books?page=${page}&pageSize=8`
        );
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages);
        // Cache the fetched data with timestamp and total pages
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: res.data.books,
            timestamp: Date.now(),
            totalPages: res.data.totalPages,
          })
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchBooks();
  }, [page, location.key]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure that you want to delete this book?")) {
      try {
        console.log(`Deleting book with ID: ${id}`);
        await axios.delete(`http://localhost:1010/books/Del/${id}`, {
          timeout: 1000,
        }); // Increase timeout to 10 seconds
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);

        localStorage.removeItem(`${Cache}_${page}`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err) {
        console.error("Error deleting book:", err);
      }
    }
  };

  const isUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const DragBook = useRef();
  const DragOverBook = useRef(0);

  const handlesort = async () => {
    const booksort = [...books];
    const temp = booksort[DragBook.current];
    booksort[DragBook.current] = booksort[DragOverBook.current];
    booksort[DragOverBook.current] = temp;
    setBooks(booksort);

    // Send the new order to the backend
    try {
      await axios.post(`http://localhost:1010/books/reorder?page=${page}`, {
        books: booksort,
      });
      // Cache the updated books list
      localStorage.setItem(
        `${Cache}_${page}`,
        JSON.stringify({
          data: booksort,
          timestamp: Date.now(),
          totalPages: totalPages,
        })
      );
    } catch (err) {
      console.error("Error reordering books:", err);
    }
  };

  // Function to handle page change and save current page to local storage
  const handlePageChange = (newPage) => {
    setPage(newPage);
    localStorage.setItem("currentPage", JSON.stringify(newPage));
  };

  // Function to handle link click and save current page to session storage
  const handleLinkClick = () => {
    localStorage.setItem("currentPage", JSON.stringify(page));
  };

  return (
    <>
      <Navbar setBooks={setBooks} setTotalPages={setTotalPages} />

      <div className="flex justify-center ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 gap-x-8 m-10  ">
          {books.map((book, index) => (
            <div
              className="book"
              key={book.id}
              draggable
              onDragStart={() => (DragBook.current = index)}
              onDragEnter={() => (DragOverBook.current = index)}
              onDragEnd={handlesort}
              onDragOver={(e) => e.preventDefault}
            >
              <BookCard
                book={book}
                index={index}
                DragBook={DragBook}
                DragOverBook={DragOverBook}
                handlesort={handlesort}
                isUrl={isUrl}
                handleLinkClick={handleLinkClick}
                handleDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center  ">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange} //setPage}
        />
      </div>

      <footer className="bg-slate-100 rounded-lg shadow m-4 dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
              <a href="/" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Books;
