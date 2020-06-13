import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import to from 'await-to-js';

import Book from '@/models/book';
import BOOK_LIST_ACTION_TYPE from './book-list-action-type';
import BOOK_LIST_GETTER_TYPE from './book-list-getter-type';
import BOOK_LIST_MUTATION_TYPE from './book-list-mutation-type';
import BookRepository from '@/repositories/book-repository';

@Module
export default class BookListStoreModule extends VuexModule {
    private books: Book[] = [];

    get [BOOK_LIST_GETTER_TYPE.BOOKS_TOTAL](): number {
        return this.books.length;
    }

    @Mutation
    public [BOOK_LIST_MUTATION_TYPE.SET_BOOKS](books: Book[]) {
        this.books = books;
    }

    @Action({ commit: BOOK_LIST_MUTATION_TYPE.SET_BOOKS })
    public async [BOOK_LIST_ACTION_TYPE.READ_ALL]() {
        const [readAllError, readAllResult] = await to<Book[]>( BookRepository.readAll() );

        if (readAllError) {
            // TODO figure out what to do here
        }

        return readAllResult;
    }
}