//Responsible for managing calls from johnathans microservice

const axios = require("axios");

const microservice = axios.create({ baseURL: "https://recipe-finder-7.herokuapp.com", responseType: "json" });

//https://recipe-finder-7.herokuapp.com/api/recipes?s=pasta
function searchRecipe(query, cb) {
    microservice.get("/api/recipes", { params: {s: query} }).then((res)=>cb(res.data));
}

module.exports = { searchRecipe };