import { DownloadOutlined, FileAddOutlined } from "@ant-design/icons";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Card, Form, Modal, Radio, Tabs, Tag, Upload, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { TiArrowBackOutline } from "react-icons/ti";
import { deleteUploadFile, getUploadFile, orderFileUpload, orderMedCardCreate } from "../server/config/order";
import { UnFinishedDeleteGet } from "../server/config/treated";
import {
  getTemp,
  getTempeditData,
  getTempSave,
} from "../server/Template/config/template";
import UserMedForm from "./UserMedForm";

const { TabPane } = Tabs;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const UnfinishedModal = React.memo(({
  visible,
  onCancel,
  form,
  userServisId,
  selected,
  setSelected,
  setVisible,
  GetUnfinishedUserMedCards
}) => {
  const [index, setIndex] = useState(0);
  const [isdisabled, setisdisabled] = useState(true);
  const [temps, setTemps] = useState([]);
  const [objects, setObjects] = useState([]);
  const [orderObjForm] = Form.useForm();
  const [filesId, setFilesId] = useState([]);

  const StandartTemps = (page, size) => {
    getTemp(page, size).then(({ data }) => {
      setTemps(data.content);
    });
  };

  const SavedTemps = (page, size) => {
    getTempSave(page, size).then(({ data }) => {
      setTemps(data.content);
    });
  };
  useEffect(() => {
    StandartTemps();
  }, []);
  const handleTabChange = (key) => {
    if (key === "1") {
      StandartTemps();
    } else {
      SavedTemps();
    }
  };

  const next = () => {
    if (selected) {
      orderObjForm.validateFields().then((newvalues) => {
        orderMedCardCreate(objects, newvalues, userServisId, filesId, temps[index]);
      }).then(() => message.success("Muvaffaqiyatli saqlandi!!!",[0.6])).catch(() => message.error("Qandaysdir xato yuzaga keldi.Qayta urinib ko'ring!!!",[0.6]))
      UnFinishedDeleteGet(userServisId.orderId);
      GetUnfinishedUserMedCards()
      setVisible(false);
    } else {
      setSelected(true);
      let { templateId } = temps[index];
      getTempeditData(templateId).then(({ data }) => {
        setObjects(data);
      });
    }
  };
  const back = () => {
    setSelected("");
    setisdisabled(true);
  };


  const fileRemove = (file) => {
    let udiObjects = filesId.filter((item) => item.uid !== file.uid);
    let uidObj = filesId.filter((item) => item.uid === file.uid);
    if (uidObj.length)
      deleteUploadFile(uidObj[0].orderHistoryId, userServisId.userId)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    if (uidObj.length) setFilesId(udiObjects);
  };

  const fileDownload = (file) => {
    let [uidObj] = filesId.filter((item) => item.uid === file.uid);
    if (uidObj) getUploadFile(uidObj.orderHistoryId, file.name);
  };

  const fileRequest = ({ file, onError, onProgress, onSuccess }) => {
    let formData = new FormData();
    formData.append("file", file);
    orderFileUpload(formData, onProgress, userServisId.userId)
      .then(({ data }) => {
        console.log("orderhistoryid", data);
        setFilesId((prev) => [
          ...prev,
          {
            orderHistoryId: data,
            uid: file.uid,
          },
        ]);
        onSuccess();
      })
      .catch(() => {
        onError();
      });
  };
  return (
    <div>
      <Modal
        onOk={next}
        okButtonProps={{ disabled: isdisabled }}
        onCancel={onCancel}
        okText={selected ? "Сохранить" : "Следующий"}
        cancelText={selected ? "предыдущие медицинские карты" : "отмена"}
        visible={visible}
        closable={false}
        maskClosable={false}
        title={[
          <div>
            {selected && (
              <Tag key="un_tag" onClick={back}>
                <TiArrowBackOutline />
              </Tag>
            )}
            <span>Медицинская карта пациента</span>
          </div>,
        ]}
        className="w-100"
      >
        {selected ? (
          <Tabs tabPosition="left">
            <TabPane tab="Информация о пациенте" key="1">
              <UserMedForm userId={userServisId.userId} useMedForm={form} />
            </TabPane>
            {objects.map((item, index) => (
              <TabPane
                forceRender={true}
                tab={`Шаблон №${index}`}
                key={`${index + 2}`}
              >
                <Form name="useMedForm" form={orderObjForm} {...layout}>
                  <Form.Item
                    initialValue={item.context}
                    noStyle
                    name={`context/${index}`}
                    key={`context/${index}`}
                    getValueFromEvent={(_, editor) => editor.getData()}
                  >
                    <CKEditor editor={ClassicEditor} data={item.context} />
                  </Form.Item>
                </Form>
              </TabPane>
            ))}
            <TabPane tab="File upload" key="1000">
              <Upload
                multiple
                listType="picture"
                onRemove={fileRemove}
                onDownload={fileDownload}
                customRequest={fileRequest}
                showUploadList={{
                  showDownloadIcon: true,
                  downloadIcon: <DownloadOutlined />,
                }}
              >
                <Button type="primary">Upload</Button>
              </Upload>
            </TabPane>
          </Tabs>
        ) : (
          <div>
            <Radio.Group
              buttonStyle="solid"
              className="w-100"
              size="middle"
              onChange={(e) => {
                setIndex(e.target.value);
                setisdisabled(false);
              }}
            >
              <Tabs defaultActiveKey="1" centered onChange={handleTabChange}>
                <TabPane tab="Стандарт" key="1">
                  <div className="booking_modal_cont">
                    {temps.map((item, index) => (
                      <Card
                        key={index}
                        title={
                          <div className="temp_maincont_card_head">
                            <span className="temp_maincont_card_tit">
                              {item.title}
                            </span>
                            <Radio.Button value={index}>
                              <FileAddOutlined />
                            </Radio.Button>
                          </div>
                        }
                        className="temp_card"
                        hoverable
                      >
                        {item.description}
                      </Card>
                    ))}
                  </div>
                </TabPane>
                <TabPane tab="Сохранено" key="2">
                  <div className="booking_modal_cont">
                    {temps.map((item, index) => (
                      <Card
                        key={index}
                        title={
                          <div className="temp_maincont_card_head">
                            <span className="temp_maincont_card_tit">
                              {item.title}
                            </span>
                            <Radio.Button value={index}>
                              <FileAddOutlined />
                            </Radio.Button>
                          </div>
                        }
                        className="temp_card"
                        hoverable
                      >
                        {item.description}
                      </Card>
                    ))}
                  </div>
                </TabPane>
              </Tabs>
            </Radio.Group>
          </div>
        )}
      </Modal>
    </div>
  );
}
)
export default UnfinishedModal;
