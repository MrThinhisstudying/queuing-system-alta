import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styles from "./service.module.css";
import {
  setFilterServices,
  setService,
  updateIsFilterService,
} from "../../store/reducers/serviceSlice";
import { checkTableHeader } from "../../utils";
import { addValue } from "../../store/reducers/breadcrumbSlice";
import { service } from "../../types";
import { Dropdown } from "../../components/Dropdown";
import { DateButton } from "../../components/DateButton";
import { SearchText } from "../../components/SearchText";
import { Pagination } from "../../components/Pagination";
import { ButtonAdd } from "../../components/ButtonAdd";
import { ServiceInfo } from "./ServiceInfo";
import { ServiceDetail } from "./ServiceDetail";

const tableHeader = [
  "Mã dịch vụ",
  "Tên dịch vụ",
  "Mô tả",
  "Trạng thái hoạt động",
  "nút 1",
  "nút 2",
];

export const Service = () => {
  const breadScrumbState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const servicesState = useSelector(
    (state: RootState) => state.service.services
  );
  const isFilterState = useSelector(
    (state: RootState) => state.service.isFilter
  );
  const servicesFilterState = useSelector(
    (state: RootState) => state.service.filterServices
  );
  const [displayPage, setDisplayPage] = useState<string>("");

  const [dateFilter, setDateFilter] = useState({
    dateStart: "",
    dateEnd: "",
  });
  const dispatch = useDispatch<any>();

  const [currentPage, setCurrentPage] = useState(0);

  const PER_PAGE = 8;
  const offset = currentPage * PER_PAGE;
  const pageCount = () => {
    if (servicesFilterState.length === 0)
      return Math.ceil(servicesState.length / PER_PAGE);
    return Math.ceil(servicesFilterState.length / PER_PAGE);
  };

  useEffect(() => {
    const getLocation = breadScrumbState[breadScrumbState.length - 1] as {
      title: string;
      path: string;
    };
    if (getLocation !== undefined) return setDisplayPage(getLocation.title);
  }, [breadScrumbState, dispatch]);

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  const checkStatus = (text: string) => {
    if (text === "Hoạt động" || text === "Kết nối") return `${styles.green}`;
    return `${styles.red}`;
  };

  const handleClick = (type: string, data: service) => {
    let item = { title: "", path: "" } as { title: string; path: string };
    if (type.includes("Chi tiết")) {
      item.title = "Chi tiết";
    }
    if (type.includes("Cập nhật")) {
      item.title = "Cập nhật";
    }
    dispatch(setService(data));
    dispatch(addValue(item));
  };

  const handleFilter = (value: string) => {
    let res: service[] = [];

    if (!value.match("Tất cả")) {
      res = servicesState.filter((item) => {
        return item.activeStatus.match(value);
      });
      dispatch(setFilterServices(res));
      return dispatch(updateIsFilterService(true));
    }
    if (value === "Tất cả") {
      console.log("run");

      return dispatch(updateIsFilterService(false));
    }
  };

  const handleFilterDate = useCallback(
    (value: { dateStart: string; dateEnd: string }) => {
      const dateStart = new Date(value.dateStart);
      const dateEnd = new Date(value.dateEnd);

      const res: service[] = [];
      servicesState.forEach((item: service) => {
        const date = new Date(item.dateCreate);
        if (
          (dateStart.getDate() <= date.getDate() &&
            dateStart.getMonth() <= date.getMonth() &&
            dateStart.getFullYear() <= date.getFullYear()) ||
          (dateEnd.getDate() >= date.getDate() &&
            dateEnd.getMonth() >= date.getMonth() &&
            dateEnd.getFullYear() >= date.getFullYear())
        ) {
          return res.push(item);
        }
        return;
      });

      if (value.dateEnd === "" && value.dateStart === "") return;
      if (res.length === 0 && isFilterState) {
        dispatch(setFilterServices(res));
      }
      dispatch(updateIsFilterService(true));
      dispatch(setFilterServices(res));
    },
    [servicesState, dispatch, isFilterState]
  );

  useEffect(() => {
    handleFilterDate(dateFilter);
  }, [handleFilterDate, dateFilter]);

  const handleSearchText = (value: string) => {
    let res: service[] = [];
    if (value !== "") {
      res = servicesState.filter((item) => {
        return item.serviceName.includes(value);
      });
      dispatch(updateIsFilterService(true));
      return dispatch(setFilterServices(res));
    } else {
      dispatch(updateIsFilterService(false));
    }
  };

  const handleAdd = () => {
    dispatch(addValue({ title: "Thêm dịch vụ", path: "" }));
  };
  return (
    <div className={styles.serviceContainer}>
      <h2>Quản lý dịch vụ</h2>
      {displayPage === "Danh sách dịch vụ" && (
        <React.Fragment>
          <div>
            <div className={styles.filterbtn}>
              <div>
                <div>
                  <p>Trạng thái hoạt động</p>
                  <Dropdown
                    data={["Tất cả", "Hoạt động", "Ngưng hoạt động"]}
                    value=""
                    text="Tất cả"
                    setWidth="200"
                    onClick={(value) => handleFilter(value)}
                  />
                </div>

                <div>
                  <p>Chọn thời gian</p>
                  <DateButton onClick={(value) => setDateFilter(value)} />
                </div>
              </div>

              <div style={{ marginRight: "80px" }}>
                <p>Từ khóa</p>
                <SearchText
                  setWidth={300}
                  onFind={(text) => handleSearchText(text)}
                />
              </div>
            </div>

            <div className={styles.body}>
              <div>
                <table>
                  <thead>
                    <tr>
                      {tableHeader.map((item) => (
                        <th key={item}>{checkTableHeader(item) ? item : ""}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!isFilterState &&
                      servicesState
                        .slice(offset, offset + PER_PAGE)
                        .map((item) => (
                          <tr key={item.id}>
                            <td>{item.serviceCode}</td>
                            <td>{item.serviceName}</td>
                            <td>{item.description}</td>
                            <td className={styles.status}>
                              <div>
                                <div
                                  className={checkStatus(item.activeStatus)}
                                />
                                <p>{item.activeStatus}</p>
                              </div>
                            </td>
                            <td
                              className={styles.btn}
                              onClick={() => handleClick("Chi tiết", item)}
                            >
                              Chi tiết
                            </td>
                            <td
                              className={styles.btn}
                              onClick={() => handleClick("Cập nhật", item)}
                            >
                              Cập nhật
                            </td>
                          </tr>
                        ))}

                    {isFilterState &&
                      servicesFilterState
                        .slice(offset, offset + PER_PAGE)
                        .map((item) => (
                          <tr key={item.id}>
                            <td>{item.serviceCode}</td>
                            <td>{item.serviceName}</td>
                            <td>{item.description}</td>
                            <td className={styles.status}>
                              <div>
                                <div
                                  className={checkStatus(item.activeStatus)}
                                />
                                <p>{item.activeStatus}</p>
                              </div>
                            </td>
                            <td
                              className={styles.btn}
                              onClick={() => handleClick("Chi tiết", item)}
                            >
                              Chi tiết
                            </td>
                            <td
                              className={styles.btn}
                              onClick={() => handleClick("Cập nhật", item)}
                            >
                              Cập nhật
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>

                <div>
                  <Pagination
                    pageCount={pageCount()}
                    handlePageClick={handlePageClick}
                  />
                </div>
              </div>

              <ButtonAdd text="Thêm dịch vụ" onClick={() => handleAdd()} />
            </div>
          </div>
        </React.Fragment>
      )}

      {displayPage === "Thêm dịch vụ" && <ServiceInfo />}
      {displayPage === "Chi tiết" && <ServiceDetail />}
      {displayPage === "Cập nhật" && <ServiceInfo />}
    </div>
  );
};
