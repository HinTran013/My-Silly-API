const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const e = require('express')

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

//connect to mongo DB
mongoose.connect("mongodb://localhost:27017/MyTeamDB", {useNewUrlParser: true})

//send client a form to register
app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/register.html")
})

//create schema
const teaminfoSchema = {
    name: String,
    age: Number,
    hobby: String
}

const teaminfo = mongoose.model("teaminfo", teaminfoSchema)


//Handle all members
app.route("/teaminfo")
//GET method of API--------------
.get((req, res) => {
    //get all the team info in database
    //omit first condition param -> find all
    teaminfo.find((err, foundTeamInfo) => {
        if(err){
            res.send(err)
        }else{
            res.send(foundTeamInfo)
        }
    })
})
//POST method of API------------
//handle post request to add a new member through a simple post request through Postman
.post((req, res) => {
    const newMember = new teaminfo({
        name: req.body.name,
        age: req.body.age,
        hobby: req.body.hobby
    })

    newMember.save(err => {
        if(err){
            res.send(err)
        }else{
            res.send("Welcome!")
        }
    })
    
})
//handle post request to add a new member through a form
.post((req, res) => {
    const newMember = new teaminfo({
        name: req.body.name,
        age: req.body.age,
        hobby: req.body.hobby
    })

    newMember.save(err => {
        if(err){
            res.send(err)
        }else{
            res.send("Welcome!")
        }
    })
})
//DELETE method----------------
.delete((req, res) => {
    //delete all members
    //omit condition param -> delete all
    teaminfo.deleteMany((err) => {
        if(err){
            res.send('failed to delete')
        }else{
            res.send('All members have gone :(')
        }
    })
})

//Handle one specific team member
//rout to specific rout param
// get a member information
app.route('/teaminfo/:name')
.get((req, res) => {    
    teaminfo.findOne({name: req.params.name}, (err, foundMember) => {
        if(foundMember){
            res.send(foundMember)
        }else{
            res.send("No member matching that name was found")
        }
    })
})
//update a member information
.put((req, res) => {
    teaminfo.updateOne(
        {name: req.params.name},
        {$set: {name: req.body.name, age: req.body.age, hobby: req.body.hobby}},
        (err) => {
            if(!err){
                res.send("Successfully updated")
            }
        }
    )
})
.patch((req, res) => {
    teaminfo.updateOne(
        {name: req.params.name},
        {$set: {name: req.body.name, age: req.body.age, hobby: req.body.hobby}},
        (err) => {
            if(!err){
                res.send("Successfully updated")
            }
        }
    )
})
.delete((req, res) => {
    teaminfo.deleteOne(
        {name: req.params.name},
        err => {
            if(err){
                res.send(err)
            }else{
                res.send("successfully deleted")
            }
        }
    )
})

app.listen(3000, () => {
    console.log('server is listening on port 3000')
})
