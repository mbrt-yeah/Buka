import Database from './database';
import Document from './models/document';
import CoverImage from './models/cover-image';
import Author from './models/author';

const bookCoverImage: CoverImage = new CoverImage();

const book1: Document = new Document("Testbook 1");
book1.coverImage = bookCoverImage;

const author1: Author = new Author();
author1.firstname = "Matthias";
author1.surname = "Einbrodt";

const author2: Author = new Author();
author2.firstname = "Luigi";
author2.middlename = "Michaletto";
author2.surname = "Siciliano";

book1.addAuthor(author1);
book1.addAuthor(author2);

const book2: Document = new Document("Testbook 2");
book2.coverImage = bookCoverImage;

const book3: Document = new Document("Testbook 3");
book3.coverImage = bookCoverImage;

const book4: Document = new Document("Testbook 4");
book4.coverImage = bookCoverImage;

export default class DatabaseTestdata {
    public static insert(): Promise<void> {
        const db = Database.instance();

        return new Promise((resolve, reject) => {
            db.documents.insert([book1, book2, book3, book4], (error, documents: Document[]) => {
                if (error) {
                    return reject(error);
                }

                return resolve();
            });
        });
    }
}