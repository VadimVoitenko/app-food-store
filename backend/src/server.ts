import express from 'express';
import cors from 'cors';
import { sample_foods, sample_tags, sample_users } from './data';
import jsonwebtoken from 'jsonwebtoken';

const app = express();
app.use(express.json());

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

app.post('/api/users/login', (request, response) => {
  const { email, password } = request.body;
  const user = sample_users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    response.send(generateTokenResponse(user));
  } else {
    response.status(400).send('User name or password is not valid!');
  }
});

const generateTokenResponse = (user: any) => {
  const token = jsonwebtoken.sign(
    {
      email: user.email,
      isAdmin: user.isAdmin,
    },
    'SomeRandomText',
    {
      expiresIn: '30d',
    }
  );

  user.token = token;
  return user;
};

const port = 5000;
app.listen(port, () => {
  console.log('Website served on http://localhost:' + port);
});
