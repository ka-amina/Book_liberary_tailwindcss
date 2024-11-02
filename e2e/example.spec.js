// // @ts-check
// const { test, expect } = require('@playwright/test');

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
const { test, expect } = require('@playwright/test');



test.describe('API tests for /search/:Title', () => {
  test('GET /search/:Title - should return books with matching title', async ({ page }) => {
      console.log('Running test: GET /search/:Title - should return books with matching title');
      const title = 'picture';
      const encodedTitle = encodeURIComponent(title);
      const response = await page.goto(`http://localhost:1010/search/${encodedTitle}`);
      expect(response.status()).toBe(200);

      const books = await response.json();
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeGreaterThan(0);
      books.forEach(book => {
          expect(book).toHaveProperty('Title');
          expect(book.Title).toContain(title);
          expect(book).toHaveProperty('isDeleted', false);
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
    expect(books.length).toBe(0);
  });

});
