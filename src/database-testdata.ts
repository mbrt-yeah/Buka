import Database from './database';
import Book from './models/book';
import CoverImage from './models/cover-image';
import BOOK_COVER_DEFAULT from './constants/book-cover-default';

const bookCoverImage: CoverImage = new CoverImage();
bookCoverImage.fileContent = BOOK_COVER_DEFAULT;

const book1: Book = new Book("Testbook 1");
book1.coverImage = bookCoverImage;

const book2: Book = new Book("Testbook 2");
book2.coverImage = bookCoverImage;

const book3: Book = new Book("Testbook 3");
book3.coverImage = bookCoverImage;

const book4: Book = new Book("Testbook 4");
book4.coverImage = bookCoverImage;

export default class DatabaseTestdata {
    public static insert(): Promise<void> {
        const db = Database.instance();

        return new Promise((resolve, reject) => {
            db.books.insert([book1, book2, book3, book4], (error, documents: Book[]) => {
                if (error) {
                    return reject(error);
                }

                return resolve();
            });
        });
    }
}