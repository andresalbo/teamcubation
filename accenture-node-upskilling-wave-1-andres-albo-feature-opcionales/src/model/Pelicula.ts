import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Calificacion } from "./Calificacion"
import { Recomendacion } from "./Recomendacion"

@Entity()
export class Pelicula {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    titulo: string
    @Column()
    director: string
    @Column()
    anio: Date
    @Column()
    genero: string
    @Column()
    sinopsis: string

    @OneToMany(() => Calificacion, (calificacion) => calificacion.pelicula)
    calificaciones: Calificacion[]
    @OneToMany(() => Recomendacion, (recomendacion) => recomendacion.pelicula)
    recomendaciones: Recomendacion[]

    constructor(id: number, titulo: string, director: string, anio: Date, genero: string, sinopsis: string,
        calificaciones: Calificacion[],
        recomendaciones: Recomendacion[]
    ) {
        this.anio = anio;
        this.director = director
        this.genero = genero
        this.sinopsis = sinopsis
        this.titulo = titulo
        this.id = id
        this.recomendaciones = recomendaciones
        this.calificaciones = calificaciones
    }
}