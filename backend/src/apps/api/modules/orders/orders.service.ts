import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PaginateQuery, paginate, Paginated } from 'nestjs-paginate';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { CloseOrderDto } from './dto/close-order.dto';
import { OrdersRepository } from 'src/common/database/repositories/order.repository';
import { OrderItemsRepository } from 'src/common/database/repositories/order-item.repository';
import { OrderTransactionsRepository } from 'src/common/database/repositories/order-transaction.repository';
import { UserEntity } from '../users/entities/user.entity';
import { EOrderStatus } from './types/order.enum';
import { In } from 'typeorm';
import { OrderItemEntity } from './entities/order-item.entity';
import { BooksRepository } from 'src/common/database/repositories/books.repository';
import { ORDERS_PAGINATION } from './constants/pagination';
import { EUserRole } from '../users/types/user.enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemRepository: OrderItemsRepository,
    private readonly orderTransactionRepository: OrderTransactionsRepository,
    private readonly booksRepository: BooksRepository,
  ) {}

  async getUserOrders(
    query: PaginateQuery,
    user: UserEntity,
  ): Promise<Paginated<OrderEntity>> {
    return paginate(query, this.ordersRepository.getRepository(), {
      ...ORDERS_PAGINATION,
      where: {
        orderedBy: { id: user.id },
      },
    });
  }

  async getAllOrders(query: PaginateQuery): Promise<Paginated<OrderEntity>> {
    return paginate(
      query,
      this.ordersRepository.getRepository(),
      ORDERS_PAGINATION,
    );
  }

  async getOrderById(id: string): Promise<OrderEntity> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ORDERS_PAGINATION.relations,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createOrder(
    dto: CreateOrderDto,
    user: UserEntity,
  ): Promise<OrderEntity> {
    const existingOrder = await this.ordersRepository.findOne({
      where: {
        orderedBy: { id: user.id },
        items: {
          bookId: In(dto.bookIds),
        },
      },
    });

    if (existingOrder && existingOrder.status === EOrderStatus.PENDING) {
      throw new ConflictException(
        'You already have an open order for one or more of selected books',
      );
    }

    const orderItems: OrderItemEntity[] = [];
    for (const bookId of dto.bookIds) {
      const book = await this.booksRepository.findOne({
        where: { id: bookId },
        loadEagerRelations: false,
      });

      if (!book) {
        throw new BadRequestException(`Book with id ${bookId} not found`);
      }

      orderItems.push(
        this.orderItemRepository.create({
          book,
          priceInETH: book.priceInETH,
        }),
      );
    }

    const order = new OrderEntity();
    order.items = orderItems;
    order.orderedBy = user;
    order.orderedAt = new Date();
    order.status = EOrderStatus.PENDING;
    await this.ordersRepository.save(order);
    return order;
  }

  async closeOrder(dto: CloseOrderDto, user: UserEntity): Promise<OrderEntity> {
    const order = await this.getOrderById(dto.orderId);
    if (order.status !== EOrderStatus.PENDING) {
      throw new ConflictException('Order is not open');
    }

    if (order.orderedBy.id !== user.id && user.role !== EUserRole.ADMIN) {
      throw new ForbiddenException(
        'You do not have permission to close this order',
      );
    }

    order.status = EOrderStatus.CANCELLED;
    order.closeReason = dto.reason;
    order.orderCompletedOrClosedAt = new Date();

    await this.ordersRepository.save(order);
    return order;
  }
}
