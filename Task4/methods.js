const fs = require('fs')

const handleProjectValidation = (req, res) => {

    if (!req.body.title || !req.body.desc ) {
        return res.status(400).send("Please Provide full information")
    }

}

const projIdGen = () => {
    const projects= fs.readFileSync("projects.json")
    const result = JSON.parse(projects)

    return result.length > 0 ? Math.max(...result.map(proj => proj.projId)) + 1 : 0
}

const readProjFromFile = () => {

    const projects = fs.readFileSync('projects.json')
    const result = JSON.parse(projects)
    return result
}
const handleProjIdValidation = (req, res) => {

    let flag = readProjFromFile().find(elm => elm.projId == req.params.projId)


    if (!flag) {
        res.status(401).send('not valid ID')
    } else {
        return flag
    }
}
const handleTaskValidation = (req, res) => {

    if (!req.body.details || !req.body.deadline) {
        return res.status(400).send("Please Provide full information")
    }

}

const tasksIdGen = () => {

    let updated = readProjFromFile()
    let tasks = updated.map(elm => elm.tasks).flat()
    let max = Math.max(...tasks.map(e => e.taskId))

    return max >= 0 ? max + 1 : 0
}
const dateParser =(string)=>{
    return new Date(string)
}
module.exports ={
    handleProjectValidation,
    projIdGen,
    readProjFromFile ,
    handleProjIdValidation,
    handleTaskValidation,
    tasksIdGen,
    dateParser

}