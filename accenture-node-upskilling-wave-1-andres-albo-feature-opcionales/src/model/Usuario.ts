import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id:number

    @Column()
    nombre:string

    @Column()
    email:string

    @Column()
    password!:string

    constructor(id:number, nombre:string, email:string) {
        this.email=email;
        this.nombre=nombre
        this.id=id
    }


}