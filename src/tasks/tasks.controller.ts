import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'create task' })
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(createTaskDto, req.userId);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.tasksService.findAll(req.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id.toString());
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id.toString(), updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id.toString());
  }
}
