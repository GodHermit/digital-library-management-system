import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { EUserRole } from '../users/types/user.enum';
import { CloseOrderDto } from './dto/close-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: "Get user's orders (paginated)" })
  @ApiResponse({ type: OrderResponseDto, isArray: true })
  @BearerTokenAuth()
  async getUserOrders(
    @Paginate() query: PaginateQuery,
    @GetUser() user: UserEntity,
  ) {
    const orders = await this.ordersService.getUserOrders(query, user);
    return {
      ...orders,
      data: orders.data.map((order) => new OrderResponseDto(order)),
    };
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all orders (paginated)' })
  @ApiResponse({ type: OrderResponseDto, isArray: true })
  @BearerTokenAuth(EUserRole.ADMIN)
  async getAllOrders(@Paginate() query: PaginateQuery) {
    const orders = await this.ordersService.getAllOrders(query);
    return {
      ...orders,
      data: orders.data.map((order) => new OrderResponseDto(order)),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ type: OrderResponseDto })
  @BearerTokenAuth()
  async getOrderById(@Param('id', new ParseUUIDPipe()) id: string) {
    const order = await this.ordersService.getOrderById(id);
    return new OrderResponseDto(order);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
    description: `
      This endpoint creates a new order.
      - Order will be created with status "pending".
      - Order will be failed if not paid within 30 minutes.
    `,
  })
  @ApiResponse({ type: OrderResponseDto })
  @BearerTokenAuth()
  async createOrder(@Body() dto: CreateOrderDto, @GetUser() user: UserEntity) {
    const order = await this.ordersService.createOrder(dto, user);
    return new OrderResponseDto(order);
  }

  @Post('close')
  @ApiOperation({ summary: 'Close an order by ID' })
  @ApiResponse({ type: OrderResponseDto })
  @BearerTokenAuth()
  async closeOrder(@Body() dto: CloseOrderDto, @GetUser() user: UserEntity) {
    const order = await this.ordersService.closeOrder(dto, user);
    return new OrderResponseDto(order);
  }
}
