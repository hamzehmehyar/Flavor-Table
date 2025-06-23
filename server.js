const express = require('express');

const path = require('path');

const app = express();

require('dotenv').config();


const apiKey = process.env.API_KEY;

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));  


//this is the first route to the flavortable page
app.get('/flavortable', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'flavortable.html'));

});

//the route for search by ingredients
app.get('/search', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'search.html'));

});

//the route for generate random recipe 
app.get('/generaterandomrecipe', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'randomrecipes.html'));

});

app.get('/favorites', (req, res) => {

  res.sendFile(path.join(__dirname, 'public', 'favorites.html'));

});

//this is the second route to the recipe page
const recipesRoutes = require('./routes/recipes');
app.use('/reciperouts', recipesRoutes);


//listening to the port
app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});