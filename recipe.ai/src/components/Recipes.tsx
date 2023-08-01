import React, { useEffect } from "react";
import { BASE_URL } from "../App";
import axios from "axios";
import { Box, Grid } from "@mui/material";
import RecipeCard from "./RecipeCard";

const Recipes = () => {
  interface Recipe {
    title: string | undefined;
    description: string | undefined;
    cookingInstructions: string[] | undefined;
    preparationTime: string | undefined;
    servings: string | undefined;
    ingredients: {}[] | undefined;
    image: string | undefined;
    user: string | undefined;
  }
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const getRecipes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/recipes`);
      const recipeArray: Recipe[] = response.data.map(
        (recipe: {
          title: any;
          description: any;
          cookingInstructions: any;
          preparationTime: any;
          servings: any;
          ingredients: any;
          image: any;
          user: any;
        }) => {
          return {
            title: recipe.title,
            description: recipe.description,
            cookingInstructions: recipe.cookingInstructions,
            preparationTime: recipe.preparationTime,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            image: recipe.image.image,
            user: recipe.user.username,
          };
        }
      );
      setRecipes(recipeArray);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        {recipes.map((recipe: Recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.title}>
            <RecipeCard recipe={recipe}></RecipeCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recipes;
