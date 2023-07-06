import React, { useCallback, useEffect, useState } from "react";
import styles from "./Devices.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addDevice,
  addDeviceFilter,
  changeFilter,
} from "../../store/reducers/devicesSlice";
import { RootState } from "../../store/store";
import { addValue } from "../../store/reducers/breadcrumbSlice";
import { device } from "../../types";
import { checkTableHeader } from "../../utils";
import { Dropdown } from "../../components/Dropdown";
import { Pagination } from "../../components/Pagination";
import { ButtonAdd } from "../../components/ButtonAdd";
import { SearchText } from "../../components/SearchText";
import { DevicesInfo } from "./DevicesInfo";
import { DevicesDetail } from "./DevicesDetail";

const tableHeader = [
  "Mã thiết bị",
  "Tên thiết bị",
  "Địa chỉ IP",
  "Trạng thái hoạt động",
  "Trạng thái kết nối",
  "Dịch vụ sử dụng",
  "nút 1",
  "nút 2",
];

export const Devices = () => {
  const [showPopup, setShowPopup] = useState<string>("");
  // const handleViewMore = () => {
  //   setShowPopup((prevShowPopup) => !prevShowPopup);
  // };
  // const handlePopupClick = () => {
  //   setShowPopup(false);
  // };
  const dispatch = useDispatch<any>();
  const devicesState = useSelector((state: RootState) => state.device.devices);
  const breadcrumbState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const filterState = useSelector((state: RootState) => state.device.isFilter);
  const dataFilter = useSelector(
    (state: RootState) => state.device.devicesFilter
  );
  const [displayPage, setDisplayPage] = useState<string>("Danh sách thiết bị");

  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState({
    active: "",
    connect: "",
    searchText: "",
  });

  const PER_PAGE = 8;
  const offset = currentPage * PER_PAGE;
  const pageCount = () => {
    if (dataFilter.length === 0)
      return Math.ceil(devicesState.length / PER_PAGE);
    return Math.ceil(dataFilter.length / PER_PAGE);
  };

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
    getElementAtEndOfBreadscrum();
  }, [getElementAtEndOfBreadscrum]);

  const checkStatus = (text: string) => {
    if (text === "Hoạt động" || text === "Kết nối") return `${styles.green}`;
    return `${styles.red}`;
  };

  const handleAdd = async () => {
    dispatch(
      addValue({ title: "Thêm thiết bị", path: "" } as {
        title: string;
        path: string;
      })
    );
  };

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  const handleButton = (item: device, type: string) => {
    if (type.includes("Chi tiết")) {
      dispatch(
        addValue({ title: "Chi tiết thiết bị", path: "" } as {
          title: string;
          path: string;
        })
      );
    }
    if (type.includes("Cập nhật")) {
      dispatch(
        addValue({ title: "Cập nhật thiết bị", path: "" } as {
          title: string;
          path: string;
        })
      );
    }
    dispatch(addDevice(item));
  };

  const handleChangeFilter = (typeFilter: string, value: string) => {
    setFilter({ ...filter, [typeFilter]: value });
  };

  const handleCheck = useCallback(() => {
    let res: device[] = [];

    if (filter.active.includes("Tất cả") === false) {
      res = devicesState.filter((i) => i.activeStatus.includes(filter.active));
      dispatch(changeFilter(true));
    }
    if (filter.connect.includes("Tất cả") === false) {
      res = devicesState.filter((i) =>
        i.connectStatus.includes(filter.connect)
      );
      dispatch(changeFilter(true));
    }
    if (
      filter.active.includes("Tất cả") === false &&
      filter.connect.includes("Tất cả") === false
    ) {
      res = devicesState.filter((i) => {
        return (
          i.connectStatus.includes(filter.connect) &&
          i.activeStatus.includes(filter.active)
        );
      });
      dispatch(changeFilter(true));
    }
    if (filter.active === "Tất cả" && filter.connect === "Tất cả") {
      dispatch(addDeviceFilter([]));
      return dispatch(changeFilter(false));
    }
    dispatch(addDeviceFilter(res));
  }, [devicesState, filter, dispatch]);

  const handleSreachText = (text: string) => {
    if (text !== "") {
      const res = devicesState.filter(
        (i) =>
          i.connectStatus.includes(text) ||
          i.activeStatus.includes(text) ||
          i.deviceName.includes(text) ||
          i.deviceCode.includes(text) ||
          i.deviceUse.includes(text)
      );
      dispatch(changeFilter(true));
      return dispatch(addDeviceFilter(res));
    }
    dispatch(changeFilter(false));
    dispatch(addDeviceFilter([]));
  };

  useEffect(() => {
    handleCheck();
  }, [handleCheck]);

  return (
    <div className={styles.container}>
      {displayPage === "Danh sách thiết bị" && (
        <React.Fragment>
          <h1>Danh sách thiết bị</h1>

          <div>
            <div className={styles.filterbtn}>
              <div>
                <div className={styles.dropdownFrame}>
                  <p>Trạng thái hoạt động</p>
                  <Dropdown
                    setWidth="200"
                    value=""
                    data={["Tất cả", "Hoạt động", "Ngưng hoạt động"]}
                    text="Tất cả"
                    onClick={(value) => handleChangeFilter("active", value)}
                  />
                </div>

                <div className={styles.dropdownFrame}>
                  <p>Trạng thái kết nối</p>
                  <Dropdown
                    setWidth="200"
                    value=""
                    data={["Tất cả", "Kết nối", "Mất kết nối"]}
                    text="Tất cả"
                    onClick={(value) => handleChangeFilter("connect", value)}
                  />
                </div>
              </div>

              <div style={{ marginRight: "80px" }}>
                <p>Từ khóa</p>
                <SearchText
                  setWidth={300}
                  onFind={(text) => handleSreachText(text)}
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
                    {filterState !== true &&
                      devicesState
                        .slice(offset, offset + PER_PAGE)
                        .map((item) => (
                          <tr key={item.id}>
                            <td>{item.deviceCode}</td>
                            <td>{item.deviceName}</td>
                            <td className={styles.deviceIP}>
                              <p>{item.deviceIP}</p>
                            </td>
                            <td className={styles.status}>
                              <div>
                                <div
                                  className={checkStatus(item.activeStatus)}
                                />
                                <p>{item.activeStatus}</p>
                              </div>
                            </td>
                            <td className={styles.status}>
                              <div>
                                <div
                                  className={checkStatus(item.connectStatus)}
                                />
                                <p>{item.connectStatus}</p>
                              </div>
                            </td>
                            <td className={styles.description}>
                              <p>{item.deviceUse}</p>
                              <button>Xem thêm</button>
                            </td>
                            <td
                              className={styles.btn}
                              onClick={() => handleButton(item, "Chi tiết")}
                            >
                              Chi tiết
                            </td>
                            <td
                              className={styles.btn}
                              onClick={() => handleButton(item, "Cập nhật")}
                            >
                              Cập nhật
                            </td>
                          </tr>
                        ))}

                    {filterState &&
                      dataFilter
                        .slice(offset, offset + PER_PAGE)
                        .map((item) => (
                          <tr key={item.id}>
                            <td>{item.deviceCode}</td>
                            <td>{item.deviceName}</td>
                            <td className={styles.deviceIP}>
                              <p>{item.deviceIP}</p>
                            </td>
                            <td className={styles.status}>
                              <div>
                                <div
                                  className={checkStatus(item.activeStatus)}
                                />
                                <p>{item.activeStatus}</p>
                              </div>
                            </td>
                            <td className={styles.status}>
                              <div>
                                <div
                                  className={checkStatus(item.connectStatus)}
                                />
                                <p>{item.connectStatus}</p>
                              </div>
                            </td>
                            <td className={styles.description}>
                              <p>{item.deviceUse}</p>
                              <button onClick={() => setShowPopup(item.id)}>
                                Xem thêm
                              </button>
                              {showPopup === item.id && (
                                <div
                                  className={styles.popup}
                                  onClick={() => {
                                    setShowPopup("");
                                  }}
                                >
                                  {item.deviceUse}
                                </div>
                              )}
                            </td>
                            <td
                              className={styles.btn}
                              onClick={() => handleButton(item, "Chi tiết")}
                            >
                              Chi tiết
                            </td>
                            <td
                              className={styles.btn}
                              onClick={() => handleButton(item, "Cập nhật")}
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

              <ButtonAdd text="Thêm thiết bị" onClick={() => handleAdd()} />
            </div>
          </div>
        </React.Fragment>
      )}

      {displayPage === "Thêm thiết bị" && <DevicesInfo />}
      {displayPage === "Chi tiết thiết bị" && <DevicesDetail />}
      {displayPage === "Cập nhật thiết bị" && <DevicesInfo />}
    </div>
  );
};
