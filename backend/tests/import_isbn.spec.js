const {test, expect} = require ('@playwright/test')

test.describe('API tests for /import/:isbn', () => {
     test('GET /import/:isbn - should return book with matching isbn ', async({page}) => {
        console.log('running test: get /import/:isbn - should return book with matching isbn')
        const isbn = '0307474275';

        const BookData = {
            Book_Id: isbn,
            Title: 'The Da Vinci Code',
            Description: '#1 WORLDWIDE BESTSELLER • While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. The elderly curator of the Louvre has been murdered inside the museum, his body covered in baffling symbols. “Blockbuster perfection.... A gleefully erudite suspense novel.” —The New York Times “A pulse-quickening, brain-teasing adventure.” —People As Langdon and gifted French cryptologist Sophie Neveu sort through the bizarre riddles, they are stunned to discover a trail of clues hidden in the works of Leonardo da Vinci—clues visible for all to see and yet ingeniously disguised by the painter. Even more startling, the late curator was involved in the Priory of Sion—a secret society whose members included Sir Isaac Newton, Victor Hugo, and Da Vinci—and he guarded a breathtaking historical secret. Unless Langdon and Neveu can decipher the labyrinthine puzzle—while avoiding the faceless adversary who shadows their every move—the explosive, ancient truth will be lost forever.',
            Author: 'Dan Brown',
            Price: 0,
            Category: 'Fiction',
            Publication_date: '2009-03-31',
            cover: 'http://books.google.com/books/content?id=YuDl2Wl651AC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
            deletedAt: null,
            isDeleted: false,
        }
        page.route('**/import' +isbn, route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Book imported successfully', data:BookData })
            })
        })
        await page.goto(`http://localhost:1010/import/${isbn}`)
        // await page.waitForResponse('**/import/' + isbn)
        const response = await page.evaluate(() => {
            return JSON.parse(document.querySelector('pre').textContent);
        });

        delete response.data.id;
        expect(response.message).toBe('Book imported successfully');
      expect(response.data).toEqual(BookData);
    })
    test('GET /import/:isbn - should return error when the id not found', async ({ page}) => {
        const isbn = '1345768763';
        page.route('**/import/' + isbn, route => {
            route.fulfill({
                status: 404,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Book not found in Google Books' })
            })
        })
        await page.goto(`http://localhost:1010/import/${isbn}`)
        const response = await page.evaluate(() => {
            return JSON.parse(document.querySelector('pre').textContent);
        });
        expect(response.error).toBe('Book not found in Google Books');
    }) 

})