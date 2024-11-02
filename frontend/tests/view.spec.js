const { test, expect } = require('@playwright/test');

test.describe('View Button', () => {
    test('should navigate to view page when "View" button is clicked', async ({ page }) => {
        await page.goto('http://localhost:3000'); 

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }), // or 'networkidle', 'domcontentloaded'
            page.click('.book:first-child .view')
        ]);

        const url = page.url();
        expect(url).toContain('/View/'); 
    });

    test('should navigate to edit page when "Edit" button is clicked on view page', async ({ page }) => {
        await page.goto('http://localhost:3000'); 

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }), // or 'networkidle', 'domcontentloaded'
            page.click('.book:first-child .view')
        ]);

        const url = page.url();
        expect(url).toContain('/View/');
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            page.click('.Update-button')
        ]);
        const updatePageUrl = page.url();
        expect(updatePageUrl).toContain('/Update/');
    });

    test('should navigate to delete when "delete" button is clicked on view page', async ({ page }) => {
        await page.goto('http://localhost:3000'); 

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }), // or 'networkidle', 'domcontentloaded'
            page.click('.book:first-child .view')
        ]);

        const url = page.url();
        expect(url).toContain('/View/');
        
        page.on('dialog', dialog => dialog.accept());

           // Click the delete button
           await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            page.click('.Delete-button')
        ]);

        const mainPageUrl = page.url();
        expect(mainPageUrl).toBe('http://localhost:3000/');

    });

    test('should navigate back to the main page when "Go Back" button is clicked', async ({ page }) => {
       
        await page.goto('http://localhost:3000'); 
        
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            page.click('.book:first-child .view')
        ]);
        
      
        const viewPageUrl = page.url();
        expect(viewPageUrl).toContain('/View/');
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            page.click('.back-button')
        ]);
        
        const mainPageUrl = page.url();
        expect(mainPageUrl).toBe('http://localhost:3000/');
    });


    
});
