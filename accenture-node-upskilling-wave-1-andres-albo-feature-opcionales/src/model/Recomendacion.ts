import { Pelicula } from "./Pelicula"
import { Usuario } from "./Usuario"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Recomendacion {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    motivo: string

    @ManyToOne(()=>Pelicula, pelicula => pelicula.recomendaciones, { onDelete: "CASCADE" })
    pelicula: Pelicula

    @OneToOne(()=>Usuario)
    @JoinColumn()
    usuario!:Usuario

    constructor(id: number, motivo: string, pelicula: Pelicula,
        usuario: Usuario) {
        this.motivo = motivo
        this.id = id
        this.pelicula = pelicula
        this.usuario = usuario
    }
}