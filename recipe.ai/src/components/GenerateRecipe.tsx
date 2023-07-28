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
import React from "react";
import { Configuration, OpenAIApi } from "openai";

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

  //   const config = new Configuration({
  //     apiKey: OPENAI_KEY,
  //   });
  //   const openai = new OpenAIApi(config);

  //   const runPrompt = async (message: String[]) => {
  //     const response_ai = await openai.createCompletion({
  //       model: "text-davinci-003",
  //       prompt: message,
  //       max_tokens: 2048,
  //       temperature: 1,
  //     });
  //     return response_ai.data.choices[0].text;

  //     //   const data_ai = await axios.post(`${BASE_URL}/api/messages`, {
  //     //     content: ,
  //     //     chat: currentChat,
  //     //   });
  //     //in order for sent prompt to stay on screen, we needed to pass 'data' again
  //   };

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

  const handleGenerateSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const prompt = [
      `Please create a recipe with the follwing ingredients: ${items.join(
        ", "
      )}. Please make sure the recipe is a ${meal} and ${healthy}. Can you output the steps in a paragraph format? And can you output the ingredients, measurements, and unit of measurement in a format like: 'ingredient, measurement, unit of measurment'. After this, can you output a list of that says the title, description, preperationTime, servings, and category. The category can be any cuisine type and a description of that cuisine`,
    ];
    //const response = await runPrompt(prompt);
    //console.log(response);
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
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          sx={{ height: "90%" }}
          //   onClick={handleGenerateSubmit}
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
