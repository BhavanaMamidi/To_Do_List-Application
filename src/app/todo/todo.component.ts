import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ITask } from '../model/task';


@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todoForm !: FormGroup;
  tasks : ITask [] = [];
  inProgress : ITask [] = [];
  done : ITask [] = [];
  updateIndex !: any;
  iseditEnabled: boolean = false;

  constructor(private fb: FormBuilder){}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item : ["",Validators.required]
    })

    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks != null){
      this.tasks = JSON.parse(storedTasks);
    }

    const storedinProgressTasks = localStorage.getItem("inProgress");
    if (storedinProgressTasks != null){
      this.inProgress = JSON.parse(storedinProgressTasks);
    }

    const storeddoneTasks = localStorage.getItem("done");
    if (storeddoneTasks != null){
      this.done = JSON.parse(storeddoneTasks);
    }
}

  private saveTasksToStorage() : void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private saveinProgressTasksToStorage() : void {
    localStorage.setItem('inProgress', JSON.stringify(this.inProgress));
  }

  private savedoneTasksToStorage() : void {
    localStorage.setItem('done', JSON.stringify(this.done));
  }



  addTask(){
    this.tasks.push({
      description: this.todoForm.value.item,
      done: false
    });
    this.saveTasksToStorage();
    this.todoForm.reset();
  }

  editTask(item :ITask, i : number){
    this.todoForm.controls['item'].setValue(item.description);
    this.updateIndex = i;
    this.saveTasksToStorage();
    this.iseditEnabled = true;
  }

  updateTask(){
    this.tasks[this.updateIndex].description = this.todoForm.value.item;
    this.saveTasksToStorage();
    this.tasks[this.updateIndex].done = false;
    this.todoForm.reset();
    this.updateIndex = undefined;
    this.iseditEnabled = false;
  }

  deleteTask(i: number){
    this.tasks.splice(i,1);
    this.saveTasksToStorage();
  }

  deleteinProgress(i: number){
    this.inProgress.splice(i,1);
  }

  deletedone(i: number){
    this.done.splice(i,1);
  }


  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.saveTasksToStorage();
    this.saveinProgressTasksToStorage();
    this.savedoneTasksToStorage();
  }

}
