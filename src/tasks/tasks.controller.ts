import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation pipe';
import { Task} from './task.entity';
import { TaskStatus } from './task-status.enum'
import { TasksService } from './tasks.service';
import { GetTaskFilterDto } from './dto/get-task-filteer.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService){}
    @Get()
    getAllTasks(
      @Query(ValidationPipe) filterDto: GetTaskFilterDto,
      @GetUser() user: User
      ) {
      return this.taskService.getTask(filterDto, user)
    }
    @Get('/:id')
    getTaskById(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User
      ): Promise<Task>{
        return this.taskService.getTaskById(id, user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
      @Body() createTaskDto: CreateTaskDto,
      @GetUser() user: User,
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }
    @Delete('/:id')
    deleteTask(
      @Param('id', ParseIntPipe) id: number,
      @GetUser() user: User,
      ): Promise<void> {
        return this.taskService.deleteTask(id, user)
    }
    @Patch('/:id/status')
    updateTaskStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('status', TaskStatusValidationPipe) status: TaskStatus,
      @GetUser() user: User
    ): Promise<Task> {
      return this.taskService.updateTaskStatus(id, status, user)
    }
}
