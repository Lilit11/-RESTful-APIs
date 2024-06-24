//Task 3: Blog Posts with Comments and Likes

const express = require('express')
const app = express()
const fs = require('fs')
const body_parser = require('body-parser')
app.use(body_parser.json())

const {
    handlePostValidation,
    handlePostIdValidation,
    postCounter,
    latestPosts,
    commentsCounter,
    handleCommentValidation
} = require('./methods.js')

//CRUD Operations for Blog Posts
app.post('/posts', (req, res) => {

    handlePostValidation(req, res)

    let post = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        postId: postCounter(),
        comments: [],
        likes:0
    }
    let updated = latestPosts()
    updated.push(post)
    fs.writeFileSync('posts.json', JSON.stringify(updated))
    res.status(200).send(post)

})

app.get('/posts', (req, res) => {


  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const  toBeShown = latestPosts().slice(startIndex, endIndex);

    try {
        res.status(200).send(toBeShown)
    } catch (err) {
        res.status(500).send('something went wrong')
    }

})
app.get('/posts/:postId', (req, res) => {
    let result = handlePostIdValidation(req, res)
    res.status(200).send(result)
})

app.put('/posts/:postId', (req, res) => {
    handlePostValidation()
    let result = handlePostIdValidation(req, res)
    let updatedList = latestPosts().filter(elm => elm.postId != result.postId)

    let newPost = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        postId: req.params.postId,
        comments: [],
        likes:0
    }
    updatedList.push(newPost)
    fs.writeFileSync('posts.json', JSON.stringify(updatedList))
    res.status(200).send(newPost)
})

app.delete('/posts/:postId', (req, res) => {
    let result = handlePostIdValidation(req, res)
    let updatedList = latestPosts().filter(elm => elm.postId != result.postId)
    fs.writeFileSync('posts.json', JSON.stringify(updatedList))
    res.status(200).send("Post Successfully deleted")
})


//CRUD Operations for Comments:

app.post('/posts/:postId/comments', (req, res) => {

    let post = handlePostIdValidation(req, res)
    handleCommentValidation(req, res)

    let comment = {
        details: req.body.details,
        comId: commentsCounter()
    }

    let updated = latestPosts()
    updated.map(elm => {
        if (elm.postId == post.postId) {
            elm.comments.push(comment)
        }
    })

    fs.writeFileSync('posts.json', JSON.stringify(updated))
    res.status(200).send(comment)
})

app.get('/posts/:postId/comments', (req, res) => {
    let result = handlePostIdValidation(req, res)
    res.status(200).send(result.comments)
})

app.get('/posts/:postId/comments/:comId', (req, res) => {

    let result = handlePostIdValidation(req, res)
    let found = result.comments.find(com => com.comId == req.params.comId)

    if (found) {
        res.status(200).send(found)
    } else {
        res.status(400).send("not valid comment ID")
    }

})

app.put('/posts/:postId/comments/:comId', (req, res) => {
    handleCommentValidation(req, res)
    handlePostIdValidation(req, res)
    let updated = latestPosts()
    let post = updated.find(elm => elm.postId == req.params.postId)
    let found = post.comments.find(com => com.comId == req.params.comId)

    if (!found) {
        return res.status(400).send("not valid comment ID")
    }

    found.details = req.body.details

    fs.writeFileSync('posts.json', JSON.stringify(updated))
    res.status(200).send(found)
})
app.delete('/posts/:postId/comments/:comId', (req, res) => {

    handlePostIdValidation(req, res)
    let updated = latestPosts()
    let post = updated.find(elm => elm.postId == req.params.postId)
    let foundIndex = post.comments.findIndex(com => com.comId == req.params.comId)

    if (foundIndex<0) {
        return res.status(400).send("not valid comment ID")
    }
    post.comments.splice(foundIndex,1)
    fs.writeFileSync('posts.json', JSON.stringify(updated))
    res.status(200).send(" Comment Successfully deleted")
   
})
//Post Likes

app.post('/posts/:postId/like', (req, res) => {

     handlePostIdValidation(req, res)

    let updated = latestPosts()
    updated.map(elm => {
        if (elm.postId == req.params.postId) {
            elm.likes +=1
        }
    })

    fs.writeFileSync('posts.json', JSON.stringify(updated))
    let post = updated.find(e => e.postId ==req.params.postId)
    res.status(200).send(post)
})

app.post('/posts/:postId/unlike', (req, res) => {

    handlePostIdValidation(req, res)

   let updated = latestPosts()
   updated.map(elm => {
       if (elm.postId == req.params.postId) {
           elm.likes = elm.likes >0 ? --elm.likes : elm.likes =0
       }
   })

   fs.writeFileSync('posts.json', JSON.stringify(updated))
   let post = updated.find(e => e.postId ==req.params.postId)
   res.status(200).send(post)
})

app.get('/posts?page=1&limit=10', (req,res)=>{
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const  toBeShown = latestPosts().slice(startIndex, endIndex);

    try {
        res.status(200).send(toBeShown )
    } catch (err) {
        res.status(500).send('something went wrong')
    }

})


app.listen(3000)