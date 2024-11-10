import Book from "../models"

export abstract class BooksRepository {
    abstract createBook(book: any) : Promise<any>
    abstract getBook(id: string) : Promise<any>
    abstract getBooks() : Promise<any>
    abstract createBook(book: typeof Book)
    abstract updateBook(id: string, book: typeof Book) : Promise<any>
    abstract deleteBook(id: string) : Promise<any>
}