const { test, expect } = require('@playwright/test');

test.describe('search', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/')
    })
    test('sould search a book', async({page}) => {
        await page.fill('.search-bar input', 'To Kill a Mockingbird')
        await page.waitForTimeout(1000)
        const books = await page.$$('.book')
        for (const book of books) {
            const title = await book.$eval('h2', el => el.textContent);
            expect(title).toContain('To Kill a Mockingbird');
        }
    })
    test('sould display no book if i type wrong title or no existen book', async({page}) => {
        await page.fill('.search-bar input', 'To Kil a Mockingbird')
        await page.waitForTimeout(1000)
        const books = await page.$$('.book')
        expect(books.length).toBe(0)
    })
    test('should find books with partial matches', async ({page}) => {
        await page.fill('.search-bar input', 'The');
        await page.waitForTimeout(1000);
        const books = await page.$$('.book');
        for (const book of books) {
            const title = await book.$eval('h2', el => el.textContent);
            expect(title).toMatch(/The/i);
        }
    })
    // test('should handle case-insensitive search', async ({ page }) => {
    //     await page.fill('.search-bar input', 'TO KILL A MOCKINGBIRD');
    //     await page.waitForTimeout(1000);
    //     const books = await page.$$('.book');
    //     for (const book of books) {
    //         const title = await book.$eval('h2', el => el.textContent);
    //         expect(title.toUpperCase()).toContain('To Kill a Mockingbird');
    //     }
    // });
    test('should handle case-insensitive search', async ({ page }) => {
        await page.fill('.search-bar input', 'TO KILL A MOCKINGBiRD');
        await page.waitForTimeout(1000); // wait for the search results to update
        const books = await page.$$('.book');
        let found = false;
        for (const book of books) {
            const title = await book.$eval('h2', el => el.textContent);
            if (title.toUpperCase() === 'TO KILL A MOCKINGBIRD') {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
    });

})