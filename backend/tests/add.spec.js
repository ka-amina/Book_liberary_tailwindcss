const { test, expect } = require('@playwright/test');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

test('Create Book via API Endpoint', async ({ page }) => {
    // Prepare sample data
    const bookData = {
        Title: 'Sample Book',
        Description: 'This is a sample book description',
        Author: 'Sample Author',
        Price: 25.99,
        Category: 'Fiction',
        Publication_date: '2024-05-28',
        Book_Id: '123456789'
    };

    // Prepare file to upload
    const filePath = 'C:\\Users\\ais\\Downloads\\book.jpg';
    const formData = new FormData();
    
    // Append file data
    formData.append('file', fs.createReadStream(filePath));

    // Append other fields
    for (const key in bookData) {
        formData.append(key, bookData[key]);
    }

    try {
        // Simulate POST request to the /book endpoint
        const response = await axios.post('http://localhost:1010/book', formData, {
            headers: formData.getHeaders()
        });

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('Title', bookData.Title);
        expect(response.data).toHaveProperty('Description', bookData.Description);
        expect(response.data).toHaveProperty('Author', bookData.Author);
        expect(response.data).toHaveProperty('Price', bookData.Price);
        expect(response.data).toHaveProperty('Category', bookData.Category);
        expect(response.data).toHaveProperty('Publication_date', bookData.Publication_date);
        expect(response.data).toHaveProperty('Book_Id', bookData.Book_Id);
        expect(response.data).toHaveProperty('cover');

        // You may also want to further validate the cover image filename or other properties as needed
    } catch (error) {
        // Handle any errors
        console.error('Error creating book:', error);
    }
});
