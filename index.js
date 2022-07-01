require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const cors = require('cors'); 

const { searchRecipe } = require("./recipe");
const { diaryNutrients, foodNutrientsFromName } = require("./lookupFood");
const foodfact = require("./foodfact");

const port = process.env.PORT || 3000;
const handlebars = require('express-handlebars').create({
    defaultLayout: 'default',
    helpers: {
        round: (number) => Math.round(number)
    }
});



const public_folder = path.resolve(__dirname, "..", "public");
const template_folder = path.resolve(__dirname, "..", "pages");

const app = express();
app.use(cors())

//Configure app
app.engine('handlebars', handlebars.engine)    //Set handlebars as template engine
    .set('view engine', 'handlebars')          //Automaticaly pick up files with ".handlebars" extension
    .set('views', template_folder)             //Set views folder
    .set('port', port);


//Set up listeners
app.use(express.static(public_folder))         // Serve Public Folder
    .get('/favicon.ico', function (req, res) { //Ignore Favicon
        res.sendStatus(204);
    })
    .get("/foodfact", (req, res) => {
        res.send(foodfact());
    })
    .get("/recipes", (request, result) => {
        searchQuery = request.query.search ?? "chicken"; //Get the s parameter for search query
        searchRecipe(searchQuery, (data) => {
            result.render("recipes", { data });
        });
    })
    .get("/nutritiontable", (request, result) => {
        searchQuery = request.query.search ?? "chicken"; //Get the s parameter for search query
        foodNutrientsFromName(searchQuery, (data) => {
            result.render("nutritiontable", { data });
        });
    })
    .get("/fooddiary", (request, result) => {
        searchQuery = request.query.search; //Get the s parameter for search query
        if (searchQuery) { 
            diaryNutrients(searchQuery, (data) => {
                result.render("fooddiary", { data });
            });
        } else {
            result.render("fooddiary");
        }

    })
    .get("/:page", (request, result) => {      //If no static file found, use handlebar template
        result.render(request.params.page);
    })
    .get("/", (request, result) => {           //Redirect root to /index
        result.redirect("/index");
    })


//Start app
app.listen(port, () => {
    console.log(`Server now running on http://localhost:${app.get("port")}\nServing ${public_folder}`)
});





