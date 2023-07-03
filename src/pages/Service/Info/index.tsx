import React, { useEffect, useState } from "react";

import styles from "./info.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { service } from "../../../types";
import { changeValue } from "../../../store/reducers/breadcrumbSlice";
import { removeLastItemBreadScrumb } from "../../../utils";
import {
  clearService,
  createNewService,
  updateService,
} from "../../../store/reducers/serviceSlice";
import { updateData } from "../../../config/firebase/firestore";
import { addHistorys } from "../../../store/reducers/historySlice";
import { Input } from "../../../components/Input";
import { Dropdown } from "../../../components/Dropdown";
import { CheckBox } from "../../../components/CheckBox";
import { ButtonOutline } from "../../../components/ButtonOutline";
import { Button } from "../../../components/Button";

export const Info = () => {
  const serviceState = useSelector((state: RootState) => state.service.service);
  const servicesState = useSelector(
    (state: RootState) => state.service.services
  );
  const breadcrumbSate = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const accountState = useSelector(
    (state: RootState) => state.account.accountLogin
  );

  const dispatch = useDispatch<any>();

  const [service, setService] = useState<service>({
    id: "",
    activeStatus: "Ngưng hoạt động",
    description: "",
    serviceCode: "",
    serviceName: "",
    dateCreate: "",
    rule: [],
  });

  useEffect(() => {
    setService(serviceState);
  }, [serviceState]);

  const getTextButton = () => {
    let text: string = "";
    const getType = breadcrumbSate[breadcrumbSate.length - 1] as {
      title: string;
      path: string;
    };
    if (getType.title.match("Thêm dịch vụ")) {
      text = "Thêm dịch vụ";
    } else {
      text = "Cập nhật";
    }
    return text;
  };

  const handleChange = (type: string, value: string) => {
    setService({ ...service, [type]: value });
  };

  const handleCheckBox = (name: string, value: string | number) => {
    const findRule = service.rule.findIndex((item) => item.name.match(name));
    if (findRule === -1) {
      setService({ ...service, rule: [...service.rule, { name, value }] });
    }
    if (findRule === 1) {
      const removeExist = service.rule.filter((item) => {
        return !item.name.match(name);
      });
      setService({ ...service, rule: removeExist });
    }
  };

  const handleCancel = () => {
    const res = removeLastItemBreadScrumb(breadcrumbSate);
    dispatch(changeValue(res.newArray));
    dispatch(clearService(""));
  };

  const displayStatusCheck = (value: string) => {
    if (service.rule === undefined || service.rule.length === 0) return false;
    const isExist = service.rule.findIndex((item) => item.name.match(value));
    if (isExist === -1) return false;
    return true;
  };

  const handleAddOrUpdate = async () => {
    const getType = breadcrumbSate[breadcrumbSate.length - 1] as {
      title: string;
      path: string;
    };

    const newOrUpdateService: service = {
      id: service.id,
      activeStatus: service.activeStatus,
      dateCreate: service.dateCreate,
      description: service.description,
      rule: service.rule,
      serviceCode: service.serviceCode,
      serviceName: service.serviceName,
    };
    newOrUpdateService.dateCreate = new Date().toUTCString();

    if (getType.title.match("Thêm dịch vụ")) {
      dispatch(createNewService(newOrUpdateService));
      dispatch(
        addHistorys({
          name: accountState.username,
          content: `dịch vụ ${service.serviceName}`,
          type: "Thêm",
        })
      );
    } else {
      const res = await updateData(newOrUpdateService, "services");
      if (res === null) return;
      const newServices: service[] = [];
      servicesState.forEach((item: service) => {
        if (item.id.includes(service.id)) {
          item = service;
        }
        newServices.push(item);
      });
      dispatch(updateService(newServices));
      dispatch(
        addHistorys({
          name: accountState.username,
          content: `dịch vụ ${service.serviceName}`,
          type: "Cập nhật",
        })
      );
    }
    handleCancel();
  };

  return (
    <div className={styles.infoContainer}>
      <div className={styles.body}>
        <h3>Thông tin dịch vụ</h3>
        <div className={styles.inputForm}>
          <div className={styles.input}>
            <div>
              <p>
                Mã dịch vụ: <span>*</span>
              </p>
              <Input
                status={true}
                value={service.serviceCode !== "" ? service.serviceCode : ""}
                placeholder="Nhập mã dịch vụ"
                handleChange={(e) =>
                  handleChange("serviceCode", e.target.value)
                }
              />
            </div>

            <div>
              <p>
                Tên dịch vụ: <span>*</span>
              </p>
              <Input
                status={true}
                value={service.serviceName !== "" ? service.serviceName : ""}
                placeholder="Nhập tên dịch vụ"
                handleChange={(e) =>
                  handleChange("serviceName", e.target.value)
                }
              />
            </div>

            <div>
              <p>
                Trạng thái hoạt động: <span>*</span>
              </p>
              <Dropdown
                data={["Hoạt động", "Ngưng hoạt động"]}
                setWidth="200"
                text=""
                value={service.activeStatus}
                onClick={(value) => handleChange("activeStatus", value)}
              />
            </div>
          </div>

          <div className={styles.description}>
            <p>Mô tả:</p>
            <textarea
              name=" "
              id=""
              value={service.description !== "" ? service.description : ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>

        <h3>Quy tắc cấp số</h3>
        <div className={styles.checklist}>
          <div className={styles.checkbox}>
            <CheckBox
              value="Tăng tự động từ:"
              checked={displayStatusCheck("Tăng tự động từ:")}
              onClick={(value) => handleCheckBox(value, "0001-9999")}
            />

            <div className={styles.frameNumber}>
              <p>0001</p>
            </div>

            <p>đến</p>

            <div className={styles.frameNumber}>
              <p>9999</p>
            </div>
          </div>

          <div className={styles.checkbox}>
            <CheckBox
              value="Prefix:"
              checked={displayStatusCheck("Prefix:")}
              onClick={(value) => handleCheckBox(value, "0001")}
            />

            <div className={styles.frameNumber}>
              <p>0001</p>
            </div>
          </div>

          <div className={styles.checkbox}>
            <CheckBox
              value="Surfix:"
              checked={displayStatusCheck("Surfix:")}
              onClick={(value) => handleCheckBox(value, "0001")}
            />

            <div className={styles.frameNumber}>
              <p>0001</p>
            </div>
          </div>

          <div className={styles.checkbox}>
            <CheckBox
              value="Reset mỗi ngày:"
              checked={false}
              onClick={(value) => handleCheckBox(value, "reset mỗi ngày")}
            />
          </div>
        </div>
        <p>
          <span>*</span> Là trường thông tin bắt buộc
        </p>
      </div>

      <div className={styles.btn}>
        <ButtonOutline text="Hủy bỏ" handleClick={() => handleCancel()} />

        <Button
          text={getTextButton()}
          handleClick={() => handleAddOrUpdate()}
        />
      </div>
    </div>
  );
};
