const express = require('express');

const axios = require('axios');

const router = express.Router();

require('dotenv').config();

//-----------------------------------
//db requiring
const pg = require("pg");
// const client = new pg.Client(DATABASE_URL);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

//-----------------------------------


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

//db

router.get("/api/recipes/all", async (req, res) => {

  try {

    const result = await pool.query("SELECT * FROM recipes");

    res.json(result.rows);

  } catch (error) {

    res.status(500).send("Error fetching");

  }

});

router.post('/api/recipes', async (req, res) => {

    
  const { title, image, instructions, ingredients, readyIn } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO recipes (title, image, instructions, ingredients, readyIn) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, image, instructions, JSON.stringify(ingredients), readyIn]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting recipe:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/api/recipes/:id" , async (req , res) => {

    const { id } = req.params;

    try {
        
        const result = await pool.query("DELETE FROM recipes WHERE id = $1 RETURNING *", [id]);

        if(result.rowCount === 0){

            return res.status(404).json({error: "recipe not found"});

        }

        res.status(200).json({error: "recipe deleted succesfully"});

    } catch (error) {

        console.log("error deleting recipe" , error);
        res.status(500).json({ error: "Internal server error" });
        
    }

});

router.put("/api/recipes/:id" , async (req , res) => {

    const { id } = req.params;
    const { title , image , instructions , ingredients , readyIn } = req.body;
    
    try {
        
        const result = await pool.query(

        `UPDATE recipes 
        SET title = $1, image = $2, instructions = $3, ingredients = $4, readyIn = $5 
        WHERE id = $6 RETURNING *`,

        [title, image, instructions, JSON.stringify(ingredients), readyIn, id]

        );

        res.json(result.rows[0]);

    } catch (error) {

        console.log("error while updating the recipe" , error);

        res.status(500).json({ error: 'Failed to update recipe' });
         
    }


});



module.exports = router;