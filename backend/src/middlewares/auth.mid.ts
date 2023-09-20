import { verify } from 'jsonwebtoken';
import { HTTP_UNAUTHORIZED } from '../constants/http_status';

export default (request: any, response: any, next: any) => {
  const token = request.headers.access_token as string;
  if (!token) return response.status(HTTP_UNAUTHORIZED).send();

  try {
    const decodedUser = verify(token, process.env.JWT_SECRET!);
    request.user = decodedUser;
  } catch (error) {
    response.status(HTTP_UNAUTHORIZED).send();
  }

  return next();
};
