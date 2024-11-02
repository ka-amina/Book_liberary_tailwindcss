const {test , expect} = require ("@playwright/test")

test('should goto the deletedbooks page and restore a book', async({page})=> {
    await page.goto('http://localhost:3000')

    const firstBookTitle = await page.$eval('.book:first-child h2', el => el.textContent.trim());

    await page.click('.DeletedBooks')

    await page.waitForSelector('.styled-table')

    await page.click('.styled-table tbody tr:first-child .delete')

    await page.waitForSelector('.books')

    const restoredBookTitle = await page.$eval('.book:first-child h2', el => el.textContent.trim());
        expect(restoredBookTitle).toBe(firstBookTitle);
})