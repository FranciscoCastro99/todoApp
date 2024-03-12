export interface Task {
    id:number;
    title: string;
    completed: boolean;
    editing?: boolean; //=> si es opcional se pone el signo de pregunta
}