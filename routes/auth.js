const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const express = require('express');

const router = express.Router();

require('dotenv').config();

//we also want to reqire the database because we need to store the users data inside of it
//-----------------------------------
//db requiring
const pg = require("pg");
// const client = new pg.Client(DATABASE_URL);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

//-----------------------------------

const routeGuard = require("../middleware/verifyToken");


router.get('/secret', routeGuard ,async (req, res) => {

  res.send("Hello, this is a protected route");

});


//create the register

router.post('/register', async (req, res) => {

    
  const { username , email , password} = req.body;


    if (!username || !email || !password) {

    return res.status(400).send("Username, email, and password are required");
    
  }

  try {

    //hashing the password
    const hashedpassword = await bcrypt.hash(password , 10); //10 number is the number of times of hashing the password

    const result = await pool.query(

      "INSERT INTO users (username , email , password) VALUES ($1, $2 , $3) RETURNING id, username, email",

      [username , email ,hashedpassword]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error("Error inserting user", error);

    if(error.code === '23505'){ //error 409 is the unique error violation for duplication

         res.status(409).send("username already exists");

    } else if(error.detail.includes("email")){

    res.status(500).send("error" + error.message );

    }

  }

});

//login

router.post('/login', async (req, res) => {

    
  const { username , password } = req.body;

  try {

    const userResult = await pool.query(

      `SELECT * FROM users WHERE username = $1`,

      [username]

    );

    //
    const user = userResult.rows[0];

    //
    const isMatched = await bcrypt.compare(password , user.password);

    if(!isMatched){

        return res.status(401).send("invalid Credentials")

    }

    //
    const token = jwt.sign(

        {id: user.id , username: user.username} , 

        process.env.JWT_SECRET,

        {expiresIn: "2h"}


    );


    res.send({ token });

  } catch (error) {

    console.error("Error logging in", error);

    res.status(500).send("error" , error.message );

  }
});

//show profile data
router.get('/profile' , routeGuard , async (req , res) => {

  try {

    const userId = req.user.id;
    
    const result = await pool.query("SELECT username , email FROM users WHERE id = $1",

      [userId]

    );


    if(result.rows.length === 0){

      return res.status(404).send("user not found");

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.log("error fetching profile" , error);
    
    res.status(500).send("server error");

    
  }


});


module.exports = router;