import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation pipe';
import { Task} from './task.entity';
import { TaskStatus } from './task-status.enum'
import { TasksService } from './tasks.service';
import { GetTaskFilterDto } from './dto/get-task-filteer.dto';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService){}
    @Get()
    getAllTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto) {
      return this.taskService.getTask(filterDto)
    }
    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task>{
      return this.taskService.getTaskById(id)
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskService.createTask(createTaskDto);
    }
    @Delete('/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
      return this.taskService.deleteTask(id)
    }
    @Patch('/:id/status')
    updateTaskStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    ): Promise<Task> {
      return this.taskService.updateTaskStatus(id, status)
    }
}