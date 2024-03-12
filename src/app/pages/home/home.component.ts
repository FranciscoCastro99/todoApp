import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  tasks = signal<Task[]>([]);

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      // Validators.pattern('') => esta es otra forma de validar los espacios o restringir ciertas cosas
    ]
  });

  filter = signal<'all' | 'Pending' | 'Completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if(filter === 'Pending'){
      return tasks.filter(task => !task.completed)
    }
    if( filter === 'Completed'){
      return tasks.filter(task => task.completed)
    }
    return tasks;
  })

  injector = inject(Injector);

  ngOnInit(){
    const storage = localStorage.getItem('tasks');
    if(storage){
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTask();
  }
  trackTask(){
    effect(() =>{
      const tasks = this.tasks();
      console.log(tasks)
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, {injector: this.injector});
  }

  changeHandler(){
    if(this.newTaskCtrl.valid){
      const value = this.newTaskCtrl.value.trim(); //=> el trim es quitar espacios al inicio y al final de cada string
      if(value !== ''){
        this.addTask(value); 
        this.newTaskCtrl.setValue('');
      }
    }
  }

// changeHandler es la funcion encargada del input

  // changeHandler(event: Event){
  //   const input = event.target as HTMLInputElement;
  //   const newTasks = input.value;
  //   this.addTask(newTasks); //aqui estamos trayendo la funcion de addTask y le estamos pasando la funcion a newTask que es la variable
  // }
  // se comenta esta funcion debido a que se debe modificar porque el newTaskCtrl tendra el valor y por ende ya no necesitamos el evento

  // Esta es la funcion de Agregar tarea con base a un titulo que es el que vamos a recibir
  addTask(title:string){
    const newTasks = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) =>  [...tasks, newTasks]);
    //se hace una actualización del array de tareas donde el array de tareas se le agregará un nuevo array de tareas con una estructura 
  }

  //funcion para eliminar un item
  deleteTask(index:number){
    this.tasks.update((tasks) => tasks.filter((_tasks, position)=> position !== index));
  } // se usa filter para hacer un filtro de lo que se quiere segun el array de tareas y la posicion donde la posicion debe de ser diferente al index

  UpdateTask(index:number){
    this.tasks.update((tasks) => {
        return tasks.map((tasks, position) => {
          if (position === index){
            return {
              ...tasks,
              completed:!tasks.completed
            }
          }
          return tasks;
        })
    })
  }

  updateTaskEditingMode(index:number){
    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index){
          return {
            ...task,
            editing:true
          }
        }
        return {
          ...task,
          editing:false
        };
      })
  })
  };

  updateTaskText(index:number, event:Event){
    const input = event.target as HTMLInputElement;
    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index){
          return {
            ...task,
            title: input.value,
            editing: false

          }
        }
        return task;
      })
  })
  }

  changeFilter(filter:'all' | 'Pending' | 'Completed'){
    this.filter.set(filter);
  }

}
