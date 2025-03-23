import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BearerTokenAuth } from '../auth/decorators/bearer-token-auth.decorator';
import { EUserRole } from '../users/types/user.enum';
import { CloseOrderDto } from './dto/close-order.dto';
import { CompleteOrderDto } from './dto/complete-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor() {}

  @Get()
  @ApiOperation({ summary: "Get user's orders (paginated)" })
  @ApiResponse({ type: OrderResponseDto, isArray: true })
  @BearerTokenAuth()
  async getOrders() {}

  @Get('list')
  @ApiOperation({ summary: 'Get all orders (paginated)' })
  @ApiResponse({ type: OrderResponseDto, isArray: true })
  @BearerTokenAuth(EUserRole.ADMIN)
  async getOrdersList() {}

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ type: OrderResponseDto })
  @BearerTokenAuth()
  async getOrder() {}

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
  async createOrder(@Body() dto: CreateOrderDto) {
    return dto;
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete an order by ID' })
  @ApiResponse({ type: OrderResponseDto })
  @BearerTokenAuth()
  async completeOrder(@Body() dto: CompleteOrderDto) {
    return dto;
  }

  @Post('close')
  @ApiOperation({ summary: 'Close an order by ID' })
  @ApiResponse({ type: OrderResponseDto })
  @BearerTokenAuth()
  async cancelOrder(@Body() dto: CloseOrderDto) {
    return dto;
  }
}
