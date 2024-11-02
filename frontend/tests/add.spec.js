const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Add New Book', () => {
    test('should add a new book when "Add New Book" button is clicked', async ({ page }) => {
        // Navigate to the books page
        await page.goto('http://localhost:3000');
        // Get the initial number of books
        const initialBookCount = await page.$$eval('.book', books => books.length);

        // Click on the "Add New Book" button
        await page.click('.Add');

        // Wait for the add book page to load
        await page.waitForSelector('.Save-button');

        // Fill in the form data
        await page.fill('input[name="Book_Id"]', '123');
        await page.fill('input[name="Title"]', 'New Book Title');
        // Assuming you have a cover image file in your project directory
        const filePath = "C:\\Users\\ais\\Downloads\\book.jpg"
        await page.setInputFiles('input[type="file"]', filePath);
        await page.fill('input[name="Description"]', 'Description of the new book');
        await page.fill('input[name="Author"]', 'Author of the new book');
        await page.selectOption('select[name="Category"]', { label: 'Fantasy' });
        await page.fill('input[name="Publication_date"]', '2024-05-30');
        await page.fill('input[name="Price"]', '20');

        // Click on the "Save" button
        await page.click('.Save-button');

        // Wait for the book to be added
        await page.waitForTimeout(2000); // Adjust the timeout as needed

        // Navigate back to the books page
        await page.goto('http://localhost:3000/');

        // Get the updated number of books
        const updatedBookCount = await page.$$eval('.book', books => books.length);

        // Check if the number of books has increased by 1
        expect(updatedBookCount).toBe(initialBookCount + 1);
    });
});
