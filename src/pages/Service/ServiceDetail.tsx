import React, { useCallback, useEffect, useState } from "react";
import styles from "./ServiceDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getOnlyDate, removeLastItemBreadScrumb } from "../../utils";
import { addValue, changeValue } from "../../store/reducers/breadcrumbSlice";
import {
  getListNumberOfService,
  setFilterNumberList,
  updateIsFilterNumberList,
} from "../../store/reducers/serviceSlice";
import { NumberLevel } from "../../types";
import { Dropdown } from "../../components/Dropdown";
import { DateButton } from "../../components/DateButton";
import { SearchText } from "../../components/SearchText";
import { Pagination } from "../../components/Pagination";
import { ButtonBackAndUpdateIcon } from "../../components/ButtonBackAndUpdate";

const ruleTest = ["Tăng tự động", "Prefix", "Reset mỗi ngày"];

export const ServiceDetail = () => {
  const serviceState = useSelector((state: RootState) => state.service.service);
  const breadScrumState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const listNumberState = useSelector(
    (state: RootState) => state.service.listNumberLevelOfService
  );
  const isFilterNumberList = useSelector(
    (state: RootState) => state.service.isFilterNumberList
  );
  const listNumberFilterState = useSelector(
    (state: RootState) => state.service.filterNumberList
  );
  const dispatch = useDispatch<any>();

  const [filterStatus, setFilterStatus] = useState<string>("");
  const [dateFilter, setDateFilter] = useState({
    dateStart: "",
    dateEnd: "",
  });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    dispatch(getListNumberOfService(serviceState.serviceName));
  }, [dispatch, serviceState.serviceName]);

  const PER_PAGE = 7;
  const offset = currentPage * PER_PAGE;
  const pageCount = () => {
    if (!isFilterNumberList)
      return Math.ceil(listNumberState.length / PER_PAGE);
    return Math.ceil(listNumberFilterState.length / PER_PAGE);
  };

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  const handleBack = () => {
    const res = removeLastItemBreadScrumb(breadScrumState);
    dispatch(changeValue(res.newArray));
  };

  const handleClickUpdate = async () => {
    dispatch(addValue({ title: "Cập nhật", path: "" }));
  };

  const checkStatus = (text: string) => {
    if (text.match("Đang thực hiện")) return `${styles.blue}`;
    if (text.match("Đã hoàn thành")) return `${styles.green}`;
    return `${styles.gray}`;
  };

  const handleFilterStatus = useCallback(
    (status: string) => {
      if (status === "" || status.match("Tất cả"))
        return dispatch(updateIsFilterNumberList(false));
      const res = listNumberState.filter((item) => {
        return item.status.match(status);
      });
      dispatch(updateIsFilterNumberList(true));
      return dispatch(setFilterNumberList(res));
    },
    [listNumberState, dispatch]
  );

  useEffect(() => {
    handleFilterStatus(filterStatus);
  }, [handleFilterStatus, filterStatus]);

  const handleSearchText = (text: string) => {
    if (text === "") return dispatch(updateIsFilterNumberList(false));
    const res = listNumberState.filter((item: NumberLevel) => {
      return item.stt.toString().includes(text);
    });
    dispatch(updateIsFilterNumberList(true));
    return dispatch(setFilterNumberList(res));
  };

  const handleFilterDate = useCallback(
    (value: { dateStart: string; dateEnd: string }) => {
      const dateStart = new Date(value.dateStart);
      const dateEnd = new Date(value.dateEnd);

      const res: NumberLevel[] = [];
      if (value.dateEnd === "" && value.dateStart === "")
        return dispatch(updateIsFilterNumberList(false));
      listNumberState.forEach((item: NumberLevel) => {
        const date = getOnlyDate(item.timeuse, "ahourAndDAte");
        const dateExpire = getOnlyDate(item.timeexpire, "ahourAndDAte");

        if (date === undefined || dateExpire === undefined) return;
        if (
          (dateStart.getDate() <= date.getDate() &&
            dateStart.getMonth() <= date.getMonth() &&
            dateStart.getFullYear() <= date.getFullYear()) ||
          (dateEnd.getDate() >= dateExpire.getDate() &&
            dateEnd.getMonth() >= dateExpire.getMonth() &&
            dateEnd.getFullYear() >= dateExpire.getFullYear())
        ) {
          return res.push(item);
        }
        return;
      });

      if (res.length === 0 && isFilterNumberList) {
        dispatch(setFilterNumberList(res));
      }
      dispatch(updateIsFilterNumberList(true));
      dispatch(setFilterNumberList(res));
    },
    [listNumberState, dispatch, isFilterNumberList]
  );

  useEffect(() => {
    handleFilterDate(dateFilter);
  }, [handleFilterDate, dateFilter]);

  return (
    <div className={styles.detailContainer}>
      <div>
        <div className={styles.serviceInfo}>
          <p>Thông tin dịch vụ</p>

          <div>
            <div>
              <p>Mã dịch vụ:</p>
              <p>{serviceState.serviceCode}</p>
            </div>

            <div>
              <p>Tên dịch vụ:</p>
              <p>{serviceState.serviceName}</p>
            </div>

            <div>
              <p>Mô tả:</p>
              <p>{serviceState.description}</p>
            </div>
          </div>
        </div>

        <div className={styles.serviceRule}>
          <p>Quy tắc cấp số</p>

          <div>
            {ruleTest.map((item) => {
              if (item.match("Tăng tự động")) {
                return (
                  <div key={item}>
                    <p>Tăng tự động:</p>
                    <div className={styles.frameNumber}>0001</div>

                    <p>đến</p>

                    <div className={styles.frameNumber}>9999</div>
                  </div>
                );
              }
              if (item.match("Prefix")) {
                return (
                  <div key={item}>
                    <p>Prefix</p>
                    <div className={styles.frameNumber}>0001</div>
                  </div>
                );
              }
              if (item.match("Surfix")) {
                return (
                  <div key={item}>
                    <p>Surfix</p>
                    <div className={styles.frameNumber}>0001</div>
                  </div>
                );
              }
              if (item.match("Reset mỗi ngày")) {
                return (
                  <div key={item}>
                    <p>Reset mỗi ngày</p>
                  </div>
                );
              }
            })}
          </div>

          <div>
            <p>Ví dụ: 201-0001</p>
          </div>
        </div>
      </div>

      <div className={styles.table}>
        <div className={styles.filterBtn}>
          <div>
            <p>Trạng thái</p>
            <Dropdown
              data={["Tất cả", "Đã hoàn thành", "Đang thực hiện", "Vắng"]}
              setWidth="130"
              text="Tất cả"
              value={filterStatus}
              onClick={(value) => setFilterStatus(value)}
            />
          </div>

          <div>
            <p>Chọn thời gian</p>
            <DateButton onClick={(value) => setDateFilter(value)} />
          </div>

          <div>
            <p>Từ khóa</p>
            <SearchText
              setWidth={150}
              onFind={(text) => handleSearchText(text)}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Số thứ tự</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {!isFilterNumberList &&
              listNumberState.slice(offset, offset + PER_PAGE).map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.stt}</td>
                    {/* <td>{displayStatusRow(item.status)}</td> */}
                    <td className={styles.status}>
                      <div>
                        <div className={checkStatus(item.status)} />
                        <p>
                          {/* {displayStatusRow( */}
                          {item.status}
                          {/*// ) */}
                        </p>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {isFilterNumberList &&
              listNumberFilterState
                .slice(offset, offset + PER_PAGE)
                .map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.stt}</td>
                      {/* <td>{displayStatusRow(item.status)}</td> */}
                      <td className={styles.status}>
                        <div>
                          <div className={checkStatus(item.status)} />
                          <p>
                            {/* {displayStatusRow( */}
                            {item.status}
                            {/*// ) */}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <Pagination
            pageCount={pageCount()}
            handlePageClick={handlePageClick}
          />
        </div>
      </div>

      <div>
        <ButtonBackAndUpdateIcon
          text="Cập nhật danh sách"
          onClick={() => handleClickUpdate()}
          onClickBack={() => handleBack()}
        />
      </div>
    </div>
  );
};
