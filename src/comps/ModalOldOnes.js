import { DownloadOutlined } from "@ant-design/icons";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Form, Modal, Tabs, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { getOrderFilesInfo, getUploadFile } from "../server/config/order";
const { TabPane } = Tabs;

const ModalOldOnes = React.memo(
  ({ visible, byIdOldOnes, onCancel, fileUrls = [],oldforma }) => {
    const [fileList, setfileList] = useState([]);

    function bytesToSize(bytes) {
      let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes === 0) return "0 Byte";
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    }

    useEffect(() => {
      if (fileUrls.length)
        getOrderFilesInfo(fileUrls).then((res) => {
          console.log("keldi", res.data);
          if (res) {
            let list = res.data.files.map((elem) => {
              let size = bytesToSize(elem.size);
              return {
                uid: elem.fileId,
                name: elem.name,
                status: "done",
                size,
              };
            });
            setfileList(list);
          }
        });
    }, [fileUrls]);

    const fileDownload = (file) => {
      getUploadFile(file.uid, file.name);
    };

    return (
      <div>
        <Modal
          cancelText="Close"
          width={1000}
          visible={visible}
          onCancel={onCancel}
          title="Eski medkartalar"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gridColumnGap: "1.5rem",
              gridRowGap: "1.5rem",
              width: "100%",
            }}
          >
            <Tabs tabPosition="left" >
              {byIdOldOnes.map((item, index) => {
                return (
                  <TabPane key={`${item.sequence}`} tab={item.title}>
                    <Form name="oldform" form={oldforma}>
                      <Form.Item initialValue={item.context} key={index}>
                        <CKEditor
                          editor={ClassicEditor}
                          data={item.context}
                          onChange={(_, editor) => editor.getData()}
                        />
                      </Form.Item>
                    </Form>
                  </TabPane>
                );
              })}
              <TabPane tab="Uploaded files" key="1000" >
                {fileList.length !== 0 ? (
                  <Upload
                  style={{width:"600px"}}
                    multiple
                    listType="picture"
                    onDownload={fileDownload}
                    showUploadList={{
                      showPreviewIcon:true,
                      showDownloadIcon: true,
                      downloadIcon: <DownloadOutlined />,
                      previewIcon: <DownloadOutlined />,
                      showRemoveIcon: true,
                      removeIcon: (file) => <span>{file.size}</span>,
                    }}
                    fileList={fileList}
                  />
                ) : (
                  <p>No Uploaded files</p>
                )}
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
);

export default ModalOldOnes;
