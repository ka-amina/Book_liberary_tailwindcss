import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import isUrl from '../utils/isUrl';
import Navbar from '../utils/V-a-u-Navbar';
// import './View.css';

const Cache = 'book_cache';
const Cache_exp = 5000;

const View = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      const cachedData = localStorage.getItem(`${Cache}_${id}`);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < Cache_exp) {
          setBook(data);
          return;
        }
      }
      try {
        const res = await axios.get(`http://localhost:1010/book/${id}`);
        setBook(res.data);
        localStorage.setItem(`${Cache}_${id}`, JSON.stringify({ data: res.data, timestamp: Date.now() }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchBookDetails();
  }, [id]); 

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:1010/books/Del/${id}`);
        localStorage.removeItem(`${Cache}_${id}`);
        navigate('/');
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (!book) {
    return null;
  }

  const formatPublicationDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleUpdateClick = () => {
    navigate(`/Update/${id}`);
  };

  return (
    <>
      <Navbar /> {/* Navbar at the top */}
      
    <div className="container mx-auto mt-14">
      <div className="lg:w-4/5 mx-auto flex flex-wrap bg-white rounded-lg border border-gray-400 p-4 ">
     <div 
      className="lg:w-1/2 w-full h-64 lg:h-auto object-cover bg-contain bg-center bg-no-repeat rounded-lg mb-48" 
      style={{ backgroundImage: `url(${isUrl(book.cover) ? book.cover : `http://localhost:1010/images/${book.cover}`})` }} 
      title={book.Title}
     ></div>
    <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
      <h2 className="text-sm title-font text-gray-500 tracking-widest">{book.Author}</h2>
      <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{book.Title}</h1>
      <div className="flex mb-4">
        
      </div>
      <p className="leading-relaxed mb-4"><strong>Description:</strong> {book.Description}</p>
      <p className="leading-relaxed mb-4"><strong>Price:</strong> {book.Price} MAD</p>
      <p className="leading-relaxed mb-4"><strong>Category:</strong> {book.Category}</p>
      <p className="leading-relaxed mb-4"><strong>Publication Date:</strong> {formatPublicationDate(book.Publication_date)}</p>
      <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
        <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded" onClick={handleUpdateClick}>Edit</button>
        <button className="flex  text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-700 rounded ml-6" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default View;
