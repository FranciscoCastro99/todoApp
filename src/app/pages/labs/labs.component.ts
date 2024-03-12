import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css',
})
export class LabsComponent {
  welcome = 'Bienvenidos a mi primer proyecto de angular';
  tasks = signal([
    'instalar angular CLI',
    'crear proyecto',
    'crear componentes',
  ]);

  name = signal('Jose');
  age = 24;
  disabled = 'true';
  img =
    'https://lafrikileria.com/blog/wp-content/uploads/2023/05/serie-no-universo-harry-potter-pode-ser-realidade-confira-reproducao-hbo-max-759x506.jpg';

  person = signal({
      nombre:'Francisco',
      edad: 5,
      imagen:'https://lafrikileria.com/blog/wp-content/uploads/2023/05/serie-no-universo-harry-potter-pode-ser-realidade-confira-reproducao-hbo-max-759x506.jpg',
  });


  colorCtrl = new FormControl();
  widthCtrl = new FormControl(50,{
    nonNullable: true,
  });

  nameCtrl = new FormControl('francisco', {
    nonNullable: true,
    validators:[
      Validators.required,
      Validators.minLength(3)
    ]
  });


  constructor() {
    this.colorCtrl.valueChanges.subscribe(value => {
      console.log(value);
    })
  }


  clickHandler() {
    alert('hola');
  }

  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.name.set(newValue);
    console.log(event); //se pone este para poder ver el evento que se hace cada vez que se cambie un valor
  }

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.log(input.value);
  }

  changeAge(event: Event) {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        edad: parseInt(newValue, 10)
      }
    });
  }

  changeName(event: Event){
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    this.person.update(prevState => {
      return {
        ...prevState,
        nombre: newValue
      }
    });
  }

}
