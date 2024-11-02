const {test, expect} = require ('@playwright/test')

test.describe('API tests for /books', () => {
    test('GET /books - should return all books on my database', async ({ page }) => {
        console.log('Running test: GET /books - should return books with matching title');
        const response = await page.goto(`http://localhost:1010/books`);
        expect(response.status()).toBe(200);
  
        const books = await response.json();
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBeGreaterThan(0);
        expect(Array.isArray(books)).toBe(true);
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
          expect(book.isDeleted).toBe(false);
          expect(book).toHaveProperty('deletedAt');
          expect(book.deletedAt).toBe(null);
        })
    });
})








// app.get('/books', async(req, res) => {
//     const books = await prisma.books.findMany({
//         where: {
//             isDeleted: false
//         }
//     })
//     res.json(books)
// })