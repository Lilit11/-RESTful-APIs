//Task 4: Projects and Tasks Management with Deadlines

const express = require('express')
const app = express()
const body_parser = require('body-parser')
const fs = require('fs')
app.use(body_parser.json())

const {
    handleProjectValidation,
    projIdGen,
    readProjFromFile,
    handleProjIdValidation,
    handleTaskValidation,
    tasksIdGen,
    dateParser
} = require('./methods.js')


//CRUD Operations for Projects:
app.post('/projects', (req, res) => {

    handleProjectValidation(req, res)

    const { title, desc } = req.body
    const projId = projIdGen()
    const tasks = []

    let project = { title, desc, projId, tasks }

    let updated = readProjFromFile()
    updated.push(project)
    fs.writeFileSync('projects.json', JSON.stringify(updated))
    res.status(200).send(project)

})

app.get('/projects', (req, res) => {

    try {
        res.status(200).send(readProjFromFile())
    } catch (err) {
        res.status(500).send('something went wrong')
    }

})
app.get('/projects/:projId', (req, res) => {
    let result = handleProjIdValidation(req, res)
    res.status(200).send(result)
})

app.put('/projects/:projId', (req, res) => {
    handleProjectValidation()
    let result = handleProjIdValidation(req, res)
    let updatedList = readProjFromFile().filter(elm => elm.projId != result.projId)

    const { title, desc } = req.body
    const tasks = [];
    let projId = req.params.projId;
    const newProject = { title, desc, tasks, projId }


    updatedList.push(newProject)
    fs.writeFileSync('projects.json', JSON.stringify(updatedList))
    res.status(200).send(newProject)
})

app.delete('/projects/:projId', (req, res) => {
    let result = handleProjIdValidation(req, res)
    let updatedList = readProjFromFile().filter(elm => elm.projId != result.projId)
    fs.writeFileSync('projects.json', JSON.stringify(updatedList))
    res.status(200).send("Project Successfully deleted")
})

//CRUD Operations for Tasks:

app.post('/projects/:projId/tasks', (req, res) => {

    let project = handleProjIdValidation(req, res)
    handleTaskValidation(req, res)

    let task = {
        details: req.body.details,
        deadline: req.body.deadline,
        taskId: tasksIdGen()
    }

    let updated = readProjFromFile()
    updated.map(elm => {
        if (elm.projId == project.projId) {
            elm.tasks.push(task)
        }
    })

    fs.writeFileSync('projects.json', JSON.stringify(updated))
    res.status(200).send(task)
})

app.get('/projects/:projId/tasks', (req, res) => {
    let result = handleProjIdValidation(req, res)
    res.status(200).send(result.tasks)
})

app.get('/projects/:projId/tasks/:taskId', (req, res) => {

    let result = handleProjIdValidation(req, res)
    let found = result.tasks.find(elm => elm.taskId == req.params.taskId)

    if (found) {
        res.status(200).send(found)
    } else {
        res.status(400).send("not valid task ID")
    }

})

app.put('/projects/:projId/tasks/:taskId', (req, res) => {
     handleTaskValidation(req, res)
    handleProjIdValidation(req, res)
    let updated = readProjFromFile()
    let project = updated.find(elm => elm.projId == req.params.projId)
    let found = project.tasks.find(com => com.taskId == req.params.taskId)

    if (!found) {
        return res.status(400).send("not valid task ID")
    }

    found.details = req.body.details
    found.deadline = req.body.deadline

    fs.writeFileSync('projects.json', JSON.stringify(updated))
    res.status(200).send(found)
})
app.delete('/projects/:projId/tasks/:taskId', (req, res) => {

    handleProjIdValidation(req, res)
    let updated = readProjFromFile()
    let project = updated.find(elm => elm.projId == req.params.projId)
    let foundIndex = project.tasks.findIndex(com => com.taskId == req.params.taskId)

    if (foundIndex < 0) {
        return res.status(400).send("not valid task ID")
    }
    project.tasks.splice(foundIndex, 1)
    fs.writeFileSync('projects.json', JSON.stringify(updated))
    res.status(200).send(" Task Successfully deleted")

})

//Task Deadlines

app.get('/tasks', (req, res) => {

    const dueBefore = req.query.dueBefore
    const taskList = readProjFromFile().map(elm => elm.tasks).flat()

    if (!dueBefore) {
        try {
            res.status(200).send(taskList)
        } catch (err) {
            res.status(500).send('something went wrong')
        }
    } else {
        const parsedDueDate = dateParser(dueBefore)
        const toBeShown = taskList.filter(task => {
            const parsedDate = dateParser(task.deadline)
            return parsedDate <= parsedDueDate
        })


        res.status(200).send(toBeShown)
    }

})
app.listen(3000)