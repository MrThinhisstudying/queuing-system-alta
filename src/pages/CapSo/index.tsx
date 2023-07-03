import React, { useCallback, useEffect, useState } from "react";
import styles from "./capso.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addValue } from "../../store/reducers/breadcrumbSlice";
import { NewNumberLevel } from "./NewNumberLevel";
import { Detail } from "./Detail";
import {
  addNumberLevel,
  getAllNumberLevels,
  setNumberLevelsFilter,
  updateIsFilterNumber,
} from "../../store/reducers/numberLevelSlice";
import { NumberLevel, device } from "../../types";
import { getOnlyDate } from "../../utils";
import { Dropdown } from "../../components/Dropdown";
import { DateButton } from "../../components/DateButton";
import { SearchText } from "../../components/SearchText";
import { Pagination } from "../../components/Pagination";
import { ButtonAdd } from "../../components/ButtonAdd";

type IsDuplicate = (a: device, b: device) => boolean;

export const CapSo = () => {
  const breadcrumbState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const numberLevelsState = useSelector(
    (state: RootState) => state.numberLevel.numberLevels
  );
  const servicesState = useSelector(
    (state: RootState) => state.service.services
  );
  const isFilterNumberState = useSelector(
    (state: RootState) => state.numberLevel.isFilterNumber
  );
  const numberLevelsFilterState = useSelector(
    (state: RootState) => state.numberLevel.numberLevelsFilter
  );
  const devicesState = useSelector((state: RootState) => state.device.devices);
  const dispatch = useDispatch<any>();
  const [currentPage, setCurrentPage] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [displayPage, setDisplayPage] = useState<string>("");
  const [dateFilter, setDateFilter] = useState({
    dateStart: "",
    dateEnd: "",
  });

  const getElementAtEndOfBreadscrum = useCallback(() => {
    const elementEnd = breadcrumbState[breadcrumbState.length - 1] as {
      title: string;
      path: string;
    };
    if (elementEnd !== undefined) {
      return setDisplayPage(elementEnd.title);
    }
  }, [breadcrumbState]);

  useEffect(() => {
    dispatch(getAllNumberLevels());
  }, [dispatch]);

  const PER_PAGE = 8;
  const offset = currentPage * PER_PAGE;
  const pageCount = () => {
    if (!isFilterNumberState)
      return Math.ceil(numberLevelsState.length / PER_PAGE);
    return Math.ceil(numberLevelsFilterState.length / PER_PAGE);
  };

  useEffect(() => {
    getElementAtEndOfBreadscrum();
  }, [getElementAtEndOfBreadscrum]);

  const checkStatus = (text: string) => {
    if (text.match("Đang chờ")) return `${styles.blue}`;
    if (text.match("Đã sử dụng")) return `${styles.gray}`;
    return `${styles.red}`;
  };

  const handleNavigatePage = async (page: string, item: {} | null) => {
    if (page.match("detail")) {
      dispatch(addNumberLevel(item));
      return dispatch(addValue({ title: "Chi tiết", path: "" }));
    }
    return dispatch(addValue({ title: "Cấp số mới", path: "" }));
  };

  const displayServiceForSelectBox = () => {
    let services: string[] = ["Tất cả"];
    servicesState.map((item) => {
      return services.push(item.serviceName);
    });
    return services;
  };

  const removeDuplicate = (collection: device[], isDuplicate: IsDuplicate) =>
    collection.filter(
      (item, index, items: device[]) =>
        items.findIndex((secondItem) => isDuplicate(item, secondItem)) === index
    );

  const displayDeviceForSelectBox = () => {
    let devicesName: string[] = ["Tất cả"];
    const removeDup = removeDuplicate(
      devicesState,
      (a, b) => a.deviceName === b.deviceName
    );
    removeDup.forEach((item) => {
      return devicesName.push(item.deviceName);
    });
    return devicesName;
  };

  const handleFilter = (value: string, type: string) => {
    if (value === "" || value.match("Tất cả"))
      return dispatch(updateIsFilterNumber(false));
    let res: NumberLevel[] = [];
    if (type.match("service"))
      res = numberLevelsState.filter((item) => {
        return item.service.match(value);
      });
    if (type.match("status"))
      res = numberLevelsState.filter((item) => item.status.match(value));
    if (type.match("device"))
      res = numberLevelsState.filter((item) => item.device.match(value));
    dispatch(updateIsFilterNumber(true));
    return dispatch(setNumberLevelsFilter(res));
  };

  const handleFilterDate = useCallback(
    (value: { dateStart: string; dateEnd: string }) => {
      const dateStart = new Date(value.dateStart);
      const dateEnd = new Date(value.dateEnd);

      const res: NumberLevel[] = [];
      if (value.dateEnd === "" && value.dateStart === "") return;
      numberLevelsState.forEach((item: NumberLevel) => {
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

      if (res.length === 0 && isFilterNumberState) {
        dispatch(setNumberLevelsFilter(res));
      }
      dispatch(updateIsFilterNumber(true));
      dispatch(setNumberLevelsFilter(res));
    },
    [numberLevelsState, dispatch, isFilterNumberState]
  );

  useEffect(() => {
    handleFilterDate(dateFilter);
  }, [handleFilterDate, dateFilter]);

  const handleSearchText = useCallback(
    (text: string) => {
      if (text === "") return dispatch(updateIsFilterNumber(false));
      const res = numberLevelsState.filter((item) => {
        return (
          item.stt.toString().includes(text) || item.customer.includes(text)
        );
      });
      dispatch(updateIsFilterNumber(true));
      dispatch(setNumberLevelsFilter(res));
    },
    [dispatch, numberLevelsState]
  );

  useEffect(() => {
    handleSearchText(searchText);
  }, [handleSearchText, searchText]);

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className={styles.newNumberLevel}>
      <h2>Quản lý cấp số</h2>

      {displayPage.match("Danh sách cấp số") && (
        <React.Fragment>
          <div className={styles.filterBtn}>
            <div>
              <p>Tên dịch vụ</p>
              <Dropdown
                data={displayServiceForSelectBox()}
                setWidth="170"
                value={""}
                text="Tất cả"
                onClick={(value) => handleFilter(value, "service")}
              />
            </div>

            <div>
              <p>Tình trạng</p>
              <Dropdown
                data={["Tất cả", "Đang chờ", "Đã sử dụng", "Bỏ qua"]}
                setWidth="150"
                value={""}
                text="Tất cả"
                onClick={(value) => handleFilter(value, "status")}
              />
            </div>

            <div>
              <p>Nguồn cấp</p>
              <Dropdown
                data={displayDeviceForSelectBox()}
                setWidth="200"
                value={""}
                text="Tất cả"
                onClick={(value) => handleFilter(value, "device")}
              />
            </div>

            <div>
              <p>Chọn thời gian</p>
              <DateButton onClick={(value) => setDateFilter(value)} />
            </div>

            <div>
              <p>Từ khóa</p>
              <SearchText
                setWidth={200}
                onFind={(text) => setSearchText(text)}
              />
            </div>
          </div>

          <div className={styles.body}>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên khách hàng</th>
                    <th>Tên dịch vụ</th>
                    <th>Thời gian cấp</th>
                    <th>Hạn sử dụng</th>
                    <th>Trạng thái</th>
                    <th>Nguồn cấp</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {!isFilterNumberState &&
                    numberLevelsState
                      .slice(offset, offset + PER_PAGE)
                      .map((item) => (
                        <tr key={item.stt}>
                          <td>{item.stt}</td>
                          <td>{item.customer}</td>
                          <td>{item.service}</td>
                          <td>{item.timeuse}</td>
                          <td>{item.timeexpire}</td>
                          <td className={styles.status}>
                            <div>
                              <div className={checkStatus(item.status)} />
                              <p>{item.status}</p>
                            </div>
                          </td>
                          <td>{item.device}</td>
                          <td
                            className={styles.detailBtn}
                            onClick={() => handleNavigatePage("detail", item)}
                          >
                            Chi tiết
                          </td>
                        </tr>
                      ))}

                  {isFilterNumberState &&
                    numberLevelsFilterState
                      .slice(offset, offset + PER_PAGE)
                      .map((item) => (
                        <tr key={item.stt}>
                          <td>{item.stt}</td>
                          <td>{item.customer}</td>
                          <td>{item.service}</td>
                          <td>{item.timeuse}</td>
                          <td>{item.timeexpire}</td>
                          <td className={styles.status}>
                            <div>
                              <div className={checkStatus(item.status)} />
                              <p>{item.status}</p>
                            </div>
                          </td>
                          <td>{item.device}</td>
                          <td
                            className={styles.detailBtn}
                            onClick={() => handleNavigatePage("detail", item)}
                          >
                            Chi tiết
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

            <ButtonAdd
              text="Cấp số mới"
              onClick={() => handleNavigatePage("New", null)}
            />
          </div>
        </React.Fragment>
      )}

      {displayPage.match("Cấp số mới") && <NewNumberLevel />}
      {displayPage.match("Chi tiết") && <Detail />}
    </div>
  );
};
