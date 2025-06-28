
async function fetchRecipes(){

    try {
        
        const response = await fetch ('/reciperouts/flavortable');
        const data = await response.json();

        renderRecipes(data.results);


    } catch (error) {
        
        console.log("error happened while fetching recipes : " , error);
        
    }


};

document.addEventListener("DOMContentLoaded" , () => {


    const form = document.getElementById("search-form");
    const input = document.getElementById("ingredients");
    const resultDiv = document.getElementById("results");


    if(form){

        form.addEventListener("submit" , async (e) => {

            e.preventDefault();

            const ingredients = input.value.trim();
            
            if(!ingredients) return;

            try {
                
                const response = await fetch(`/reciperouts/search-by-ingredients?ingredients=${encodeURIComponent(ingredients)}`);
                const data = await response.json();

                resultDiv.innerHTML = "";

                if(data.length === 0){

                    resultDiv.innerHTML = `<p>No recipes found</p>`;

                }

                data.forEach(recipe => {

                    const recipeEl = document.createElement('div');
                    recipeEl.classList.add('recipe-card');

                    recipeEl.innerHTML = `
                    <div class = "search-card-content">
                        <h3 class = "recipe-title">${recipe.title}</h3>
                        <img class = "searchImage" src = "${recipe.image}" alt = "${recipe.title}"/>

                    <div class = "used-missed-ingredients">

                        <p><strong>Used Ingredients : </strong> ${recipe.usedIngredients.join(', ')}</p>
                        <p><strong>Missed Ingredients : </strong> ${recipe.missedIngredients.join(', ')}</p>

                    </div>    

                    </div>
                    `;


                    // the save button
                    const saveButton = document.createElement('button');
                    saveButton.textContent = "Save";
                    saveButton.classList.add("save-button");
                    

                    saveButton.addEventListener("click" , () => {

                        saveToFavorites(recipe);

                    });

                    recipeEl.appendChild(saveButton);

                    resultDiv.appendChild(recipeEl);

                });

            } catch (error) {

                console.error("error fetching recipes : " , error);
                resultDiv.innerHTML = `<p>error fetching recipes</p>`
                
                
            }


        })

    }

    if (document.getElementById("recipes-table-body")) {

        fetchRecipes(); 

    } 


});

document.getElementById("random-recipe-btn").addEventListener("click" , async () => {


    const resultDiv = document.getElementById("random-recipe-result");

    resultDiv.innerHTML = 'Loading...';

    try {

        const response = await fetch('/reciperouts/random-recipe');
        if(!response.ok) throw new Error('the network response is not okay');

        const recipe = await response.json();

        resultDiv.innerHTML = `
        
        
            <h2>${recipe.title}</h2>

            <img id = "random-recipe-image" src = "${recipe.image}" alt = "${recipe.title}"/>
            <h3>Ingredients</h3>

            <ul class = "ingredients-list">
            
                ${recipe.ingredients.map(ing => `<p>${ing}</p>`).join('')}

            </ul>

            <h3>Instructions : </h3>

            <p class = "recipe-instructions">${recipe.instructions || 'No instructions found'}</p>

        
        `;
        
    } catch (error) {
        
        console.log( "error fetching random recipes : " , error);

        resultDiv.innerHTML = `<p>failed to load recipe , please try again</p>`;
        

    }


});

function saveToFavorites(recipe){

    axios.post("/reciperouts/api/recipes" , {

        title: recipe.title,
        image: recipe.image,
        instructions: recipe.instructions || '',
        ingredients: recipe.ingredients || recipe.usedIngredients || [],
        readyIn: recipe.readyInMinutes || 0

    })
    .then(() => {

        alert("recipe saved to favorites (to the database)");

    })
    .catch(err => {

        console.log("we have a problem saving the data to the database" , err);
        alert("failed to save recipe");
        

    });

}


function renderRecipes(recipes){

    const tableBody = document.getElementById("recipes-table-body");

    tableBody.innerHTML = ``;

    recipes.forEach(recipe => {

        const row = document.createElement("tr");

        row.innerHTML = `
        
            <td>${recipe.title}</td>

            <td><img src="${recipe.image}" alt="${recipe.title}" width="100"/></td>

            <td><a href="https://spoonacular.com/recipes/${recipe.title.toLowerCase().replace(/ /g, '-')}-${recipe.id}" target="_blank">View Recipe</a></td>

        `;

        tableBody.appendChild(row);


    });

}







