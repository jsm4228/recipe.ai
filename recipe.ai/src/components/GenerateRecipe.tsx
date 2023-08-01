import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import React, { useContext } from "react";
import { Configuration, OpenAIApi } from "openai";
import { BASE_URL, OPENAI_KEY } from "../App";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

function generate(element: React.ReactElement) {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value,
    })
  );
}

const GenerateRecipe = () => {
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [meal, setMeal] = React.useState("");
  const [healthy, setHealthy] = React.useState("");
  const [items, setItems] = React.useState<string[]>([]);
  const { user, setUser } = useContext(UserContext);

  const config = new Configuration({
    apiKey: OPENAI_KEY,
  });
  const openai = new OpenAIApi(config);

  interface Recipe {
    title: string;
    description: string;
    cookingInstructions: string[];
    preparationTime: string;
    servings: number;
    ingredients: {}[];
    image: string;
  }

  const runImagePrompt = async (message: string) => {
    const response = await openai.createImage({
      prompt: message,
      n: 1,
      size: "1024x1024",
    });
    const image_url = response.data.data[0].url;
    console.log(image_url);
    return image_url;
  };

  const runTextPrompt = async (message: string) => {
    const response_ai = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: message,
      max_tokens: 2048,
      temperature: 0.2,
    });

    return response_ai.data.choices[0].text;
  };
  const parseRecipe = async (input: string): Promise<Recipe> => {
    const recipe: Recipe = {
      title: "",
      description: "",
      cookingInstructions: [],
      preparationTime: "",
      servings: 0,
      ingredients: [],
      image: "",
    };

    const lines = input.split("\n").map((line) => line.trim());
    console.log(lines);

    recipe.title = lines[
      lines.findIndex((line) => line.toLowerCase().startsWith("title"))
    ]
      .substring("title ".length + 1)
      .replace(/[^\w\s]/gi, "");
    recipe.description = lines[
      lines.findIndex((line) => line.toLowerCase().startsWith("description"))
    ]
      .substring("description ".length + 1)
      .replace(/[^\w\s]/gi, "");

    const preparationIndex = lines.findIndex((line) =>
      line.toLowerCase().replace(" ", "").startsWith("preparationtime")
    );

    recipe.preparationTime = lines[preparationIndex].substring(
      "preparationTime ".length
    );

    recipe.servings = Number(
      lines[
        lines.findIndex((line) => line.toLowerCase().startsWith("servings"))
      ].substring("servings ".length)
    );

    //recipe.cookingInstructions =
    const instructionsStartIndex =
      lines.findIndex((line) =>
        line.toLowerCase().replace(" ", "").startsWith("cookinginstructions")
      ) + 1;

    recipe.cookingInstructions = lines.slice(
      instructionsStartIndex,
      preparationIndex
    );

    const ingredientsStartIndex =
      lines.findIndex((line) => line.toLowerCase().startsWith("ingredients")) +
      2;

    const ingredientArray = lines.slice(ingredientsStartIndex);
    recipe.ingredients = ingredientArray.map((ingredient) => {
      const [name, quantity] = ingredient.split(",");
      return {
        name: name.trim().replace(/[^\w\s]/gi, ""),
        quantity: quantity.trim(),
      };
    });

    const image = await runImagePrompt(recipe.description);
    recipe.image = image ? image : "";

    return recipe;
  };
  const handleGenerateSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const prompt: string = `Please create a recipe for ${meal} that is ${healthy} and uses the following ingredients: ${items.join()}.

      In your response, please provide the following attributes for the recipe:
      title - [please provide a title of the recipe that makes sense]
      description - [describe what the meal is]
      cookingInstructions - [please provide a numbered list of instructions to make the recipe]
      preparationTime: [provide the amount of time in minutes to make this recipe]
      servings: [provide the amount of servings this recipe makes]
      image: [provide a random url from unsplash]
      Ingredients: [provide a list of ingredients in the format of "name of ingredient, quantity of ingredient". Please separate the name of the ingredient and the quantity of the ingredient with a comma.]
      
      In your response, please ensure all these attributes (title, description, cookingInstructions, preparationTime, servings, image, and ingredients) have a value and all these attributes are lowercase in your response and appear exactly as written here (one word and in camelCase).`;
    console.log(prompt);

    try {
      const response = await runTextPrompt(prompt);
      console.log(response);
      //   response ? console.log(await parseRecipe(response)) : null;
      let recipe;
      response ? (recipe = await parseRecipe(response)) : null;
      recipe = { ...recipe, user: user._id };
      console.log(recipe);
      const recipe_response = await axios.post(
        `${BASE_URL}/api/recipes/`,
        recipe
      );

      console.log(recipe_response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim()) {
      setItems((prevItems) => [...prevItems, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleDeleteItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleChangeMeal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeal(event.target.value);
  };

  const handleChangeHealthy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHealthy(event.target.value);
  };

  return (
    <Box>
      <Container
        sx={{
          display: "flex",

          justifyContent: "center",
        }}
      >
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Meal</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={handleChangeMeal}
          >
            <FormControlLabel
              value="breakfast"
              control={<Radio />}
              label="Breakfast"
            />
            <FormControlLabel value="lunch" control={<Radio />} label="Lunch" />
            <FormControlLabel
              value="dinner"
              control={<Radio />}
              label="Dinner"
            />
            <FormControlLabel
              value="dessert"
              control={<Radio />}
              label="Dessert"
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Nutrition</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={handleChangeHealthy}
          >
            <FormControlLabel
              value="healthy"
              control={<Radio />}
              label="Healthy"
            />
            <FormControlLabel
              value="not healthy and yummy"
              control={<Radio />}
              label="Indulgent"
            />
            <FormControlLabel
              value="kinda healthy, kinda unhealthy"
              control={<Radio />}
              label="Average"
            />
          </RadioGroup>
        </FormControl>
      </Container>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        <TextField
          id="outlined-basic"
          label="Add ingredients"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
      <form onSubmit={handleGenerateSubmit}>
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          sx={{ height: "90%" }}
        >
          Generate Recipe
        </Button>
      </form>

      <List dense={dense}>
        {items.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteItem(index)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <KitchenOutlinedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={item}
              secondary={secondary ? "Secondary text" : null}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default GenerateRecipe;
