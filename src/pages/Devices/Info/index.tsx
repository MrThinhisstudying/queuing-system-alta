import React, { useEffect, useState } from "react";
import styles from "./info.module.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { changeValue } from "../../../store/reducers/breadcrumbSlice";
import { device } from "../../../types";
import { addData, updateData } from "../../../config/firebase/firestore";
import { resetDevice } from "../../../store/reducers/devicesSlice";
import { Input } from "../../../components/Input";
import { Dropdown } from "../../../components/Dropdown";
import { SelectBox } from "../../../components/SelectBox";
import { Button } from "../../../components/Button";
import { ButtonOutline } from "../../../components/ButtonOutline";

// const services =["Tất cả", "Khám sản phụ khoa", "Khám răng hàm mặt", "Khám tai mũi họng", "Khám hô hấp", "Khám tổng quát"]

export const Info = () => {
  const dispatch = useDispatch();
  const breadcrumbSate = useSelector(
    (state: RootState) => state.breadcrumb.value
  );
  const servicesState = useSelector(
    (state: RootState) => state.service.services
  );
  const deviceState = useSelector((state: RootState) => state.device.device);

  const [device, setDevice] = useState<device>({
    id: "",
    activeStatus: "Ngưng hoạt động",
    connectStatus: "Mất kết nối",
    deviceCode: "",
    deviceIP: "",
    deviceName: "",
    deviceUse: "",
    password: "",
    username: "",
    deviceType: "",
  });
  const [services, setServices] = useState<string[]>(["Tất cả"]);

  // useEffect(() => {
  //     console.log(services);
  // }, [services])

  const getTextButton = () => {
    let text: string = "";
    const getType = breadcrumbSate[breadcrumbSate.length - 1] as {
      title: string;
      path: string;
    };
    if (getType.title.includes("Thêm thiết bị")) {
      text = "Thêm thiết bị";
    } else {
      text = "Cập nhật";
    }
    return text;
  };

  const displayServiceForSelectBox = () => {
    let services: string[] = ["Tất cả"];
    servicesState.map((item) => {
      if (item.activeStatus.match("Hoạt động")) {
        return services.push(item.serviceName);
      }
      return services;
    });
    return services;
  };

  const handleChange = (name: string, value: string) => {
    setDevice({ ...device, [name]: value });
  };

  const handleChangeServiceUse = (item: string) => {
    let serviceUse: string = "";
    if (item.includes("Tất cả")) {
      const removeFirstIndex = services.filter((i) => {
        return i !== "Tất cả";
      });
      console.log(removeFirstIndex);

      const data: string = removeFirstIndex.join(", ");
      return setDevice({ ...device, deviceUse: data });
    }
    if (device.deviceUse === "") {
      serviceUse = `${item},`;
    } else {
      serviceUse = `${device.deviceUse} ${item},`;
    }
    setDevice({ ...device, deviceUse: serviceUse });
  };

  const handleChangeDeleteServiceUse = (item: string) => {
    const deleteTheItem = device.deviceUse.replace(`${item.trim()},`, "");
    setDevice({ ...device, deviceUse: deleteTheItem });
  };

  const handleFormatStringToArray = (text: string) => {
    if (text === "") return [];
    const splitText = text.split(", ");
    return splitText;
  };

  const handleCancel = () => {
    const data = breadcrumbSate.filter((item) => {
      return (
        item.title !== "Thêm thiết bị" && item.title !== "Cập nhật thiết bị"
      );
    });
    dispatch(changeValue(data));
    dispatch(resetDevice(""));
  };

  const handleAddOrUpdate = async () => {
    const getType = breadcrumbSate[breadcrumbSate.length - 1] as {
      title: string;
      path: string;
    };
    if (getType.title.includes("Thêm thiết bị")) {
      const res = await addData(device, "devices");
      if (res.status === false) return;
      dispatch(
        changeValue(
          breadcrumbSate.filter((i) => {
            return i.title.includes(getType.title) === false;
          })
        )
      );
    } else {
      const res = await updateData(device, "devices");
      if (res === null) return;
      dispatch(
        changeValue(
          breadcrumbSate.filter((i) => {
            return i.title.includes(getType.title) === false;
          })
        )
      );
    }
  };

  useEffect(() => {
    setDevice(deviceState);
  }, [deviceState]);

  return (
    <div className={styles.infoContainer}>
      <h2>Quản lý thiết bị</h2>

      <div className={styles.body}>
        <h3>Thông tin thiết bị</h3>

        <div className={styles.input}>
          <div className={styles.inputForm}>
            <p>
              Mã thiết bị: <span>*</span>
            </p>
            <Input
              status={true}
              value={device.deviceCode !== "" ? device.deviceCode : ""}
              placeholder="Nhập mã thiết bị"
              handleChange={(e) => handleChange("deviceCode", e.target.value)}
            />
          </div>

          <div>
            <p>
              Loại thiết bị: <span>*</span>
            </p>
            <Dropdown
              setWidth="200"
              value={device.deviceType}
              data={["Kiosk", "Display counter"]}
              text=""
              onClick={(value) => handleChange("deviceType", value)}
            />
          </div>

          <div>
            <p>
              Tên thiết bị: <span>*</span>
            </p>
            <Input
              status={true}
              value={device.deviceName !== "" ? device.deviceName : ""}
              placeholder="Nhập tên thiết bị"
              handleChange={(e) => handleChange("deviceName", e.target.value)}
            />
          </div>

          <div>
            <p>
              Tên đăng nhập: <span>*</span>
            </p>
            <Input
              status={true}
              value={device.username !== "" ? device.username : ""}
              placeholder="Nhập tài khoản"
              handleChange={(e) => handleChange("username", e.target.value)}
            />
          </div>

          <div>
            <p>
              Địa chỉ IP: <span>*</span>
            </p>
            <Input
              status={true}
              value={device.deviceIP !== "" ? device.deviceIP : ""}
              placeholder="Nhập địa chỉ IP"
              handleChange={(e) => handleChange("deviceIP", e.target.value)}
            />
          </div>

          <div>
            <p>
              Mật khẩu: <span>*</span>
            </p>
            <Input
              status={true}
              value={device.password !== "" ? device.password : ""}
              placeholder="Nhập mật khẩu"
              handleChange={(e) => handleChange("password", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputSelectBox}>
          <p>
            Dịch vụ sử dụng: <span>*</span>
          </p>
          <SelectBox
            data={displayServiceForSelectBox()}
            value={handleFormatStringToArray(device.deviceUse)}
            onClickSelect={(item) => handleChangeServiceUse(item)}
            onClickDelete={(item) => handleChangeDeleteServiceUse(item)}
          />
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
