const express = require('express');

const axios = require('axios');

const router = express.Router();

require('dotenv').config();


const apiKey = process.env.API_KEY;

router.get('/flavortable', async (req, res) => {

  try {

    const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?number=10&apiKey=${apiKey}`);
    
    res.json({ results: response.data.results });

  } catch (error) {

    console.error("Error fetching flavor table data:", error.message);

    res.status(500).json({ error: "Failed to fetch flavor table data" });

  }
  
});

//random recipe route
router.get('/random-recipe' , async (req , res) => {

    try {
        
        const response = await axios.get(`https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`);
        const recipe = response.data.recipes[0];


        const simplified = {

            title: recipe.title,
            image: recipe.image,
            instructions: recipe.instructions,
            ingredients: recipe.extendedIngredients.map(ing => ing.original),

        };

        res.json(simplified);

    } catch (error) {

        console.log("error happened while fetching a random recipe : " , error.message);

        res.status(500).json({error : 'failed to fetch random recipe'});
        
        
    }


});

router.get('/search-by-ingredients' , async (req , res) => {

    const ingredients = req.query.ingredients;

    if(!ingredients){

        return res.status(400).json({error : 'ingredients query required'});

    }

    try {

        const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients' ,{

            params: {

                ingredients: ingredients,
                number: 10,
                apiKey: apiKey,

            },


        });

        const simplified = response.data.map(recipe => ({

            title: recipe.title,
            image: recipe.image,
            usedIngredients: recipe.usedIngredients.map(ing => ing.name),
            missedIngredients: recipe.missedIngredients.map(ing => ing.name),


        }));

        res.json(simplified);
        
    } catch (error) {

        console.log(error);

        res.status(500).json({error: 'failed to fetch recipes by ingredients'});
        
        
    }


});

module.exports = router;