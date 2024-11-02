import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

    const navigate = useNavigate();

  const handleIconClick = () => {
    navigate('/'); 
  };
  return (
    <nav className="bg-slate-100 p-1 sticky top-0 z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <div className="text-white text-lg font-bold">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="size-6 cursor-pointer"
            onClick={handleIconClick}
          >
           <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
       </svg>
        </div>
        <div className="space-x-4">
          {/* Empty navbar */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


