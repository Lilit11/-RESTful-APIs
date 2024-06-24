const fs = require('fs')

const postCounter = () => {
    const posts = fs.readFileSync("posts.json")
    const result = JSON.parse(posts)

    return result.length > 0 ? Math.max(...result.map(post => post.postId)) + 1 : 0
}


const handlePostValidation = (req, res) => {

    if (!req.body.title || !req.body.content || !req.body.author) {
        return res.status(400).send("Please Provide full information")
    }

}
const handlePostIdValidation = (req, res) => {

    let flag = latestPosts().find(elm => elm.postId == req.params.postId)


    if (!flag) {
        res.status(401).send('not valid ID')
    } else {
        return flag
    }
}

const latestPosts = () => {

    const posts = fs.readFileSync('posts.json')
    const latestPosts = JSON.parse(posts)
    return latestPosts
}
const commentsCounter = () => {

    let updated = latestPosts()
    let comments = updated.map(elm => elm.comments).flat()
    let max = Math.max(...comments.map(e => e.comId))

    return max >= 0 ? max + 1 : 0
}


const handleCommentValidation = (req, res) => {

    if (!req.body.details) {
        return res.status(400).send("Please Provide full information")
    }

}
module.exports = {
    postCounter,
    handlePostValidation,
    handlePostIdValidation,
    latestPosts,
    commentsCounter,
    handleCommentValidation
}