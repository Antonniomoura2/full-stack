import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';
import { Order } from './order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOneById(id);
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: CreateOrderDto,
  ): Promise<Order | null> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.orderService.delete(id);
  }
}
