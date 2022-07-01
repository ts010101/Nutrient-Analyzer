//https://api.edamam.com/api/food-database/v2/nutrients
// get the food id by name
// get the nutrition info for that food id
// hard code to be 100 g as the measurement uri 
// the food id would change 
// quantity: 100
// measure uri: hard coded to g
// "http://www.edamam.com/ontologies/edamam.owl#Measure_gram"


//Things to do:
//connect what is searched to the backend
//return the result to the frontend 

const axios = require("axios");

const foodAPI = axios.create({ baseURL: "https://api.edamam.com/api/food-database/v2/" });

const { FOOD_APP_ID, FOOD_APP_KEY } = process.env;

function foodNutrientsFromName(query, cb) {
    foodAPI.get("/parser", {
        params: {
            "app_id": FOOD_APP_ID,
            "app_key": FOOD_APP_KEY,
            "ingr": query
        }
    }).then(({ data }) => {
        foodAPI.post("/nutrients", {
            ingredients: [{
                "foodId": data.parsed[0].food.foodId,
                "measureURI": "http://www.edamam.com/ontologies/edamam.owl#Measure_gram",
                "quantity": 100,
            }]
        }, {
            params: {
                "app_id": FOOD_APP_ID,
                "app_key": FOOD_APP_KEY,
            }
        }).then(({ data }) => cb(data));
    }).catch(console.err);
}

function diaryNutrients(query, cb) {
    foodAPI.get("/parser", {
        params: {
            "app_id": FOOD_APP_ID,
            "app_key": FOOD_APP_KEY,
            "ingr": query
        }
    }).then(({ data }) => {
        const totals = {};
        data.parsed.forEach(({ food: { nutrients }}) => {
            for (key in nutrients) {
                if (!(key in totals)) {
                    totals[key] = 0;
                }
                totals[key] += nutrients[key]; //Sum each nutirent in each field
            }
        });
        cb(totals);
    });
}

module.exports = { diaryNutrients, foodNutrientsFromName }
