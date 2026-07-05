import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { TaskQueryDto } from './dto/task-query.dto';

@Injectable()
export class TasksService {
  async findAllAdmin() {
    return this.prisma.task.findMany({ include: { user: true } });
  }
  private prisma = new PrismaClient();

  async create(createTaskDto: CreateTaskDto, userId: number) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
  }

  async findAll(userId: number, query: TaskQueryDto) {
    const { page, limit, search, completed } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (search) where.title = { contains: search, mode: 'insensitive' };
    if (completed !== undefined) where.completed = completed;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: +id },
    });

    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id: +id },
      data: updateTaskDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.task.delete({
      where: { id: +id },
    });

    return { message: 'Task deleted successfully' };
  }

  async clearAll() {
    return this.prisma.task.deleteMany();
  }
}
