import { Router, request } from 'express';
import asyncHandler from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderModel } from '../models/order.model';
import { OrderStatus } from '../constants/order_status';
import auth from '../middlewares/auth.mid';

const router = Router();
router.use(auth);

router.post(
  '/create',
  asyncHandler(async (request: any, response: any) => {
    const requestOrder = request.body;

    if (requestOrder.items.length <= 0) {
      response.status(HTTP_BAD_REQUEST).send('Cart Is Empty!');
      return;
    }

    await OrderModel.deleteOne({
      user: request.user.id,
      status: OrderStatus.NEW,
    });

    const newOrder = new OrderModel({
      ...requestOrder,
      user: request.user.id,
    });

    await newOrder.save();
    response.send(newOrder);
  })
);

router.get(
  '/newOrderForCurrentUser',
  asyncHandler(async (request: any, response) => {
    const order = await OrderModel.findOne({
      user: request.user.id,
      status: OrderStatus.NEW,
    });
    if (order) {
      response.send(order);
    } else {
      response.status(HTTP_BAD_REQUEST).send();
    }
  })
);

router.post(
  '/pay',
  asyncHandler(async (request: any, response) => {
    const { paymentId } = request.body;
    const order = await getNewOrderForCurrentUser(request);

    if (!order) {
      request.status(HTTP_BAD_REQUEST).send('Order Not Found!');
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    response.send(order._id);
  })
);

async function getNewOrderForCurrentUser(request: any) {
  return await OrderModel.findOne({
    user: request.user.id,
    status: OrderStatus.NEW,
  });
}
export default router;
