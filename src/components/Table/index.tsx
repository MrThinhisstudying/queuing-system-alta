import React, { useCallback } from "react";
import styles from "./table.module.css";

type TableType = {
  header: string[];
};

export const Table = (props: TableType) => {
  const checkTableHeader = useCallback((header: string) => {
    if (header.includes("nút")) return false;
    return true;
  }, []);

  return (
    <table>
      <thead>
        <tr>
          {props.header.map((item) => (
            <th key={item}>{checkTableHeader(item) ? item : ""}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>KIO_01</td>
          <td>Kiosk</td>
          <td>192.168.1.10</td>
          <td className={styles.status}>
            <div className={styles.gray} />
            Ngưng hoạt động
          </td>
          <td>Mất kết nối</td>
          <td>Khám tim mạch, Khám mắt...</td>
          <td>Chi tiết</td>
          <td>Cập nhật</td>
        </tr>
      </tbody>
    </table>
  );
};
