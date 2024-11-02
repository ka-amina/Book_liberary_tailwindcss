import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import isUrl from '../utils/isUrl'
import Navbar from '../utils/V-a-u-Navbar';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    Book_Id: "",
    Title: "",
    cover: "" ,
    Description: "",
    Author: "",
    Category: "",
    Publication_date: "",
    Price: "",
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:1010/book/${id}`);
        // Format the Publication_date before setting it in the state
        const formattedBook = {
          ...response.data,
          Publication_date: formatDate(response.data.Publication_date)
        };
        setBook(formattedBook);
        localStorage.setItem(`book_${id}`, JSON.stringify(formattedBook));
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    }
    fetchBook();
  }, [id]);
  
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === 'Price') {
    if (value.includes(',')) {
      setErrors((prev) => ({ ...prev, Price: 'Price must not contain commas' }));
    } else if (isNaN(value)) {
      setErrors((prev) => ({ ...prev, Price: 'Price must be a valid number example:"12"or "12.8" dont use comma","' }));
    } else if (parseFloat(value) < 0) {
      setErrors((prev) => ({ ...prev, Price: 'Price cannot be negative' }));
    } else {
      setBook((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, Price: '' }));
    }
  } else {
    setBook((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }
 };
 const validate = () => {
  let tempErrors = {};
  if (!book.Book_Id) tempErrors.Book_Id = "ID of Book can't be empty";
  if (!book.Title) tempErrors.Title = "Title can't be empty";
  if (!book.cover) tempErrors.cover = "Cover image is required";
  if (!book.Description) tempErrors.Description = "Description can't be empty";
  if (!book.Author) tempErrors.Author = "Author can't be empty";
  if (!book.Category) tempErrors.Category = "Category can't be empty";
  if (!book.Publication_date) tempErrors.Publication_date = "Publication date can't be empty";
  if (!book.Price && book.Price !== 0) {
    tempErrors.Price = "Price must be a valid number example:'12'or '12.8' dont use comma','";
  } else if (parseFloat(book.Price) < 0) {
    tempErrors.Price = "Price cannot be negative";
  } else if (isNaN(book.Price)) {
    tempErrors.Price = "Price must be a valid number example:'12'or '12.8' dont use comma','";
  }
  return tempErrors;
 };
 const handleFileChange = (e) => {
  const file = e.target.files[0];
  
  // Clear previous image preview
  setPreview(null);

  // Display the selected image preview
  const reader = new FileReader();
  reader.onload = () => {
    setPreview(reader.result);
  };
  reader.readAsDataURL(file);

  // Update the book cover
  setBook((prev) => ({ ...prev, cover: file }));
};


     const handleClick = async (e) => {
      e.preventDefault();
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

  try {
      console.log(book)
      const formData = new FormData();
      formData.append('Book_Id', book.Book_Id);
      formData.append('file', book.cover);
      formData.append('Title', book.Title);
      formData.append('Description', book.Description);
      formData.append('Author', book.Author);
      formData.append('Category', book.Category);
      formData.append('Publication_date', book.Publication_date);
      formData.append('Price', book.Price);
      
      await axios.patch(`http://localhost:1010/books/Update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
      }});
      // Update local storage
      const updatedBook = { ...book, cover: book.cover.name ? book.cover.name : book.cover };
      localStorage.setItem(`book_${id}`, JSON.stringify(updatedBook));

      // Fetch updated books list and cache it
      const res = await axios.get(`http://localhost:1010/books?page=1&pageSize=10`);
      localStorage.setItem(
        `books_cache_1`,
        JSON.stringify({ data: res.data.books, timestamp: Date.now(), totalPages: res.data.totalPages })
      );
      navigate(`/View/${id}`);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  const labels = [
    "Anthropology", "Art", "Biography", "Business", "Children's Books",
    "Comics", "Cooking", "Crafts", "Diaries", "Economics", "Education",
    "Engineering", "Essays", "Fantasy", "Fiction", "Film", "Graphic Novels",
    "Guides", "Health", "History", "Hobbies", "Humor", "Journals", "Law",
    "Mathematics", "Memoir", "Music", "Mystery", "Non-Fiction", "Performing Arts",
    "Philosophy", "Photography", "Poetry", "Psychology", "Religion", "Romance",
    "Science", "Science Fiction", "Self-Help", "Sports", "Technology", "True Crime",
    "Young Adult"
  ];
  
  const options = labels.map((label, index) => ({ label, value: index + 1 }));
  
  return (

<>
<Navbar /> {/* Navbar at the top */}
<div className="max-w-md mx-auto p-6 text-center mt-6">
  <h1 className="text-2xl font-bold mb-4"> Edit The Book</h1>

  <div className="font-bold mb-2 ">Cover:</div>
  <div className="flex justify-center items-center mb-4">
  {preview ? (
    <img
      src={preview}
      alt="Preview"
      className="max-w-full max-h-52 mb-4"
    />
  ) : (
    book.cover && (
      <img
        src={isUrl(book.cover) ? book.cover : `http://localhost:1010/images/${book.cover}`}
        alt={book.Title}
        className="max-w-full max-h-52 mb-4 "
      />
    )
  )}
  </div>

  <div className="mb-0.5">
    <input
      type="file"
      onChange={handleFileChange}
      accept="image/*"
      className={`block w-full text-sm text-gray-500 border ${errors.Cover ? 'border-red-500' : 'border-gray-300'} rounded-lg py-2 px-3 bg-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:text-neutral-500 dark:bg-gray-700 dark:border-gray-600 dark:file:bg-blue-500 dark:hover:file:bg-blue-400`}
    />
  </div>
  {errors.cover && <div className="text-red-500">{errors.cover}</div>}

  <div className="font-bold mb-0.5">Id:</div>
  <input
    type="text"
    placeholder="Id"
    value={book.Book_Id || ""}
    onChange={handleChange}
    name="Book_Id"
    className={`peer w-full h-full bg-transparent text-gray-700 outline-none focus:outline-none disabled:bg-gray-50 transition-all placeholder-shown:border placeholder-shown:border-gray-200 border ${errors.Book_Id ? 'border-red-500' : 'border-gray-200'} focus:border-2 focus:border-blue-500  text-sm px-3 py-2.5 rounded-lg`}
  />
   {errors.Book_Id && <div className="mt-2 text-sm text-red-600"><span className="font-medium">Oops!</span> {errors.Book_Id}</div>}

  <div className="font-bold mb-0.5">Title:</div>
  <input
    type="text"
    placeholder="Title"
    value={book.Title || ""}
    onChange={handleChange}
    name="Title"
    className={`peer w-full h-full bg-transparent text-gray-700 outline-none focus:outline-none disabled:bg-gray-50 transition-all placeholder-shown:border placeholder-shown:border-gray-200 border ${errors.Title ? 'border-red-500' : 'border-gray-300'} focus:border-2 focus:border-blue-500 text-sm px-3 py-2.5 rounded-lg`}
  />
  {errors.Title && <div className="mt-2 text-sm text-red-600"><span className="font-medium">Oops!</span> {errors.Title}</div>}

  <div className="font-bold mb-0.5">Description:</div>
  <textarea
    rows="2"
    placeholder="Description"
    value={book.Description || ""}
    onChange={handleChange}
    name="Description"
    className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border ${errors.Description ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
  />
    {errors.Description && <div className="mt-2 text-sm text-red-600"><span className="font-medium">Oops!</span> {errors.Description}</div>}

  <div className="font-bold mb-0.5">Author:</div>
  <input
    type="text"
    placeholder="Author"
    value={book.Author || ""}
    onChange={handleChange}
    name="Author"
    className={`peer w-full h-full bg-transparent text-gray-700 outline-none focus:outline-none disabled:bg-gray-50 transition-all placeholder-shown:border placeholder-shown:border-gray-200 border ${errors.Author ? 'border-red-500' : 'border-gray-200'} focus:border-2 focus:border-blue-500  text-sm px-3 py-2.5 rounded-lg`}
  />
 {errors.Author && <div className="mt-2 text-sm text-red-600"><span className="font-medium">Oops!</span> {errors.Author}</div>}

  <div className="font-bold mb-o.5">Category:</div>
  <select
    onChange={handleChange}
    name="Category"
    className={`bg-gray-50 border ${errors.Category ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
  >
    <option value="">{book.Category}</option>
    {options.map(option => (
      <option key={option.value} value={option.label}>{option.label}</option>
    ))}
  </select>
  {errors.Category && <div className="mt-2 text-sm text-red-600"><span className="font-medium">Oops!</span> {errors.Category}</div>}

  <div className="font-bold mb-0.5">Publication Date:</div>
  <input
    type="date"
    value={book.Publication_date || ""}
    onChange={handleChange}
    name="Publication_date"
    pattern="\d{4}-\d{2}-\d{2}"
    placeholder="yyyy-mm-dd"
    className={`peer w-full h-full bg-transparent text-gray-700 outline-none focus:outline-none disabled:bg-gray-50 transition-all placeholder-shown:border placeholder-shown:border-gray-200 border ${errors.Publication_date ? 'border-red-500' : 'border-gray-200'} focus:border-2 focus:border-blue-500  text-sm px-3 py-2.5 rounded-lg`}
  />
    {errors.Publication_date && <div className="mt-2 text-sm text-red-600"><span className="font-medium">Oops!</span> {errors.Publication_date}</div>}

  <div className="font-bold mb-0.5">Price:</div>
  <input
    type="number"
    placeholder="Price"
    value={book.Price || ""}
    onChange={handleChange}
    name="Price"
    className={`peer w-full h-full bg-transparent text-gray-700 outline-none focus:outline-none disabled:bg-gray-50 transition-all placeholder-shown:border placeholder-shown:border-gray-200 border ${errors.Price ? 'border-red-500' : 'border-gray-200'} focus:border-2 focus:border-blue-500  text-sm px-3 py-2.5 rounded-lg`}
  />
  {errors.Price && <div className="mt-2 text-sm text-red-600"><span className="font-medium">Oops!</span> {errors.Price}</div>}

  <button
    className=" mt-3 w-full py-2.5  bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors "
    onClick={handleClick}
  >
    Save
  </button>
</div>
</>
  );
};

export default Update;