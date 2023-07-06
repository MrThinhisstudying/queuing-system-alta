import React, { useCallback, useEffect, useState } from "react";
import styles from "./role.module.css";
import { role } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getRole } from "../../store/reducers/roleSlice";
import { addValue } from "../../store/reducers/breadcrumbSlice";
import { Pagination } from "../../components/Pagination";
import { ButtonAdd } from "../../components/ButtonAdd";
import { RoleInfo } from "./RoleInfo";

const tableHeader = ["Tên vai trò", "Sô người dùng", "Mô tả", " "];

export const Role = () => {
  const breadcrumbState = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const roleState = useSelector((state: RootState) => state.role.roles);
  const dispatch = useDispatch<any>();
  const [currentPage, setCurrentPage] = useState(0);
  const [displayPage, setDisplayPage] = useState<string>("");
  const PER_PAGE = 8;
  const offset = currentPage * PER_PAGE;
  const pageCount = () => {
    // if (dataFilter.length === 0)
    return Math.ceil(roleState.length / PER_PAGE);
    // return Math.ceil(dataFilter.length / PER_PAGE);
  };

  // useEffect(() => {
  //   dispatch(getAllRole())
  // }, [dispatch])

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

  const handlePageClick = (data: any) => {
    setCurrentPage(data.selected);
  };

  const handleUpdate = (item: role) => {
    dispatch(getRole(item));
    dispatch(addValue({ title: "Cập nhật vai trò", path: "" }));
  };

  const handleAdd = async () => {
    dispatch(addValue({ title: "Thêm vai trò", path: "" }));
  };

  return (
    <div>
      <h2>Danh sách vai trò</h2>

      {displayPage.includes("Quản lý vai trò") && (
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
                {roleState.slice(offset, offset + PER_PAGE).map((item) => (
                  <tr key={item.id}>
                    <td>{item.roleName}</td>
                    <td>{item.numberPeopleUse}</td>
                    <td>{item.description}</td>
                    <td
                      className={styles.btn}
                      onClick={() => handleUpdate(item)}
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

          <ButtonAdd text="Thêm vai trò" onClick={() => handleAdd()} />
        </div>
      )}

      {displayPage.includes("Thêm vai trò") && <RoleInfo />}
      {displayPage.includes("Cập nhật vai trò") && <RoleInfo />}
    </div>
  );
};
