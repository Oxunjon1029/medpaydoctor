import React, { useEffect, useState } from "react";
import { Button, Radio, Table } from "antd";
// var Stomp = require("stompjs");

const HomeP = () => {
  const [doctorSchedule, setDoctorSchedule] = useState([]);
  const [Times, setTimes] = useState([]);
  const [size, setSize] = useState();
  // const [doctorID, setDoctorID] = useState("");
  // const [loading, setLoading] = useState(true);
  const handleSizeChange = (e) => {
    setSize(e.target.value);
    localStorage.setItem("activeId", e.target.value);
    let data = Object.keys(
      doctorSchedule.find((el) => el.timetableObjectId === e.target.value).times
    );
    data = data.map((item, index) => {
      return {
        key: index,
        time: item,
        Status: doctorSchedule.find(
          (el) => el.timetableObjectId === e.target.value
        ).times[item],
      };
    });
    setTimes(data);
  };

  const isBusy = (el) => {
    // let object = {};
    const times2 = Times;
    times2.forEach((item) => {
      if (item.time === el.time) {
        if (item.Status === "EMPTY") {
          item.Status = "BUSY";
        } else {
          item.Status = "EMPTY";
        }
      }
    });
    let newtimeobj = {};
    newtimeobj[el.time] = el.Status;
    let active = localStorage.getItem("activeId");
    object = {
      doctorId: doctorID,
      doctorSchedule: [
        {
          timetableObjectId: active,
          times: newtimeobj,
        },
      ],
    };
    setTimes(times2);
    // DoctorScheduleMakeBusy(object).then((res) => {
    //   GetSchedule(doctorID);
    // });
  };

  const columns = [
    {
      title: "Vaqti",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Holati",
      key: "data",
      render: (data) => (
        <>
          <Button
            onClick={() => isBusy(data)}
            disabled={
              data.Status === "ORDERED" ||
              data.Status === "RESERVED" ||
              data.Status === "APPROVED"
            }
            type={data.Status === "EMPTY" ? "default" : "danger"}
          >
            {data.Status === "ORDERED"
              ? "Buyurtma qilingan"
              : data.Status === "RESERVED"
                ? "Zaxiraga olingan"
                : data.Status === "APPROVED"
                  ? "Rozi bo'lgan"
                  : data.Status === "EMPTY"
                    ? "Bo'sh"
                    : "Band"}
          </Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    // userGet().then((res) => {
    //   GetSchedule(res.data[0].doctorId);
    // });
    // if (doctorID) {
    //   const soc = new SockJS(WEB_SOCKET_URL);
    //   const stompClient = Stomp.over(soc);
    //   stompClient.connect({}, function () {
    //     stompClient.subscribe("/topic/doctor", function (msg) {
    //       console.log("Salom", JSON.parse(msg.body));
    //       if (
    //         JSON.parse(msg.body).event === "DOCTOR" &&
    //         JSON.parse(msg.body).content === getCookie("doctorId")
    //       ) {
    //         if (!GetSchedule(doctorID)) {
    //           stompClient.disconnect()
    //         }
    //       }
    //     });
    //   });
    // }
  }, [doctorID]);
  // const GetSchedule = (id) => {
  //   DoctorSchedule(id).then((res) => {
  //     setDoctorID(res.data.doctorId);
  //     setDoctorSchedule(res.data.doctorSchedule);
  //     let active = localStorage.getItem("activeId");
  //     setSize(active);
  //     let data = Object.keys(
  //       res.data.doctorSchedule.length > 0
  //         ? res.data.doctorSchedule.find(
  //           (el) => el.timetableObjectId === active
  //         ).times
  //         : {}
  //     );
  //     data = data.map((item, index) => {
  //       return {
  //         key: index,
  //         time: item,
  //         Status:
  //           res.data.doctorSchedule.length > 0
  //             ? res.data.doctorSchedule.find(
  //               (el) => el.timetableObjectId === active
  //             ).times[item]
  //             : "",
  //       };
  //     });
  //     setTimes(data);
  //     setLoading(false);
  //   });
  // };

  return (
    <React.Fragment>
      <div className="w-100">
        <div className="date-box mb-2">
          <Radio.Group
            buttonStyle="solid"
            value={size}
            onChange={handleSizeChange}
            defaultValue={localStorage.getItem("activeId")}
          >
            {doctorSchedule.map((item) => (
              <Radio.Button
                key={item.timetableObjectId}
                value={item.timetableObjectId}
              >
                {item.objectDate}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            flexDirection: "column",
          }}
        >
          <Table
            pagination={false}
            tableLayout="fixed"
            bordered
            size="small"
            columns={columns}
            scroll={{ x: 200 }}
            className="w-100"
            dataSource={Times}
            loading={loading}
          ></Table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default HomeP;
