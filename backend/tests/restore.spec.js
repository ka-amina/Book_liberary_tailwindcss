const {test , expect} = require ("@playwright/test")

test.describe('API for /books/restore/:id - should restore deleted book', () => {
    test('PATCH /boks/restore/:id - should restore deleted book', async ({ request }) => {
        const id = 100
        const response = await request.patch(`http://localhost:1010/books/restore/${id}`, {
            data: {} 
        });
        
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('id', id);
        expect(responseBody).toHaveProperty('Book_Id', '1224');
        expect(responseBody).toHaveProperty('Title', 'THE');
        expect(responseBody).toHaveProperty('Description', 'amina');
        expect(responseBody).toHaveProperty('Author', 'amina');
        expect(responseBody).toHaveProperty('Price', 122);
        expect(responseBody).toHaveProperty('Category', 'Diaries');
        expect(responseBody).toHaveProperty('Publication_date', '2001-12-12');
        expect(responseBody).toHaveProperty('cover', '1716693690026_1.png');
        expect(responseBody).toHaveProperty('isDeleted', false);
        expect(responseBody.deletedAt).toBeNull();
        
        
    })
})