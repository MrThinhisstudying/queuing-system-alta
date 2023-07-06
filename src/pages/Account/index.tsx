import React, { useCallback, useEffect, useState } from "react";
import styles from "./account.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addAccount,
  filterAccounts,
  getAllAccount,
  updateFilterState,
} from "../../store/reducers/accountSlice";
import { RootState } from "../../store/store";

import { addValue } from "../../store/reducers/breadcrumbSlice";
import { account } from "../../types";
import { Dropdown } from "../../components/Dropdown";
import { SearchText } from "../../components/SearchText";
import { Pagination } from "../../components/Pagination";
import { ButtonAdd } from "../../components/ButtonAdd";
import { AccountInfo } from "./AccountInfo";

const tableHeader = [
  "Tên đăng nhập",
  "Họ tên",
  "Số điện thoại",
  "Email",
  "Vai trò",
  "Trạng thái hoạt động",
  "",
];

export const Account = () => {
  const dispatch = useDispatch<any>();
  const breadcrumbState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const accountsState = useSelector(
    (state: RootState) => state.account.accounts
  );
  const filterState = useSelector((state: RootState) => state.account.isFilter);
  const accountsFilter = useSelector(
    (state: RootState) => state.account.accountsFilter
  );
  const accountState = useSelector((state: RootState) => state.account.account);
  const rolesState = useSelector((state: RootState) => state.role.roles);

  const [displayPage, setDisplayPage] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filterRole, setFilterRole] = useState<string>("");

  const PER_PAGE = 9;
  const offset = currentPage * PER_PAGE;
  const pageCount = () => {
    if (accountsFilter.length === 0)
      return Math.ceil(accountsState.length / PER_PAGE);
    return Math.ceil(accountsFilter.length / PER_PAGE);
  };

  useEffect(() => {
    dispatch(getAllAccount());
  }, [dispatch]);

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

  const getNameRoles = useCallback(() => {
    let rolesName: string[] = [];
    rolesState.map((item) => {
      return rolesName.push(item.roleName);
    });
    return rolesName.sort();
  }, [rolesState]);

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  const handleFilterRole = useCallback(() => {
    if (filterRole === "") return dispatch(updateFilterState(false));
    const res = accountsState.filter((item) => item.role.includes(filterRole));
    dispatch(updateFilterState(true));
    dispatch(filterAccounts(res));
  }, [filterRole, accountsState, dispatch]);

  const handleSearchText = (text: string) => {
    if (text !== "") {
      const res = accountsState.filter((item) => item.fullname.includes(text));
      dispatch(updateFilterState(true));
      return dispatch(filterAccounts(res));
    }
    dispatch(updateFilterState(false));
    dispatch(filterAccounts([]));
  };

  const checkStatus = (text: string) => {
    if (text === "Hoạt động" || text === "Kết nối") return `${styles.green}`;
    return `${styles.red}`;
  };

  const handleUpdateAccount = (account: account) => {
    dispatch(addAccount(account));
    dispatch(addValue({ title: "Cập nhật tài khoản", path: "" }));
  };

  const handleAddAccount = () => {
    dispatch(addValue({ title: "Thêm tài khoản", path: "" }));
  };

  useEffect(() => {
    handleFilterRole();
  }, [handleFilterRole]);

  return (
    <div className={styles.accountContainer}>
      <h2>Danh sách tài khoản</h2>

      {displayPage.includes("Quản lý tài khoản") && (
        <div>
          <div className={styles.filterBtn}>
            <div>
              <p>Tên vai trò</p>
              <Dropdown
                setWidth="200"
                data={getNameRoles()}
                value={filterRole}
                text=""
                onClick={(value) => setFilterRole(value)}
              />
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
                      <th key={item}>{item}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filterState &&
                    accountsFilter
                      .slice(offset, offset + PER_PAGE)
                      .map((item) => (
                        <tr key={item.id}>
                          <td>{item.username}</td>
                          <td>{item.fullname}</td>
                          <td>{item.phone}</td>
                          <td>{item.email}</td>
                          <td>{item.role}</td>
                          <td className={styles.status}>
                            <div>
                              <div className={checkStatus(item.status)} />
                              {item.status}
                            </div>
                          </td>
                          <td
                            className={styles.btn}
                            onClick={() => handleUpdateAccount(item)}
                          >
                            Cập nhật
                          </td>
                        </tr>
                      ))}

                  {filterState === false &&
                    accountsState
                      .slice(offset, offset + PER_PAGE)
                      .map((item: account) => (
                        <tr key={item.id}>
                          <td>{item.username}</td>
                          <td>{item.fullname}</td>
                          <td>{item.phone}</td>
                          <td>{item.email}</td>
                          <td>{item.role}</td>
                          <td className={styles.status}>
                            <div>
                              <div className={checkStatus(item.status)} />
                              {item.status}
                            </div>
                          </td>
                          <td
                            className={styles.btn}
                            onClick={() => handleUpdateAccount(item)}
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

            <ButtonAdd
              text="Thêm tài khoản"
              onClick={() => handleAddAccount()}
            />
          </div>
        </div>
      )}

      {displayPage.includes("Thêm tài khoản") && <AccountInfo data={null} />}
      {displayPage.includes("Cập nhật tài khoản") && (
        <AccountInfo data={accountState} />
      )}
    </div>
  );
};
