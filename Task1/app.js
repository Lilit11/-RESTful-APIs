//Task 1: Advanced User and Profile Management
const express = require('express');
const app = express();

const body_parser = require("body-parser")
app.use(body_parser.json())

let users = []
let userCounter = 0

app.get('/users', (req, res) => {
    res.status(200).send(users)
})
app.get('/users/:id', (req, res) => {

    let found = users.find(user => user.id == req.params.id)

    if (found) {
        res.status(200).send(found)
    } else {
        res.status(400).send("User with such ID  doesn't exist ")
    }

})
app.post('/users', (req, res) => {

    if (req.body.name && req.body.email && req.body.pass) {

        let newUser = {
            name: req.body.name,
            email: req.body.email,
            pass: req.body.pass,
            id: userCounter++,
            profile: null
        }
        users.push(newUser)

        res.status(201).send(newUser)
    } else {
        res.status(400).send("Please provide full information")
    }

})

app.put('/users/:id', (req, res) => {

    let found = users.find(user => user.id == req.params.id)

    if (req.body.name && req.body.email && req.body.pass) {
        if (found) {
            users = users.filter(user => user.id != req.params.id)
            let updated = {
                name: req.body.name,
                email: req.body.email,
                pass: req.body.pass,
                id: req.params.id,
                profile: null
            }
            users.push(updated)
            res.status(200).send(updated)
        } else {
            res.status(400).send("User with such ID  doesn't exist ")
        }
    } else {
        res.status(400).send("Please provide full information")
    }
})

app.delete('/users/:id', (req, res) => {
    let found = users.find(user => user.id == req.params.id)

    if (found) {
        users = users.filter(user => user.id != req.params.id)
        res.status(200).send("User Deleted")
    } else {
        res.status(400).send("User with such ID  doesn't exist ")
    }

})
app.get('/users/:id/profile', (req, res) => {

    let found = users.find(user => user.id == req.params.id)

    if (found) {
        res.status(200).send(found.profile)
    } else {
        res.status(400).send("User whith such ID  doesn't exist ")
    }
})

app.post('/users/:id/profile', (req, res) => {

    let found = users.find(user => user.id == req.params.id)

    if (found) {

        if (req.body.bio && req.body.picURL) {
            found.profile = {
                bio: req.body.bio,
                picURL: req.body.picURL
            }
            res.status(201).send(found)
        } else {
            res.status(400).send("Please provide full information")
        }

    } else {
        res.status(400).send("User whith such ID  doesn't exist ")
    }
})


app.put('/users/:id/profile', (req, res) => {

    let found = users.find(user => user.id == req.params.id)


    if (found) {
        if (req.body.bio && req.body.picURL) {
            users = users.filter(user => user.id != req.params.id)
            let updated = {
                ...found,
                profile: {
                    bio: req.body.bio,
                    picURL: req.body.picURL
                }
            }
            users.push(updated)
            res.status(200).send(updated)
        } else {
            res.status(400).send("Please provide full information")

        }
    } else {
        res.status(400).send("User with such ID  doesn't exist ")
    }
})
app.delete('/users/:id/profile', (req, res) => {

    let found = users.find(user => user.id == req.params.id)

    if (found) {

        found.profile = null

        res.status(200).send("User's profile Deleted")
    } else {
        res.status(400).send("User with such ID  doesn't exist ")
    }

})

app.listen(3000)