
//favorite function
document.addEventListener("DOMContentLoaded" , () => {

  const favoritesContainer = document.getElementById("favorites-container");


  if(!favoritesContainer) return;

  favoritesContainer.innerHTML = "<p>loading favorites...</p>";

  //fetching the favorites from the backend through axios

  axios.get("/reciperouts/api/recipes/all")
    .then(response => {

      const favorites = response.data;

      if(favorites.length === 0){

        favoritesContainer.innerHTML = `<p class = "no-favorites-yet">no favorite recipes saved</p>`;

        return;

      }

      favoritesContainer.innerHTML = "";

      favorites.forEach((recipe) => {

        const recipeEl = document.createElement("div");

        recipeEl.classList.add("recipe-card-favorite");

        let ingredientsText = "";

        try {
          
          const ingredients = typeof recipe.ingredients === "string"
            ? JSON.parse(recipe.ingredients)
            : recipe.ingredients;

            ingredientsText = Array.isArray(ingredients)
              ? ingredients.join(", ")
              :ingredients;

        } catch (error) {

          console.log("failed to parse ingredients" , error);
          ingredientsText = "unknown ingredients";
          
          
        }

          recipeEl.innerHTML = `

          <h3 class = "favorite-title">${recipe.title}</h3>
          <img class = "favorite-image" src="${recipe.image}" alt="${recipe.title}"/>
          
          <div class = "favorite-ingredients-instructions">

          <p><strong>Ingredients : </strong>${ingredientsText}</p>
          <p><strong>Instructions : </strong>${recipe.instructions || "No instructions provided"}</p>
          
          </div>
        `;

        const removeBtn = document.createElement("Button")
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove-button");

        removeBtn.addEventListener("click" , async () => {


          try {
            
            await axios.delete(`/reciperouts/api/recipes/${recipe.id}`);
            recipeEl.remove();

          } catch (error) {

            console.log("error deleting recipe catched" , error);
            alert("failed to delete recipe");            
            
          }

        });

        recipeEl.appendChild(removeBtn);
        favoritesContainer.appendChild(recipeEl);

        //the editing button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-button");

        //the update form
        const updateForm = document.createElement("form");
        updateForm.id = "updateForm";

        updateForm.innerHTML = `
        
            <input type="text" name="title" value="${recipe.title}" placeholder="Title" required />
            <input type="text" name="image" value="${recipe.image}" placeholder="Image URL" required />
            <textarea name="instructions" placeholder="Instructions">${recipe.instructions}</textarea>
            <input type="text" name="ingredients" value="${ingredientsText}" placeholder="Ingredients comma separated" />
            <input type="number" name="readyIn" value="${recipe.readyin || 0}" placeholder="Ready In Minutes" />
            <button type="submit">Update</button>
        
        `;

        updateForm.style.display = "none";
        editBtn.addEventListener("click" , () => {

          updateForm.style.display = updateForm.style.display === "none" ? "block" : "none";


        });


        updateForm.addEventListener("submit" , async (e) => {

          e.preventDefault();

          const updateRecipe = {

            title: updateForm.title.value,
            image: updateForm.image.value,
            instructions: updateForm.instructions.value,
            ingredients: updateForm.ingredients.value.split(",").map(i => i.trim()),
            readyIn: parseInt(updateForm.readyIn.value) || 0


          };

          try {
            
            await axios.put(`/reciperouts/api/recipes/${recipe.id}`, updateRecipe);
            alert("Recipe updated sucessfully");
            location.reload();

          } catch (error) {

            console.log("error updating the recipe ", error);
            alert("failed to update recipe");
            
          }

        });

            recipeEl.appendChild(editBtn);
            recipeEl.appendChild(updateForm);
            recipeEl.appendChild(removeBtn);
            favoritesContainer.appendChild(recipeEl);

      });

    })
    .catch(error => {

      console.log("error fetching the favorites from the database" , error);
      favoritesContainer.innerHTML = `<p>Error loading favorites</p>`

    });


});