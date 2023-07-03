import React, { useCallback, useEffect, useState } from "react";
import styles from "./history.module.css";
import { history } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  getAllHistorys,
  updateHistorysFilter,
  updateIsFilter,
} from "../../store/reducers/historySlice";
import { getOnlyDate } from "../../utils";
import { DateButton } from "../../components/DateButton";
import { SearchText } from "../../components/SearchText";
import { Pagination } from "../../components/Pagination";

export const History = () => {
  const historyState = useSelector((state: RootState) => state.history.history);
  const historysFilterState = useSelector(
    (state: RootState) => state.history.historyFilter
  );
  const isFilterState = useSelector(
    (state: RootState) => state.history.isFilter
  );

  const [dateFilter, setDateFilter] = useState({
    dateStart: "",
    dateEnd: "",
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch<any>();
  const PER_PAGE = 8;
  const offset = currentPage * PER_PAGE;
  const pageCount = () => {
    if (historysFilterState.length === 0)
      return Math.ceil(historyState.length / PER_PAGE);
    return Math.ceil(historysFilterState.length / PER_PAGE);
  };

  useEffect(() => {
    dispatch(getAllHistorys());
  }, [dispatch]);

  const handleFilterDate = useCallback(
    (value: { dateStart: string; dateEnd: string }) => {
      const dateStart = new Date(value.dateStart);
      const dateEnd = new Date(value.dateEnd);

      if (value.dateEnd === "" && value.dateStart === "") return;
      const res: history[] = [];
      historyState.forEach((item: history) => {
        const date = getOnlyDate(item.time, "dateAndAhour");

        if (date === undefined) return;
        if (
          dateStart.getDate() <= date.getDate() &&
          dateStart.getMonth() <= date.getMonth() &&
          dateStart.getFullYear() <= date.getFullYear() &&
          dateEnd.getDate() >= date.getDate() &&
          dateEnd.getMonth() >= date.getMonth() &&
          dateEnd.getFullYear() >= date.getFullYear()
        ) {
          return res.push(item);
        }
        return;
      });

      if (res.length === 0) dispatch(updateIsFilter(true));
      return dispatch(updateHistorysFilter(res));
    },
    [historyState, dispatch]
  );

  useEffect(() => {
    handleFilterDate(dateFilter);
  }, [handleFilterDate, dateFilter]);

  const handleSearchText = useCallback(
    (text: string) => {
      if (text === "") return dispatch(updateIsFilter(false));
      const res = historyState.filter((item) => {
        return item.username.includes(text) || item.content.includes(text);
      });
      dispatch(updateIsFilter(true));
      dispatch(updateHistorysFilter(res));
    },
    [dispatch, historyState]
  );

  useEffect(() => {
    handleSearchText(searchText);
  }, [handleSearchText, searchText]);

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  return (
    <div>
      <div className={styles.filterBtn}>
        <div>
          <p>Chọn thời gian</p>
          <DateButton onClick={(value) => setDateFilter(value)} />
        </div>

        <div>
          <p>Từ khóa</p>
          <SearchText setWidth={300} onFind={(text) => setSearchText(text)} />
        </div>
      </div>

      <div className={styles.body}>
        <table>
          <thead>
            <tr>
              <th>Tên đăng nhập</th>
              <th>Thời gian tác động</th>
              <th>IP thực hiện</th>
              <th>Thao tác thực hiện</th>
            </tr>
          </thead>

          <tbody>
            {!isFilterState &&
              historyState
                .slice(offset, offset + PER_PAGE)
                .map((item: history) => (
                  <tr key={item.id}>
                    <td>{item.username}</td>
                    <td>{item.time}</td>
                    <td>{item.ip}</td>
                    <td>{item.content}</td>
                  </tr>
                ))}

            {isFilterState &&
              historysFilterState
                .slice(offset, offset + PER_PAGE)
                .map((item: history) => (
                  <tr key={item.id}>
                    <td>{item.username}</td>
                    <td>{item.time}</td>
                    <td>{item.ip}</td>
                    <td>{item.content}</td>
                  </tr>
                ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <Pagination
            pageCount={pageCount()}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>
    </div>
  );
};
