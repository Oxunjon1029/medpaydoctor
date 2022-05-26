import React, { useEffect, useState } from "react";
import { Table, Skeleton, Button, Form } from "antd";
import {  UserUnfinishedMedCardsGet } from "../server/config/treated";
import UnfinishedModal from "../comps/UnfinishedModal";
import moment from "moment";

const ReportsP = () => {
  const [loading, setLoading] = useState(true);
  const [tabloading,setTableLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [listColumns, setListColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [useMedForm] = Form.useForm();
  const [userServisId, setUserServisId] = useState({});
  const [selected, setSelected] = useState(false);

  const handlePaginationChange = (page, s) => {
    setCurrentPage(page);
    GetUnfinishedUserMedCards(page, s);
  };
  const unfinishedcolumns = [
    {
      title: "Bemor",
      dataIndex: "name",
    },
    {
      title: "Xizmat nomi",
      dataIndex: "serviceItemName",
    },
    {
      title: "Sanasi",
      data: "orderDate",
      render: (orderDate) => (
        <span>{moment().format("YYYY-MM-DD", orderDate)}</span>
      ),
    },
    {
      title: "MedKarta",
      key: "orderId",
      dataIndex: "orderId",
      render: (id, object) => (
        <Button
          disabled={object.status === "ORDERED"}
          onClick={() => medcardBtn(id, object)}
        >
          Batafsil
        </Button>
      ),
    },
  ];
  const GetUnfinishedUserMedCards = (p, s) => {
    UserUnfinishedMedCardsGet(p, s).then((res) => {
      setListColumns(res.data.content);
      setTotalElements(res.data.totalElements);
      setTableLoading(false)
    });
  };
  const medcardBtn = (id, object) => {
    setUserServisId(object);
    showModal();
    

   
  };
  useEffect(() => {
    GetUnfinishedUserMedCards();
    setLoading(false);
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <React.Fragment>
      {loading ? (
        <Skeleton key="unfinishedskeleton" active />
      ) : (
        <Table
          pagination={{
            current: currentPage,
            total: totalElements,
            pageSize: 10,
            onChange: handlePaginationChange,
            showTotal: (totalElements) => `ВСЕ: ${totalElements}`,
          }}
          tableLayout="fixed"
          bordered
          size="small"
          columns={unfinishedcolumns}
          dataSource={listColumns}
          rowKey={(e) => e.userServisId}
          scroll={{ x: 800 }}
          className="w-100"
          loading={tabloading}
        />
      )}
      <UnfinishedModal
        key="unfinishedmodal"
        visible={visible}
        setVisible={setVisible}
        onCancel={handleCancel}
        form={useMedForm}
        userServisId={userServisId}
        setSelected={setSelected}
        selected={selected}
        GetUnfinishedUserMedCards={GetUnfinishedUserMedCards}
      />
    </React.Fragment>
  );
};

export default ReportsP;
