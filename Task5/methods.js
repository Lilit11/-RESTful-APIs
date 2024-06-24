const fs = require('fs')

const handleAuthorValidation = (req, res) => {

    if (!req.body.name || !req.body.bio ) {
        return res.status(400).send("Please Provide full information")
    }

}

const authorIdGen = () => {
    const authors= fs.readFileSync("authors.json")
    const result = JSON.parse(authors)

    return result.length > 0 ? Math.max(...result.map(e => e.authorId)) + 1 : 0
}

const readAuthorsFromFile = () => {

    const authors = fs.readFileSync('authors.json')
    const result = JSON.parse(authors)
    return result
}
const handleAuthorIdValidation = (req, res) => {

    let flag = readAuthorsFromFile().find(elm => elm.authorId == req.params.authorId)


    if (!flag) {
        res.status(401).send('not valid ID')
    } else {
        return flag
    }
}
const handleBookValidation = (req, res) => {

    if (!req.body.title || !req.body.genre || !req.body.authorId) {
        return res.status(400).send("Please Provide full information")
    }

}

const bookIdGen = () => {

    let updated = readAuthorsFromFile()
    let books = updated.map(elm => elm.books).flat()
    let max = Math.max(...books.map(e => e.bookId))

    return max >= 0 ? max + 1 : 0
}
module.exports ={
handleAuthorValidation,
authorIdGen,
readAuthorsFromFile,
handleAuthorIdValidation,
handleBookValidation,
bookIdGen
}
