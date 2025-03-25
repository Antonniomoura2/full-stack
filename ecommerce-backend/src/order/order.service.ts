import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.schema';
import { CreateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate(['productIds']).exec();
  }

  async findOneById(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('productIds');

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(
    id: string,
    updateOrderDto: CreateOrderDto,
  ): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.orderModel.findByIdAndDelete(id).exec();
  }
}
