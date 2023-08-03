import React, { useEffect } from "react";
import { BASE_URL } from "../App";
import axios from "axios";
import { Box, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
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
    user: string | null;
    _id: string;
  }
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  // @ts-ignore
  const [loading, setLoading] = React.useState(true);
  // @ts-ignore
  const [loaded, setLoaded] = React.useState(false);

  const [alignment, setAlignment] = React.useState("all recipes");
  // @ts-ignore
  const handleChange = (
    // @ts-ignore
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  const getRecipes = async () => {
    try {
      const response =
        alignment === "all recipes"
          ? await axios.get(`${BASE_URL}/api/recipes`)
          : await axios.get(
              `${BASE_URL}/api/recipes/${sessionStorage.getItem("userId")}`
            );
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
  }, [alignment]);

  return (
    <Box>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="my recipes">my recipes</ToggleButton>
        <ToggleButton value="all recipes">all recipes</ToggleButton>
      </ToggleButtonGroup>
      <Grid container spacing={3}>
        {recipes.map((recipe: Recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe._id}>
            <RecipeCard recipe={recipe} setLoaded={setLoaded}></RecipeCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recipes;
