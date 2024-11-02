const {test, expect} = require ('@playwright/test')

test.describe(' API  tests for /DEletedBooks',() => {
  test('GET /DeletedBooks - should return all deleted books', async ({ page }) => {
     console.log('Running test: GET /DeletedBooks - should return all deleted books');
     const response = await page.goto('http://localhost:1010/DeletedBooks');
     expect(response.status()).toBe(200);

     const books = await response.json();
     expect(Array.isArray(books)).toBe(true);
     expect(books.length).toBeGreaterThan(0);
     books.forEach((book) => {
      expect(book).toHaveProperty('id');
      expect(book).toHaveProperty('Book_Id');
      expect(book).toHaveProperty('Title');
      expect(book).toHaveProperty('Author');
      expect(book).toHaveProperty('Category');
      expect(book).toHaveProperty('Description');
      expect(book).toHaveProperty('Price');
      expect(book).toHaveProperty('Publication_date');
      expect(book).toHaveProperty('cover');
      expect(book).toHaveProperty('isDeleted');
      expect(book.isDeleted).toBe(true);
      expect(book).toHaveProperty('deletedAt');
      expect(new Date(book.deletedAt).toString()).not.toBe('Invalid Date');
      })
    })
  // test('GET /DeletedBooks - should not return undeleted books', async ({page}) => {
  //   console.log('Running test: GET /DeletedBooks - should not return undeleted books');
  //   const response = await page.goto('http://localhost:1010/DeletedBooks');
  //   expect(response.status()).toBe(200);
  //   const books = await response.json();
  //    expect(Array.isArray(books)).toBe(true);
  //    books.forEach((book) => {
  //     expect(book).toHaveProperty('isDeleted');
  //     expect(book.isDeleted).toBe(false);
  //    })
  // })
})



