import React, { useEffect, useState } from "react";
import styles from "./selectBox.module.css";

type SelectBoxType = {
  data: string[];
  value: string[];
  onClickSelect: (item: string) => void;
  onClickDelete: (item: string) => void;
};

export const SelectBox = (props: SelectBoxType) => {
  const [displayService, setDisplayService] = useState<string[]>([]);
  const [isClick, setIsClick] = useState<boolean>(false);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    if (displayService.length === 0) {
      setDisplayService(props.data);
    }
    // if(props.value.length !== 0) {
    //   setServices(props.value)
    // }
  }, [props.data, displayService.length, props.value.length, props.value]);

  const handleSelect = (service: string) => {
    if (service.includes("Tất cả")) {
      if (services.length !== 0) {
        displayService.forEach((item) => {
          if (item.includes("Tất cả") === false) {
            setServices([...services, item]);
          }
        });
        return setDisplayService(["Tất cả"]);
      }
      setIsClick(false);
      setDisplayService(["Tất cả"]);
      return setServices(
        displayService.filter((i) => {
          return i !== "Tất cả";
        })
      );
    }
    setDisplayService(
      displayService.filter((item) => {
        return item !== service;
      })
    );
    setServices([...services, service]);
    setIsClick(false);
  };

  const handleDelete = (service: string) => {
    const filter = services.filter((item) => {
      return item !== service;
    });
    setServices(filter);
  };

  return (
    <div className={styles.selectContainer}>
      <div
        onClick={() => {
          if (displayService.length > 1) {
            setIsClick(!isClick);
          }
        }}
      >
        {services?.length === 0 ? (
          <div className={styles.input} onClick={() => setIsClick(true)}>
            <p>Nhập dịch vụ</p>
          </div>
        ) : (
          <React.Fragment>
            {services?.map((item) => (
              <div key={item} className={styles.item}>
                <p>{item}</p>

                <svg
                  onClick={() => {
                    handleDelete(item);
                    props.onClickDelete(item);
                  }}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 5L5 15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 5L15 15"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </React.Fragment>
        )}
      </div>

      <div className={isClick ? styles.active : styles.none}>
        {displayService.map((item, index) => (
          <div
            key={index}
            className={styles.select}
            onClick={() => {
              handleSelect(item);
              props.onClickSelect(item);
            }}
          >
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
