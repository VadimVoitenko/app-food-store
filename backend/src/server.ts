import express from 'express';
import cors from 'cors';
import { sample_foods, sample_tags } from './data';

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:4200'],
  })
);

app.get('/api/foods', (request, response) => {
  response.send(sample_foods);
});

app.get('/api/foods/search/:searchTerm', (request, response) => {
  const searchTerm = request.params.searchTerm;
  const foods = sample_foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  response.send(foods);
});

app.get('/api/foods/tags', (request, response) => {
  response.send(sample_tags);
});

app.get('/api/foods/tag/:tagName', (request, response) => {
  const tagName = request.params.tagName;
  const foods = sample_foods.filter((food) => food.tags?.includes(tagName));
  response.send(foods);
});

app.get('/api/foods/:foodId', (request, response) => {
  const foodId = request.params.foodId;
  const food = sample_foods.find((food) => food.id == foodId);
  response.send(food);
});

const port = 5000;
app.listen(port, () => {
  console.log('Website served on http://localhost:' + port);
});
