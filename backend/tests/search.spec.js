const { test, expect } = require('@playwright/test');


test.describe('API tests for /search/:Title', () => {
  test('GET /search/:Title - should return books with matching title', async ({ page }) => {
      console.log('Running test: GET /search/:Title - should return books with matching title');
      const title = 'The Alchemist';
      const encodedTitle = encodeURIComponent(title);
      const response = await page.goto(`http://localhost:1010/search/${encodedTitle}`);
      expect(response.status()).toBe(200);

      const books = await response.json();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      books.forEach(book => {
        expect(book).toHaveProperty('Title');
        expect(book.Title).toContain(title);
        expect(book).toHaveProperty('id');
        expect(book).toHaveProperty('Book_Id');
        expect(book).toHaveProperty('Title');
        expect(book).toHaveProperty('Author');
        expect(book).toHaveProperty('Category');
        expect(book).toHaveProperty('Description');
        expect(book).toHaveProperty('Price');
        expect(book).toHaveProperty('Publication_date');
        expect(book).toHaveProperty('cover');
        expect(book).toHaveProperty('isDeleted', false);
        expect(book).toHaveProperty('deletedAt', null)
      
      });
  });

  test('GET /search/:Title - should return empty array for no exist book', async ({ page }) => {
    console.log('Running test: GET /search/:Title - should return empty array for no exist book');
    const title = 'jsdaggfdsg';
    const encodedTitle = encodeURIComponent(title);
    const response = await page.goto(`http://localhost:1010/search/${encodedTitle}`);
    expect(response.status()).toBe(200);

    const books = await response.json();
    expect(Array.isArray(books)).toBe(true);
  });
  test('GET /search/:Title -should not   return deleted books', async ({ page })  => {
    console.log('Running test: GET /search/:Title - should not return deleted books', async({ page}) => {
      const title = 'The Great Gatsby'
      const response = await page.goto(`http://localhost:1010/search/${title}`)
     expect(response.status()).toBe(true);
     books.forEach(book => {
      expect(book).toHaveProperty('Title');
      expect(book.Title).toContain(title);
      expect(book).toHaveProperty('isDeleted', false);
  });

    });
  })

});
