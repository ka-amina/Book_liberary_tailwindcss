const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const axios = require('axios');

const app = express()
const prisma = new PrismaClient()
app.use(bodyParser.json())
app.use (cors())
app.use('/images', express.static('images'));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("destination",file)
        return cb(null, './images');
    },
    filename: (req, file, cb) => {
        console.log("filename", file)
        return  cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({
    storage
})

cron.schedule('0 * * * *', async () => {
    try {
        const threeHoursAgo  = new Date();
        threeHoursAgo .setHours(threeHoursAgo .getHours() - 3);

        // Find books that were soft-deleted more than three hours ago
        const expiredBooks = await prisma.books.findMany({
            where: {
                isDeleted: true,
                deletedAt: {
                    lte: threeHoursAgo
                }
            }
        });

        // Hard delete expired books permanently from the database
        await Promise.all(expiredBooks.map(async (book) => {
            await prisma.books.delete({
                where: {
                    id: book.id
                }
            });
        }));

        console.log('Expired books deleted successfully');
    } catch (error) {
        console.error('Error deleting expired books:', error);
    }
}, {
    scheduled: true,
});
 


app.get('/search/:Title',async (req, res) => {
  const Title = req.params.Title;
  const books = await prisma.books.findMany({
    where: {
        isDeleted: false,
        Title: {
            contains: Title,
            
        }
    }
  }) 
  res.json(books)
})



app.post('/book', upload.single('file'), async (req, res, next) => {
    try {
        console.log('Body:', req.body);
        console.log('File:', req.file);
        const { Title, Description, Author, Price, Category, Publication_date, Book_Id } = req.body;
        const cover = req.file.filename;

        if (Price < 0) {
            return res.status(400).json({ error: 'Price cannot be negative' });
        }

        // Fetch the highest order value
        const maxOrder = await prisma.books.findFirst({
            where: { isDeleted: false },
            orderBy: { order: 'desc' },
            select: { order: true }
        });

        const newOrder = maxOrder ? maxOrder.order + 1 : 1;

        const newBook = await prisma.books.create({
            data: {
                Title, Description, Author, Price: parseFloat(Price), Category, Publication_date, cover, Book_Id, order: newOrder
            }
        });
        res.json(newBook);
    } catch (error) {
        next(error); 
    }
});

app.get('/DeletedBooks', async(req, res) => {
    const books = await prisma.books.findMany({
        where: {
            isDeleted: true
        }
    })
    res.json(books)
})


app.get('/books', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 8;
        const skip = (page - 1) * pageSize;

        const books = await prisma.books.findMany({
            where: { isDeleted: false },
            // orderBy: { order: 'asc' },
            skip: skip,
            take: pageSize,
            orderBy: { id: 'asc' },

        });

        const totalBooks = await prisma.books.count({
            where: { isDeleted: false },
        });

        const totalPages = Math.ceil(totalBooks / pageSize);

        res.status(200).json({ books, totalPages });
    } catch (err) {
        console.error('Error retrieving books:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  

app.get('/book/:id', async(req, res) => {
    const id = req.params.id
    const book = await prisma.books.findUnique({
        where:{
            id : parseInt(id)
        }
    })
    res.json(book)
})
app.patch('/books/Update/:id', upload.single('file'), async(req, res, next ) => {
    console.log(req.file)
  
    const id = req.params.id
    const {Title,Description, Author, Price, Category, Publication_date,Book_Id} = req.body;
    let cover ;
    
    if (req.file) {
        cover = req.file.filename;
    }
    
    if (Price < 0) {
        return res.status(400).json({ error: 'Price cannot be negative' });
    }

    const Book= await prisma.books.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    if (!cover) {
        cover = Book.cover;
    }
    console.log(req.file)
    console.log(req)

    

    const updatedbook = await prisma.books.update({
      where:{
         id : parseInt(id)
        },
      data:{
         Title,Description,Author,Price: parseFloat(Price),Category,Publication_date, cover,Book_Id
        }
    })
  return res.send(updatedbook)
})

app.patch('/books/restore/:id', async(req, res ) => {
  
    const id = req.params.id
    const updatedbook = await prisma.books.update({
      where:{
         id : parseInt(id)
        },
      data:{
        isDeleted: false,
        deletedAt: null,
        }
    })
  return res.send(updatedbook)
})

app.delete('/books/Del/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Find the book to delete
        const upbook = await prisma.books.update({
            where: {
                id: parseInt(id)
            },
            data:{
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        // Respond with success message
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/import/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    const apiKey = 'AIzaSyCAuezKzadcTZDxE5Kn9_bvF2QKgAYtiJQ';

    try {
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`;
        const response = await axios.get(apiUrl);
        const bookData = response.data.items ? response.data.items[0].volumeInfo : null;

        if (!bookData) {
            return res.status(404).json({ error: 'Book not found in Google Books' });
        }
        // Construct the cover URL
        const coverUrl = bookData.imageLinks ? bookData.imageLinks.thumbnail : 'No cover available';

        // Construct the book data object
        const newBookData = {
            Title: bookData.title || 'Unknown',
            Description: bookData.description || 'No description available',
            Author: bookData.authors ? bookData.authors.join(', ') : 'Unknown',
            Price: 0, // Assuming no price information, default to 0
            Category: bookData.categories ? bookData.categories.join(', ') : 'Unknown',
            Publication_date: bookData.publishedDate || 'Unknown',
            cover: coverUrl,
            Book_Id: isbn // Using ISBN as Book_Id
        };

        console.log('Book Data:', newBookData);

        const importedBook = await prisma.books.create({ data: newBookData });

        // Query all books ordered by ID in descending order
        const books = await prisma.books.findMany({
            // orderBy: { id: 'desc' }
            orderBy: { order: 'desc' },
            select: { order: true }
        });

        res.json({ message: 'Book imported successfully', data: importedBook });
    } catch (error) {
        console.error('Error importing book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/books/reorder', async (req, res) => {
    const { books } = req.body;

    try {
        books.sort((a, b) => a.id - b.id);
        const updatePromises = books.map(async (book, index) => {
            await prisma.books.update({
                where: { id: book.id },
                data: { order: index },
            });
        });

        await Promise.all(updatePromises);

        res.status(200).json({ message: 'Books reordered successfully' });
    } catch (error) {
        console.error('Error reordering books:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
  
  

app.use((err, req, res, next) => {
    console.error(err.stack)
   res.status(500).send('Something broke!')
  })
  
const server = app.listen(1010, () => {
    console.log('connected')
})

// Error handling for uncaught exceptions
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

module.exports = server; 