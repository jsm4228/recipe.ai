import {
  Avatar,
  Box,
  Button,
  CircularProgress,
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
import React from "react";
import { Configuration, OpenAIApi } from "openai";
import { BASE_URL, OPENAI_KEY } from "../App";
import axios from "axios";
import RecipeCard from "./RecipeCard";
import { TypeAnimation } from "react-type-animation";

const GenerateRecipe = () => {
  interface Recipe {
    title: string | undefined;
    description: string | undefined;
    cookingInstructions: string[] | undefined;
    preparationTime: string | undefined;
    servings: string | undefined;
    ingredients: {}[] | undefined;
    image: string | undefined;
    user: string | null;
  }
  //const { user, setUser } = useContext(UserContext);

  const initialRecipe: Recipe = {
    title: "",
    description: "",
    cookingInstructions: [],
    preparationTime: "",
    servings: "",
    ingredients: [],
    image: "",
    user: sessionStorage.getItem("username"),
  };
  // @ts-ignore
  const [dense, setDense] = React.useState(false); // @ts-ignore
  const [secondary, setSecondary] = React.useState(false); // @ts-ignore
  const [inputValue, setInputValue] = React.useState("");
  const [meal, setMeal] = React.useState("");
  const [healthy, setHealthy] = React.useState("");
  const [items, setItems] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [recipe, setRecipe] = React.useState<Recipe>(initialRecipe);

  const config = new Configuration({
    apiKey: OPENAI_KEY,
  });
  const openai = new OpenAIApi(config);

  const runImagePrompt = async (message: string) => {
    setLoading(true);
    setLoadingMessage("Generating image...");

    const response = await openai.createImage({
      prompt: message,
      n: 1,
      size: "1024x1024",
    });
    const image_url = response.data.data[0].url;
    // upload_image(image_url);
    console.log(image_url);
    setLoading(false);
    return image_url;
  };

  const runTextPrompt = async (message: string) => {
    setLoading(true);
    setLoadingMessage("Generating recipe...");
    const response_ai = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: message,
      max_tokens: 2048,
      temperature: 0.2,
    });
    setLoading(false);

    return response_ai.data.choices[0].text;
  };
  const parseRecipe = async (input: string): Promise<Recipe | null> => {
    const recipe: Recipe = {
      title: "",
      description: "",
      cookingInstructions: [],
      preparationTime: "",
      servings: "",
      ingredients: [],
      image: "",
      user: sessionStorage.getItem("username"),
    };
    try {
      const lines = input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");
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

      recipe.servings = lines[
        lines.findIndex((line) => line.toLowerCase().startsWith("servings"))
      ].substring("servings ".length);

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
        lines.findIndex((line) =>
          line.toLowerCase().startsWith("ingredients")
        ) + 2;

      const ingredientArray = lines.slice(ingredientsStartIndex);
      recipe.ingredients = ingredientArray.map((ingredient) => {
        const [name, quantity] = ingredient.split(",");
        console.log(name, quantity);
        return {
          name: name.trim().replace(/[^\w\s]/gi, ""),
          quantity: quantity.trim(),
        };
      });

      const image = await runImagePrompt(
        `Cartoon image of ${recipe.description}`
      );
      recipe.image = image ? image : "";
      return recipe;
    } catch (error) {
      setLoadingMessage(
        "Error generating recipe, please try again or try new ingredients"
      );
      console.log(error);
      return null;
    }
  };
  const handleGenerateSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoaded(false);
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
      recipe = { ...recipe, user: sessionStorage.getItem("userId") };
      console.log(recipe);
      const recipe_response = await axios.post(
        `${BASE_URL}/api/recipes/`,
        recipe
      );

      console.log(recipe_response.data);
      setRecipe({
        title: recipe.title,
        description: recipe.description,
        cookingInstructions: recipe.cookingInstructions,
        preparationTime: recipe.preparationTime,
        servings: recipe.servings,
        ingredients: recipe.ingredients,
        image: recipe.image,
        user: sessionStorage.getItem("username"),
      });
      setLoaded(true);
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
      <Typography variant="h2" align="center" padding={"10px"}>
        AI Recipe Generator
      </Typography>
      <Typography
        variant="body1"
        align="center"
        color={"grey"}
        padding={"10px"}
      >
        Welcome to the AI Recipe Generator! Type in any ingredient in the box
        below and hit enter to add it to your recipe. Once you're ready, click
        'Generate Recipe' to generate a new recipe with AI.
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center", padding: "10px" }}
      >
        <TextField
          id="outlined-basic"
          label="Add ingredients"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
      </form>

      <Box
        sx={{
          border: "1px solid gray",
          borderRadius: "10px",
          minHeight: "50vh",
          display: "flex",
          justifyContent: "center",
          gap: "10px", // Adding a gap between the two child boxes
          padding: "20px",
        }}
      >
        <Box sx={{ flex: 1 }}>
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
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            margin: "auto",
          }}
        >
          {loading ? <CircularProgress /> : null}
          {loading ? (
            <TypeAnimation
              key={loadingMessage}
              sequence={[
                // Same substring at the start will only be typed once, initially
                loadingMessage,
                1000,
              ]}
              speed={50}
              // style={{ fontSize: "2em" }}
              repeat={Infinity}
            />
          ) : null}
          {loaded ? (
            <RecipeCard recipe={recipe} setLoaded={setLoaded}></RecipeCard>
          ) : null}
        </Box>
      </Box>

      <Container
        sx={{
          display: "flex",

          justifyContent: "center",
        }}
      >
        <FormControl
          sx={{
            display: "flex",
            alignItems: "center",
            m: 1,
            minWidth: 120,
          }}
        >
          <FormLabel id="demo-radio-buttons-group-label">Meal</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={handleChangeMeal}
            sx={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid gray",
              borderRadius: "10px",
              padding: "10px",
              margin: "10px",
            }}
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
        <FormControl
          sx={{
            display: "flex",
            alignItems: "center",
            m: 1,
            minWidth: 120,
          }}
        >
          <FormLabel id="demo-radio-buttons-group-label">Nutrition</FormLabel>

          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={handleChangeHealthy}
            sx={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid gray",
              borderRadius: "10px",
              padding: "10px",
              margin: "10px",
            }}
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
      </Container>
    </Box>
  );
};

export default GenerateRecipe;
