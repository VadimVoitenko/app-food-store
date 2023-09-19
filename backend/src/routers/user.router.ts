import { Router } from 'express';
import { sample_users } from '../data';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import bcrypt from 'bcryptjs';

const router = Router();

router.get(
  '/seed',
  asyncHandler(async (request, response) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      response.send('Seed is already done!');
      return;
    }

    await UserModel.create(sample_users);
    response.send('Seed Is Done!');
  })
);

router.post(
  '/login',
  asyncHandler(async (request, response) => {
    const { email, password } = request.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      response.send(generateTokenResponse(user));
    } else {
      response
        .status(HTTP_BAD_REQUEST)
        .send('Username or password is invalid!');
    }
  })
);

router.post(
  '/register',
  asyncHandler(async (request, response) => {
    const { name, email, password, address } = request.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      response
        .status(HTTP_BAD_REQUEST)
        .send('User is already exist, please login!');
      return;
    }

    const ecruptedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: null,
      name,
      email: email.toLowerCase(),
      password: ecruptedPassword,
      address,
      isAdmin: false,
    };

    const dbUser = await UserModel.create(newUser);
    response.send(generateTokenResponse(dbUser));
  })
);

const generateTokenResponse = (user: User) => {
  const token = jwt.sign(
    {
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: '30d',
    }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token,
  };
};

export default router;
