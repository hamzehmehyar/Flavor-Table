const express = require('express');

const path = require('path');

const app = express();

require('dotenv').config();

//------------------------------------------

//db requiring
const pg = require("pg");
// const client = new pg.Client(DATABASE_URL);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.use(express.json());

//------------------------------------------


const apiKey = process.env.API_KEY;

const PORT = process.env.PORT || 3000;



//
const home = require("./routes/home");

app.use("/", home); 

app.use(express.static('public')); 


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


//listening to the port with connecting it with the database server
pool
  .connect()
  .then((client) => {
    return client
      .query("SELECT current_database(), current_user")
      .then((res) => {
        client.release();
 
        const dbName = res.rows[0].current_database;
        const dbUser = res.rows[0].current_user;
 
        console.log(
          `Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`
        );
 
        console.log(`App listening on port http://localhost:${PORT}`);
      });
  })
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });
