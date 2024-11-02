import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Books.css';
import Navbar from '../utils/V-a-u-Navbar';

const DeleteBooks = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                const res = await axios.get('http://localhost:1010/DeletedBooks');
                setBooks(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllBooks();
    }, []);

    const handleRestore = async (id) => {
        try {
            await axios.patch(`http://localhost:1010/books/restore/${id}`);
            setBooks(books.filter((book) => book.id !== id));
            navigate('/');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-24 flex items-center flex-col w-full px-4">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">No</th>
                            <th scope="col" className="px-6 py-3" style={{ width: '30%' }}>Title</th>
                            <th scope="col" className="px-6 py-3">Author</th>
                            <th scope="col" className="px-6 py-3">Date of Delete</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book, index) => (
                            <tr key={book.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 text-center">{index + 1}</td>
                                <td className="px-6 py-4 text-center">{book.Title}</td>
                                <td className="px-6 py-4 text-center">{book.Author}</td>
                                <td className="px-6 py-4 text-center">{book.deletedAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleRestore(book.id)}>Restore</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DeleteBooks;
