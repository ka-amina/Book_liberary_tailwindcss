const { test, expect } = require("@playwright/test");

test.describe("API test for /book/Del/:id", () => {
  test("DELETE /books/Del/:id - should delete the book with matching id", async ({ page }) => {
    console.log("response from /books/Del/:id - should delete book with matching id ");
    const id = 67;
    
    // Send a real request to the server to delete the book
    const response = await fetch(`http://localhost:1010/books/Del/${id}`, {
      method: "DELETE"
    });
    const responseData = await response.json();

    // Verify response status and content
    expect(response.status).toBe(200);
    expect(responseData.message).toBe("Book deleted successfully");
  });


//   test("DELETE /books/Del/:id - should get an error when the id not found", async ({ page }) => {
//     console.log("response from /books/Del/:id - should get an error when the id not found");
//     const id = 100;

    
//     // Send a real request to the server to delete the book
//     const response = await fetch(`http://localhost:1010/books/Del/${id}`, {
//       method: "DELETE"
//     });
//     expect(response.status).toBe(500);
//     // Verify response status and content
//     const responseBody = await response.json();
//     expect(responseBody.error).toBe("Internal Server Error");
//   });
});
