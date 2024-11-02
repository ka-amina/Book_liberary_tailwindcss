const { test, expect} = require ("@playwright/test")

test.describe('ISBN',  () => {
    test.beforeEach(async ({page}) => {
        await page.goto("/")
    })
    test("should import a book by ISBN", async({page}) =>{
        const isbn= '0451526341'
        await page.fill('.add-book input', isbn)
        await page.click('.add-book button');
        await page.waitForTimeout(2000)
    })
})