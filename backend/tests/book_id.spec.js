const { test, expect} = require ('@playwright/test')

test.describe('API tests for /book/:id', () => {
    test('GET /book/:id - should return book with matching id', async({page}) => {
    console.log('running test: get /book/:id - shold return book eith matching id  ')
    const id = 45;
    const response = await page.goto(`http://localhost:1010/book/${id}`)
    expect(response.status()).toBe(200);

    const book = await response.json();
    console.log('response from http://localhost:1010/book/:id', book)
    // expect(book.length).toBeGreaterThan(0);
    
     expect(book).toHaveProperty('id');
     expect(book.id).toBe(id)
     expect(book).toHaveProperty('Book_Id');
     expect(book).toHaveProperty('Title');
     expect(book).toHaveProperty('Author');
     expect(book).toHaveProperty('Category');
     expect(book).toHaveProperty('Description');
     expect(book).toHaveProperty('Price');
     expect(book).toHaveProperty('Publication_date');
     expect(book).toHaveProperty('cover');
     expect(book).toHaveProperty('isDeleted');
     expect(book).toHaveProperty('deletedAt');
    })
    test('Get /book/:id - should return null when id not found ', async ({page}) => {
        const id = 1000;
        const response =await page.request.get(`http://localhost:1010/book/${id}`);
        expect(response.status()).toBe(200);

    })
})