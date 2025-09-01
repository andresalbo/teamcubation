import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Pelicula } from "./Pelicula"
import { Usuario } from "./Usuario"

@Entity()
export class Calificacion {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    puntaje: number

    @ManyToOne(()=> Pelicula, { onDelete: "CASCADE" })
    pelicula: Pelicula

    @OneToOne(()=> Usuario)
    @JoinColumn()
    usuario!: Usuario

    constructor(id: number,
        puntaje: number,
        pelicula: Pelicula,
        usuario: Usuario
    ) {
        this.id = id
        this.puntaje = puntaje
        this.usuario = usuario
        this.pelicula = pelicula
    }
}