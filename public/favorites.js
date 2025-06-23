//favorite function
document.addEventListener("DOMContentLoaded", () => {

  const favoritesContainer = document.getElementById("favorites-container");

  if (favoritesContainer) {

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {

      favoritesContainer.innerHTML = "<p>No favorite recipes saved.</p>";

      return;
    }

    favorites.forEach((recipe, index) => {

      const recipeEl = document.createElement("div");

      recipeEl.classList.add("recipe-card");

      recipeEl.innerHTML = `

        <h3>${recipe.title}</h3>

        <img src="${recipe.image}" alt="${recipe.title}" width="200" />

      `;

      const removeBtn = document.createElement("button");

      removeBtn.textContent = "Remove";

      removeBtn.addEventListener("click", () => {

        favorites.splice(index, 1);

        localStorage.setItem("favorites", JSON.stringify(favorites));

        location.reload();

      });

      recipeEl.appendChild(removeBtn);

      favoritesContainer.appendChild(recipeEl);

    });

  }

});
