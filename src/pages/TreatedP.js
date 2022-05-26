import React, { useEffect, useState } from "react";
import { Table, Skeleton, Button, Modal, Tag, Tabs, Form } from "antd";
import {
  GetAllUserMedCardEnabled,
  GetMedCardById,
  TreatedGet,
} from "../server/config/treated";
import { TiArrowBackOutline } from "react-icons/ti";
import ModalOldOnes from "../comps/ModalOldOnes";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const { TabPane } = Tabs;
const TreatedP = () => {
  const [loading, setLoading] = useState(true);
  const [treatedloading, setTreatedLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const [oldcurrentPage, setOldCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [oldtotalElements, setOlnOnesTotalEelements] = useState(0);
  const [listColumns, setListColumns] = useState([]);
  const [byId, setById] = useState([]);
  const [usedMedCards, setUsedMedCards] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState("");
  const [byIdOldOnes, setByIdOldOnes] = useState([]);
  const [oldvisile, setoldvisible] = useState(false);
  const [modalvisible, setModalVisible] = useState(true);
  const [fileUrls, setfileUrls] = useState([]);

  const [oldforma] = Form.useForm();

  const [isold, setIsOld] = useState(true);

  const handlePaginationChange = (page, s) => {
    setCurrentPage(page);
    GetTreatedPatients(page, s);
  };

  const handleOldonesPagination = (p, s) => {
    setOldCurrentPage(p);
    OldOnes(userId, p, s);
  };
  const treatedColumns = [
    {
      title: "Bemor",
      dataIndex: "userFullName",
    },
    {
      title: "Xizmat nomi",
      dataIndex: "serviceItemName",
    },
    {
      title: "Sanasi",
      dataIndex: "createdAt",
      render: (date) => <span>{date.slice(0, 10)}</span>,
    },
    {
      title: "MedKarta",
      dataIndex: "madCardId",
      render: (madCardId, obj) => (
        <Button
          onClick={() => {
            showModal(madCardId);
            setUserId(obj.userId);
          }}
        >
          Batafsil
        </Button>
      ),
    },
  ];

  const oldtreatedcolumns = [
    {
      title: "Bemor",
      dataIndex: "userFullName",
      key: "userFullName",
    },
    {
      title: "Xizmat nomi",
      dataIndex: "serviceItemName",
    },
    {
      title: "Ma'lumotlar",
      dataIndex: "madCardId",
      render: (madCardId, obj) => (
        <Button onClick={() => showOldOnesModal(madCardId, obj)}>Batafsil</Button>
      ),
    },
  ];
  const GetTreatedPatients = (p, s) => {
    TreatedGet(p, s).then((res) => {
      setListColumns(res.data.content);
      setTotalElements(res.data.totalElements);
      setTreatedLoading(false)
    });
  };

  useEffect(() => {
    GetTreatedPatients();
    setLoading(false);
  }, []);

  const showModal = (madCardId) => {
    setVisible(true);
    GetMedCardById(madCardId).then((res) => {
      setById(res.data.cardContext);
    });
  };

  const showOldOnesModal = (madCardId, object) => {
    setoldvisible(true);
    setfileUrls(object.fileUrls);

    GetMedCardById(madCardId).then((res) => {
      setByIdOldOnes(res.data.cardContext);
    });
  };
  const onCancel = () => {
    oldforma.resetFields();
    setoldvisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
    window.location.reload();
  };

  const OldOnes = (userId, p = 1, s = 10) => {
    setIsOld(!isold);
    setModalVisible(!modalvisible);
    GetAllUserMedCardEnabled(userId, p, s).then((res) => {
      setUsedMedCards(res.data.content);
      setOlnOnesTotalEelements(res.data.totalElements);
    });
  };
  const back = () => {
    setIsOld(true);
    setModalVisible(!modalvisible);
  };
  return (
    <React.Fragment>
      {loading ? (
        <Skeleton key="treatedskeleton" active />
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
          columns={treatedColumns}
          dataSource={listColumns}
          rowKey={(obj) => obj.madCardId}
          scroll={{ x: 800 }}
          className="w-100"
          loading={treatedloading}
        />
      )}
      <Modal
        key="info_med_cards_modal"
        width={1000}
        centered
        visible={visible}
        title={
          modalvisible ? (
            "Medkarta ma'lumotlari"
          ) : (
            <div key="medical_kartalar">
              <Tag key="tag_treated" onClick={back}>
                <TiArrowBackOutline />
              </Tag>

              <span>Eski medkartalar ro'yxati</span>
            </div>
          )
        }
        onCancel={handleCancel}
        footer={[
          <>
            <Button key="back" onClick={handleCancel}>
              Yopish
            </Button>
            <Button
              key="old"
              disabled={!isold}
              type="primary"
              onClick={() => OldOnes(userId)}
            >
              Eski medkartalarini ko'rish
            </Button>
          </>,
        ]}
      >
        {modalvisible ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gridColumnGap: "1.5rem",
              gridRowGap: "1.5rem",
              width: "100%",
              height: "100%",
            }}
            key="byid_med_cards"
          >
            <Tabs direction="ltr" tabPosition="left">
              {byId.map((item, index) => {
                return (
                  <TabPane key={index} tab={item.title}>
                    <CKEditor
                      editor={ClassicEditor}
                      data={item.context}
                      onChange={(_, editor) => editor.getData()}
                      key="byid_ckeditor"
                    />
                  </TabPane>
                );
              })}
            </Tabs>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gridColumnGap: "1.5rem",
              gridRowGap: "1.5rem",
              width: "100%",
            }}
            key="not_buyid_med_cards"
          >
            <Table
              pagination={{
                current: oldcurrentPage,
                total: oldtotalElements,
                pageSize: 10,
                onChange: handleOldonesPagination,
                showTotal: (oldtotalElements) => `ВСЕ: ${oldtotalElements}`,
              }}
              tableLayout="fixed"
              bordered
              size="small"
              dataSource={usedMedCards}
              columns={oldtreatedcolumns}
              rowKey="used_med_cards_table"
            />
          </div>
        )}
      </Modal>
      <ModalOldOnes
        fileUrls={fileUrls}
        visible={oldvisile}
        byIdOldOnes={byIdOldOnes}
        onCancel={onCancel}
        oldforma={oldforma}
        key="byIdOldOnes_modal"
      />
    </React.Fragment>
  );
};

export default TreatedP;
