import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';

@Injectable()
export class TasksService {
  private prisma = new PrismaClient();

  async create(createTaskDto: CreateTaskDto, userId: number) {
    return this.prisma.task.create({
      data: { ...createTaskDto, userId },
    });
  }

  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
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
