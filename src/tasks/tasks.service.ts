import { Injectable,NotFoundException } from '@nestjs/common';
// import { Task } from './task.model';
import {TaskStatus} from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filteer.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ){}
  async getTask(
    fiterDto: GetTaskFilterDto,
    user: User
    ): Promise<Task[]> {
    return this.taskRepository.getTask(fiterDto, user)
  }
  async getTaskById(
    id: number,
    user: User,
    ): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: {id, userId: user.id} });

    if(!found){
      throw new NotFoundException('Task does not exist')
    }

    return found;
  }
  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user)
  }
  async deleteTask(
    id: number,
    user: User,
    ): Promise<void> {
      const result = await this.taskRepository.delete({id, userId: user.id})
    if(result.affected === 0){
      throw new NotFoundException('Task does not exist')
    }
  }
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User
    ): Promise<Task> {
    const task = await this.getTaskById(id, user)
    task.status = status
    await task.save()

    return task
  }
  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks  
  // }
  // getTaskById(id: string): Task{
  //   const found = this.tasks.find(task => task.id === id)
  //   if(!found){
  //     throw new NotFoundException('Task does not exist')
  //   }
  //   return found
  // }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuidv4(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }
  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id)
  //   this.tasks = this.tasks.filter(task => task.id !== found.id)
  // }
  // updateTaskStatus(id: string, status: TaskStatus){
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
