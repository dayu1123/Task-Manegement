import { Injectable,NotFoundException } from '@nestjs/common';
// import { Task } from './task.model';
import {TaskStatus} from './task-status.enum'
import { CreateTaskDto } from './dto/create-task.dto'
import { v4 as uuidv4 }from 'uuid';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { GetTaskFilterDto } from './dto/get-task-filteer.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ){}
  async getTask(fiterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.taskRepository.getTask(fiterDto)
  }
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if(!found){
      throw new NotFoundException('Task does not exist')
    }

    return found;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto)
  }
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id)
    if(result.affected === 0){
      throw new NotFoundException('Task does not exist')
    }
  }
  async updateTaskStatus(id: number, status: TaskStatus) {
    const task = await this.getTaskById(id)
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
