import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import React from "react";

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
  const [items, setItems] = React.useState<string[]>([]);

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

  return (
    <Box>
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
