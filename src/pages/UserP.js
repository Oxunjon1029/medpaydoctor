import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  message,
  Tabs,
  Button,
  Upload,
  Modal,
  DatePicker,
  InputNumber,
} from "antd";
import { userEdit, userGet } from "../server/config/user";
import { GetLanguageConfig } from "../server/config/lang";
import { Speciality } from "../server/config/speciality";
import { deleteFile, fileUpload } from "../server/config/fileUpload";
import { API_URL } from "../assets/constants";
import Text from "antd/lib/typography/Text";
const { Option } = Select;

const { TabPane } = Tabs;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const UserP = () => {
  const dataProfessions = {
    "ВРАЧ-ХИРУРГ": [
      "общая",
      "челюстно- лицевая",
      "ортопедическая",
      "протезная",
      "пластическая",
      "стоматологическая",
      "колопроктологическая",
      "гинекологическая",
      "кардиологическая",
      "нейрохирургия",
      "офтальмохирургия",
      "хирургия ЛОР органо",
    ],
    "ВРАЧ - АЛЛЕРГОЛОГ": ["ВРАЧ - АЛЛЕРГОЛОГ"],
    "ВРАЧ - АНЕСТЕЗИОЛОГ - РЕАНИМАТОЛОГ": [
      "ВРАЧ - АНЕСТЕЗИОЛОГ - РЕАНИМАТОЛОГ",
    ],
    "ВРАЧ - КАРДИОЛОГ": ["ВРАЧ - КАРДИОЛОГ"],
  };

  const [form] = Form.useForm();
  useEffect(() => {
    userGet().then((res) => {
      let data = {};
      res.data.forEach((item) => {
        const {
          language,
          imageUrl,
          academicPosition,
          anyWorkingExperience,
          birthDate,
          contactInfo,
          diploma,
          genderEnum,
          internCompany,
          patientsRecovered,
          scientificWorks,
          speakingLanguages,
          specialityIdList,
          yearsExperience,
          doctorId,
          ...rest
        } = item;
        data[language] = { ...rest };
        setDoctorBirthDate(birthDate);
        setDoctorDiploma(diploma);
        setDoctorid(doctorId);
        data = {
          ...data,
          imageUrl,
          academicPosition,
          anyWorkingExperience,
          contactInfo,
          diploma,
          genderEnum,
          internCompany,
          patientsRecovered,
          scientificWorks,
          speakingLanguages,
          specialityIdList,
          yearsExperience,
          doctorId,
        };
        setUrlImage(imageUrl);
        setFileList([{ url: `${API_URL}files/public/${imageUrl}` }]);
        setPreviewImage(`${API_URL}files/public/${imageUrl}`);
      });
      form.setFieldsValue(data);
    });
  }, [form]);
  const [lang, setLang] = useState([]);

  // doctorget and getlanguage useEffect
  useEffect(() => {
    GetLanguageConfig()
      .then((res) => {
        setLang(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  // getspeciality
  const [speciality, setSpeciality] = useState([]);

  useEffect(() => {
    Speciality()
      .then((res) => {
        setSpeciality(res.data.content);
      })
      .catch((er) => {
        console.log(er);
      });
  }, []);
  // upload img
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [urlImage, setUrlImage] = useState("");

  const handleChange = (info) => {
    if (info.fileList.length !== 0) {
      let fileListInfo = [...info.fileList];
      setFileList(fileListInfo);
      fileUpload(info.fileList[0].originFileObj, "files/public/")
        .then((res) => {
          message.success("Rasm yuklandi",[0.3])
          setUrlImage(res.data);
        })
        .catch((err) => {
          message.error("Qandaydir xatolik yuz berdi",[0.3]);
        });
    }
  };
  const handlePreview = () => {
    setPreviewVisible(true);
    setPreviewImage(`${API_URL}files/public/${urlImage}`);
  };

  const deleteImg = () => {
    deleteFile(urlImage)
      .then(() => {
        message.success("Rasm o'chirildi",[0.3])
      })
      .catch((err) => {
        message.error("Qandaydir xatolik yuz berdi",[0.4]);
      });
    setFileList([]);
  };

  const [doctorBirthDate, setDoctorBirthDate] = useState("");
  const [doctorDiploma, setDoctorDiploma] = useState("");
  const [doctorID, setDoctorid] = useState("");

  const onFinish = () => {
    form
      .validateFields()
      .then((res) => {
        const {
          academicPosition,
          anyWorkingExperience,
          birthDate,
          contactInfo,
          diploma,
          genderEnum,
          internCompany,
          patientsRecovered,
          scientificWorks,
          speakingLanguages,
          specialityIdList,
          yearsExperience,
          doctorId,
          ...rest
        } = res;

        const { uz, ru, ...remain } = res;
        let data = Object.keys(rest).map((item) => {
          return {
            ...rest[item],
            language: item,
            imageUrl: urlImage,
            diploma: diploma ? diploma : doctorDiploma,
            doctorId: doctorId ? doctorId : doctorID,
            ...remain,
            birthDate: birthDate
              ? birthDate.format("YYYY-MM-DD")
              : doctorBirthDate,
          };
        });
        userEdit(data);
        message.success("Siz muvafaqqiyatli ma'lumotlaringizni yangiladingiz",[0.5]);
      })
      .catch(() => {
        message.error(
          "Sizni ma'lumotlaringizni yangilashda muammolar bor,qaytadan urinib ko'ring!!!",[0.5]
        );
      });
  };
  const [dataSpesialnost, setDataSpesialnost] = useState([]);
  const handleSpesializatsiya = (value) => {
    setDataSpesialnost(
      value.reduce((sum, item) => sum.concat(dataProfessions[item]), [])
    );
  };
  return (
    <div style={{ width: "85%", margin: "0 auto" }}>
      <Form
        {...layout}
        form={form}
        onFinish={onFinish}
        key={Math.random()}
      >
        <Tabs defaultActiveKey="1" centered>
          <TabPane className="flex-center" tab="Asosiy malumotlari" key="1">
            {lang.map((item, index) => (
              <div className="width-60" key={index}>
                <h3 style={{ margin: "30px 0" }}>
                  <Text code>{item}</Text> da kiritiladigan ma'lumotlar
                </h3>
                <Form.Item
                  label={item === "ru" ? "Имя" : "Ismi"}
                  name={[item, "name"]}
                  rules={[
                    { required: true, message: "Doktor ismini kiriting!" },
                  ]}
                  key="name"
                >
                  <Input />
                </Form.Item>
              </div>
            ))}
            <div className="width-60">
              <Form.Item
                label="Mutaxasislikni tanlang"
                name="specialityIdList"
                rules={[
                  {
                    required: true,
                    message: "Iltimos dokrtorning mutaxasisliklarini tanlang",
                  },
                ]}
                key="specialityIdList"
              >
                <Select mode="multiple">
                  {speciality.map((item) => (
                    <Option value={item.specialityId} key={item.specialityId}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Doktor rasmi:"
                className="image-upload"
                {...layout}
                key="image-upload"
              >
                <Upload
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={(file) => handlePreview(file)}
                  onChange={handleChange}
                  onRemove={deleteImg}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept=".jpg, .jpeg, .png, .pdf"
                  key="uploader"
                >
                  {fileList.length !== 0 ? (
                    ""
                  ) : (
                    <div key={Math.random()}>
                      <div className="ant-upload-text">Rasmni yuklang</div>
                    </div>
                  )}
                </Upload>
                <Modal
                  visible={previewVisible}
                  footer={null}
                  onCancel={() => setPreviewVisible(false)}
                  cancelText="Yopish"
                  key={Math.random()}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </Form.Item>
              <Form.Item
                label="Jinsi"
                name="genderEnum"
                rules={[{ required: true, message: "Doktor jinsini tanlang!" }]}
                key="genderEnum"
              >
                <Select>
                  <Option key="MALE" value="MALE">Male</Option>
                  <Option key="FEMALE" value="FEMALE">Female</Option>
                </Select>
              </Form.Item>
            </div>
          </TabPane>
          <TabPane className="flex-center" tab="Shaxsiy malumotlari" key="4">
            <div className="width-60" key={Math.random()}>
              <Form.Item label="Tug'ilgan sanasi:" name="birthDate" key="birthDate">
                <DatePicker  style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Qanday tillarni biladi"
                name="speakingLanguages"
                key="speakingLanguages"
              >
                <Select mode="multiple">
                  <Option key="en" value="en">English</Option>
                  <Option key="ru" value="ru">Rus</Option>
                  <Option key="german" value="german">German</Option>
                  <Option key="china" value="china">China</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Kontakt malumotlari (tel)"
                name="contactInfo"
                key="contactInfo"
              >
                <Input />
              </Form.Item>
            </div>
            {lang.map((item, index) => (
              <div className="width-60" key={index}>
                <h3 style={{ margin: "30px 0" }}>
                  <Text  code>{item}</Text> da kiritiladigan ma'lumotlar
                </h3>

                <Form.Item
                  label={item === "ru" ? "Специализация" : "Ixtisosligi"}
                  name={[item, "profession"]}
                  key="profession"
                >
                  <Select onChange={handleSpesializatsiya} mode="multiple">
                    {Object.keys(dataProfessions).map((item,index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label={
                    item === "ru"
                      ? "Специальность"
                      : "Doktor mutaxasisliklarini kiriting"
                  }
                  name={[item, "speciality"]}
                  key="speciality"
                >
                  <Select mode="multiple">
                    {dataSpesialnost.map((item,index) => (
                      <Option key={index} value={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            ))}
          </TabPane>
          <TabPane className="flex-center" tab="Ta'lim jarayoni" key="2">
            <div className="width-60" key={Math.random()}>
              <Form.Item
                label="Muaxasislik bo'yicha ish staji( Стаж работы по специальности (лет) )"
                name="anyWorkingExperience"
                key="anyWorkingExperience"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Aynan shu muaxasislik bo'yicha ish staji (Стаж работы по данной специализации (лет))"
                name="yearsExperience"
                key="yearsExperience"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="Qancha muddat amaliyot o'tagan( Стажировки (лет) )"
                name="internCompany"
                key="internCompany"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Diplom seriyasi(Идентификационный номер диплома)"
                name="diploma"
                key="diploma"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ilmiy ishlari soni (Научные работы (количество шт)):"
                name="scientificWorks"
                key="scientificWorks"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Akademik unvoni (Ученое звание):"
                name="academicPosition"
                key="academicPosition"
              >
                <Select>
                  <Option key="Dotsent" value="Dotsent">Dotsent</Option>
                  <Option key="Professor" value="Professor">Professor</Option>
                  <Option key="Academic" value="Academic">Academic</Option>
                </Select>
              </Form.Item>
            </div>
            {lang.map((item, index) => (
              <div className="width-60" key={index}>
                <h3 style={{ margin: "30px 0" }}>
                  <Text  code>{item}</Text> da kiritiladigan ma'lumotlar
                </h3>

                <Form.Item
                  label={
                    item === "ru"
                      ? "Где получил образование"
                      : "Tamomlagan bilim yurti"
                  }
                  name={[item, "graduatedUniversity"]}
                  key="graduatedUniversity"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={
                    item === "ru"
                      ? "Повышение квалификации"
                      : "Malaka oshirish joyi"
                  }
                  name={[item, "training"]}
                  key="training"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={item === "ru" ? "Ученая степень" : "Akademik darajasi"}
                  name={[item, "academicDegree"]}
                  key="academicDegree"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={
                    item === "ru"
                      ? "Учебные курсы"
                      : "Qanday o'quv kurslarini bitirgan"
                  }
                  name={[item, "lessons"]}
                  key="lessons"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    item === "ru"
                      ? "Прежние места работы:"
                      : "Oldingi ish joyi:"
                  }
                  name={[item, "previousWorkingClinics"]}
                  key="previousWorkingClinics"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={item === "ru" ? "Грамоты:" : "Erishgan yutuqlari:"}
                  name={[item, "trophies"]}
                  key="trophies"
                >
                  <Input />
                </Form.Item>
              </div>
            ))}
          </TabPane>
          <TabPane className="flex-center" tab="Tajribasi" key="3">
            <div className="width-60">
              <Form.Item
                label="Davolagan bemorlari soni(Ориентировочное количество больных получивших консультацию):"
                name="patientsRecovered"
                key="patientsRecovered"
              >
                <InputNumber />
              </Form.Item>
            </div>
            {lang.map((item, index) => (
              <div className="width-60" key={index}>
                <h3 style={{ margin: "30px 0" }}>
                  <Text  code>{item}</Text> da kiritiladigan ma'lumotlar
                </h3>

                <Form.Item
                  label={item === "ru" ? "Категория" : "Toifasi qanday:"}
                  name={[item, "category"]}
                  key="category"
                >
                  <Select>
                    <Option value={item === "ru" ? "Высшая" : "Oliy"} key="Oliy">
                      {item === "ru" ? "Высшая" : "Oliy"}
                    </Option>
                    <Option value={item === "ru" ? "Первая" : "Birinchi"} key="Birinchi">
                      {item === "ru" ? "Первая" : "Birinchi"}
                    </Option>
                    <Option value={item === "ru" ? "Вторая" : "Ikkinchi"} key="Ikkinchi">
                      {item === "ru" ? "Вторая" : "Ikkinchi"}
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label={
                    item === "ru"
                      ? "На каких видах медоборудования имеет право и квалификацию работать:"
                      : "Qanday tibbiy uskunalardan foydalana oladi:"
                  }
                  name={[item, "medicalEquipmentAbility"]}
                  key="medicalEquipmentAbility"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    item === "ru"
                      ? "Какие болезни лечит:"
                      : "Qanday kasalliklarni davolagan:"
                  }
                  name={[item, "sicknessSpeciality"]}
                  key="sicknessSpeciality"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    item === "ru"
                      ? "Какие лечебные процедуры проводит:"
                      : "Davolash usullari qanday:"
                  }
                  name={[item, "treatmentProcedures"]}
                  key="treatmentProcedures"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    item === "ru" ? "Кому подчиняется:" : "Kimga bo'ysunadi:"
                  }
                  name={[item, "boss"]}
                  key="boss"
                >
                  <Input />
                </Form.Item>
              </div>
            ))}
          </TabPane>
        </Tabs>
        <Form.Item key={Math.random()}>
          <Button type="primary" htmlType="submit">
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserP;
