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
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { UpdateTaskDto } from './dto/update-tasks.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles';
import { TaskQueryDto } from './dto/task-query.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  @Post()
  @ApiResponse({ status: 201, description: 'create task' })
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }
  @Get()
  findAll(@Query() query: TaskQueryDto, @Req() req: any) {
    return this.tasksService.findAll(req.user.userId, query);
  }
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  findAllAdmin() {
    return this.tasksService.findAllAdmin();
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
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  createWithFile(
    @Body() createTaskDto: CreateTaskDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    console.log('آپلود فایل:', file);
    return this.tasksService.create(createTaskDto, req.user.userId);
  }
}
