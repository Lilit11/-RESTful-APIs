const express = require('express')
const app = express()
const body_parser = require('body-parser')
const fs = require('fs')

app.use(body_parser.json())

const {
    handleAuthorValidation,
    authorIdGen,
    readAuthorsFromFile,
    handleAuthorIdValidation,
    handleBookValidation,
    bookIdGen
} = require('./methods.js')

//CRUD Operations for Authors:
app.post('/authors', (req, res) => {

    handleAuthorValidation(req, res)

    const { name, bio } = req.body
    const authorId = authorIdGen()
    const books = []

    let author = { name, bio, authorId, books }

    let updated = readAuthorsFromFile()
    updated.push(author)
    fs.writeFileSync('authors.json', JSON.stringify(updated))
    res.status(200).send(author)

})

app.get('/authors', (req, res) => {

    try {
        res.status(200).send(readAuthorsFromFile())
    } catch (err) {
        res.status(500).send('something went wrong')
    }

})

//List Books by Author
app.get('/authors/:authorId/books',(req,res)=>{
    let result = handleAuthorIdValidation(req, res)
    let found = readAuthorsFromFile().find(e => e.authorId == req.params.authorId)
    res.status(200).send(found.books)
})
app.get('/authors/:authorId', (req, res) => {
    let result = handleAuthorIdValidation(req, res)
    res.status(200).send(result)
})

app.put('/authors/:authorId', (req, res) => {
    handleAuthorValidation(req, res)
    let result = handleAuthorIdValidation(req, res)
    let updatedList = readAuthorsFromFile().filter(elm => elm.authorId != result.authorId)

    const { name, bio } = req.body
    const books = [];
    let authorId = req.params.authorId;
    const newAuthor = { name, bio, books, authorId }


    updatedList.push(newAuthor)
    fs.writeFileSync('authors.json', JSON.stringify(updatedList))
    res.status(200).send(newAuthor)
})

app.delete('/authors/:authorId', (req, res) => {
    let result = handleAuthorIdValidation(req, res)
    let updatedList = readAuthorsFromFile().filter(elm => elm.authorId != result.authorId)
    fs.writeFileSync('authors.json', JSON.stringify(updatedList))
    res.status(200).send("Author Successfully deleted")
})


//CRUD Operations for Books:


//search functionality
app.get('/books/search', (req, res) => {

    const booksList = readAuthorsFromFile().map(elm => elm.books).flat()

    const query = req.query.query

    const byGenre = booksList.filter(book => book.genre == query || book.genre.startsWith(query))
    const byAuthor = booksList.filter(book => book.authorId == query || book.authorId.startsWith(query))
    const byTitle = booksList.filter(book => book.title == query || book.title.startsWith(query))

    const toBeShown = [...byGenre, ...byAuthor, ...byTitle]
    if (toBeShown) {
        res.status(200).send(toBeShown)
    } else {
        res.status(400).send("Please provide valid keyword")
    }

})
app.post('/books', (req, res) => {

    handleBookValidation(req, res)

    let book = {
        title: req.body.title,
        genre: req.body.genre,
        authorId: req.body.authorId,
        bookId: bookIdGen()
    }
    let author = readAuthorsFromFile().find(e => book.authorId == e.authorId)

    if (!author) {
        return res.status(400).send("not valid author ID")
    }

    let updated = readAuthorsFromFile()
    updated.map(elm => {
        if (elm.authorId == book.authorId) {
            elm.books.push(book)
        }
    })

    fs.writeFileSync('authors.json', JSON.stringify(updated))
    res.status(200).send(book)
})

app.get('/books', (req, res) => {
    const booksList = readAuthorsFromFile().map(elm => elm.books).flat()
    res.status(200).send(booksList)
})

app.get('/books/:bookId', (req, res) => {
    const booksList = readAuthorsFromFile().map(elm => elm.books).flat()
    let found = booksList.find(e => e.bookId == req.params.bookId)

    if (found) {
        res.status(200).send(found)
    } else {
        res.status(400).send("not valid book ID")
    }

})

app.put('/books/:bookId', (req, res) => {
    let updated = readAuthorsFromFile()

    const booksList = updated.map(elm => elm.books).flat()
    let found = booksList.find(e => e.bookId == req.params.bookId)
    let author = updated.find(e => e.authorId == found.authorId)

    if (!found) {
        return res.status(400).send("not valid book ID")
    }

    found.title = req.body.title
    found.genre = req.body.genre
    found.authorId = req.body.authorId


    if (!author) {
        return res.status(400).send("not valid author ID")
    }

    fs.writeFileSync('authors.json', JSON.stringify(updated))
    res.status(200).send(found)
})
app.delete('/books/:bookId', (req, res) => {


    let updated = readAuthorsFromFile()
    let booksList = updated.map(elm => elm.books).flat()

    let found = booksList.find(elm => elm.bookId == req.params.bookId)

    if (!found) {
        return res.status(400).send("not valid book ID")
    }
    let author = updated.find(elm => elm.authorId == found.authorId)
    let foundIndex = author.books.findIndex(com => com.bookId == req.params.bookId)
    if (foundIndex < 0) {
        return res.status(400).send("not valid book ID")
    }
    author.books.splice(foundIndex, 1)
    fs.writeFileSync('authors.json', JSON.stringify(updated))
    res.status(200).send(" Book Successfully deleted")

})

app.listen(3000)