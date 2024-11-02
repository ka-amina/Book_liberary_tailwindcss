const { test, expect } = require('@playwright/test');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

test.describe('API test for /book - should create new book', () => {
  test('POST /book - should create new book', async ({ request }) => {
    const filePath = path.resolve('C:\\Users\\ais\\Downloads', 'book.jpg');
    const formData = {
        file: filePath,
        Title: 'Test Book',
        Description: 'This is a test description',
        Author: 'Test Author',
        Price: '10.99',
        Category: 'Test Category',
        Publication_date: '2024-01-01',
        Book_Id: '1234567890'
      };
    
      const response = await request.post('/book', {
        multipart: {
          file: formData.file,
          Title: formData.Title,
          Description: formData.Description,
          Author: formData.Author,
          Price: formData.Price,
          Category: formData.Category,
          Publication_date: formData.Publication_date,
          Book_Id: formData.Book_Id
        }
      });

      if (response.status() !== 200) {
        const responseBody = await response.text();
        console.error('Error response:', responseBody);
      }
      
      expect(response.status()).toBe(200);

  

    // Verify response status
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('Title', 'Test Book');
    expect(responseBody).toHaveProperty('Description', 'This is a test description');
    expect(responseBody).toHaveProperty('Author', 'Test Author');
    expect(responseBody).toHaveProperty('Price', 10.99);
    expect(responseBody).toHaveProperty('Category', 'Test Category');
    expect(responseBody).toHaveProperty('Publication_date', '2024-01-01');
    expect(responseBody).toHaveProperty('cover');
    expect(responseBody).toHaveProperty('Book_Id', '1234567890');
  });
});