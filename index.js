const express = require('express')
const urlRoute = require('./routes/index')
const app = express()
const PORT = 1000
const { ConnectDB } = require('./connect')
const URL = require('./models/index')
const path = require('path')
const staticRoute = require('./routes/staticRoute')

ConnectDB("mongodb://localhost:27017/short-URL")
    .then(() => console.log("Database Connected Succesfully..."))

app.set("view engine", "ejs")
app.set('views', path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({ extended : false }))

app.use("/url", urlRoute)
app.use('/', staticRoute)

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                },
            }
        }
    )
    res.redirect(entry.redirectURL)
})

app.get("/test" , async (req,res) => {
    const allUrls = await URL.find({})
    return res.render('home', {
        urls: allUrls
    })
})


app.listen(PORT, () => console.log(`Server Started Succesfully at PORT ${PORT}`))