import React from 'react';
import ReactPaginate from "react-paginate";
import styles from './pagination.module.css'

type PaginationType = {
    pageCount: number,
    handlePageClick: (data: any) => void,
}

export const Pagination = (props: PaginationType) => {
    return (
        <ReactPaginate
            previousLabel={""}
            nextLabel={""}
            pageCount={props.pageCount}
            onPageChange={props.handlePageClick}
            previousLinkClassName={`${styles.previous_page}`}
            containerClassName={`${styles.pagination}`}
            nextLinkClassName={`${styles.next_page}`}
            disabledClassName={"pagination_disabled"}
            activeClassName={`${styles.active}`}
        />
    )
}
