export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
    pageable: Pageable;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}


export const newPage: Page<any> = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    pageable: {
        sort: {
            empty: true,
            sorted: false,
            unsorted: true
        },
        offset: 0,
        pageNumber: 0,
        pageSize: 10,
        paged: true,
        unpaged: false
    },
    size: 10,
    number: 0,
    first: true,
    last: true,
    empty: true
};
