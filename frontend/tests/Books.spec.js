const { test, expect } = require('@playwright/test');

test.describe('Book Deletion', () => {
  test('should delete the book when  searched and deleted', async ({  page }) => {
   await page.goto('http://localhost:3000');

   await page.fill('.search-bar input', 'Animal Farm');

   await page.waitForSelector('.books .book');

   page.on('dialog', dialog => dialog.accept());

   await Promise.all([
        page.waitForNavigation({ waitUntil: 'load' }),
        page.click('.delete')
     ]);

   const mainPageUrl = page.url();
   expect(mainPageUrl).toBe('http://localhost:3000/');
  });
});
