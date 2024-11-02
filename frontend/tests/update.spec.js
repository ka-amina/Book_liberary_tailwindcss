const { test, expect } = require('@playwright/test');
const path = require('path');

test('Update Book Page - Input Fields', async ({ page }) => {
    await page.goto('http://localhost:3000');

    await page.waitForSelector('.book');
    await page.click('.book:first-child .update');

    
    await page.waitForSelector('input[name="Title"]');

    await page.fill('input[name="Title"]', 'New Title');
    let updatedTitle = await page.inputValue('input[name="Title"]');
    expect(updatedTitle).toBe('New Title');

    const filePath = "C:\\Users\\ais\\Downloads\\book.jpg"
    await page.setInputFiles('input[type="file"]', filePath)
    
    
    await page.fill('input[name="Author"]', 'New Author');
    let updatedAuthor = await page.inputValue('input[name="Author"]');
    expect(updatedAuthor).toBe('New Author');

    await page.fill('input[name="Description"]', 'New Description');
    let updatedDescription = await page.inputValue('input[name="Description"]');
    expect(updatedDescription).toBe('New Description');

    await page.fill('input[name="Publication_date"]', '2023-05-28');
    let updatedPublicationDate = await page.inputValue('input[name="Publication_date"]');
    expect(updatedPublicationDate).toBe('2023-05-28');

    
    await page.fill('input[name="Price"]', '95');
    let updatedPrice = await page.inputValue('input[name="Price"]');
    expect(updatedPrice).toBe('95');

    
    await page.click('.Save-button');

    
    await page.waitForNavigation();
////in view page 
    // const updatedTitleInView = 'New Title';
    // const updatedAuthorInView = 'New Author';
    // const updatedPriceInView = '50';

    // expect(updatedTitleInView).toBe('New Title');
    // expect(updatedAuthorInView).toBe('New Author');
    // expect(updatedPriceInView).toBe('50');
});
