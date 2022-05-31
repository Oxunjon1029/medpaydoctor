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
import { GetAllLang, GetLanguageConfig } from "../server/config/lang";
import { GetSpecializationDirections, Speciality, Specializations } from "../server/config/speciality";
import { deleteFile, fileUpload } from "../server/config/fileUpload";
import Text from "antd/lib/typography/Text";
import moment from "moment";
const { Option } = Select;

const { TabPane } = Tabs;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const UserP = () => {
  const [form] = Form.useForm();
  const [academicTitle, setAcademicTitle] = useState([]);
  useEffect(() => {
    userGet().then((res) => {
      const essentialData = { ...res.data.doctor, ...res.data.user }
      let birth = moment(res.data.user.birthday, "YYYY-MM-DD");
      setUrlImage(res.data.user?.avatar)
      const link = res.data.user?.avatar
      const file = {
        uid: link,
        name: 'image',
        status: 'done',
        thumbUrl: link,
        url: link,
      };

      setAcademicTitle((item) => [
        ...item, { id: res.data.doctor.academic_title['id'], name: res.data.doctor.academic_title['name'] }
      ])
      console.log(res.data.doctor.academic_title, +" " + academicTitle);
      setFileList([file]);
      setDoctorBirthDate(birth)
      form.setFieldsValue(essentialData);
    });
  }, [form]);
  const [lang, setLang] = useState([]);

  // doctorget and getlanguage useEffect
  useEffect(() => {
    GetLanguageConfig()
      .then((res) => {
        setLang(res.data);
      })
      .catch((error) => {
        // console.log(error);
      });
  }, []);
  // getspeciality
  const [speciality, setSpeciality] = useState([]);

  useEffect(() => {
    Speciality()
      .then((res) => {
        setSpeciality(res.data);
      })
      .catch((er) => {
        // console.log(er);
      });
  }, []);
  // getspecializtions
  const [specialization, setSpecialization] = useState([])
  const [specializtionDirections, setSpecializationDirections] = useState([]);
  // const [specializationID, setSpecializationID] = useState("");
  useEffect(() => {
    Specializations().then((res) => {
      setSpecialization(res.data)
      // console.log(res.data[0].id);
      GetSpecializationDirections(res.data[0].id).then((res) => {
        setSpecializationDirections(res.data);
      })
    }).catch((err) => { })
  }, [])
  // upload img
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [urlImage, setUrlImage] = useState("");

  const handleChange = (info) => {
    if (info.fileList.length !== 0) {
      let fileListInfo = [...info.fileList];
      setFileList(fileListInfo);
      // fileUpload(info.fileList[0].originFileObj)
      //   .then((res) => {
      //     message.success("Rasm yuklandi", [0.3])
      //     setUrlImage(res.data);
      //   })
      //   .catch((err) => {
      //     message.error("Qandaydir xatolik yuz berdi", [0.3]);
      //   });
    }
  };
  const handlePreview = () => {
    setPreviewVisible(true);
    setPreviewImage(urlImage);
  };

  const deleteImg = () => {
    deleteFile(urlImage)
      .then(() => {
        message.success("Rasm o'chirildi", [0.3])
      })
      .catch((err) => {
        message.error("Qandaydir xatolik yuz berdi", [0.4]);
      });
    setFileList([]);
  };

  const [doctorBirthDate, setDoctorBirthDate] = useState("");

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        const data = {
          avatar: fileList,
          specialties: values.specialty,
          academic_title_id: values.academic_title,
          specializations: values.specializations,
          languages: values.languages,
          directions: values.directions,
          ...values
        }
        console.log(data);
        userEdit(data).then((res) => {
          message.success("Siz muvafaqqiyatli ma'lumotlaringizni yangiladingiz", [0.5]);
        }).catch((err) => {
          message.error(err.response.data.message)
        });
      })
      .catch(() => {
        message.error(
          "Sizni ma'lumotlaringizni yangilashda muammolar bor,qaytadan urinib ko'ring!!!", [0.5]
        );
      });
  };
  const handleSpesializatsiya = (value) => {
    GetSpecializationDirections(value[0]).then((res) => {
      if (res && res.status === 200 && res.data) {
        // setSpecializationDirections(el => el = res.data);
      }
    }).catch((err) => { })
  }

  const [allLang, setAllLang] = useState([]);
  useEffect(() => {
    GetAllLang().then((res) => {
      setAllLang(res.data);
    }).catch((err) => { })
  }, [])
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
            {lang.map(({ url }, index) => (
              <div className="width-60" key={index}>
                <h3 style={{ margin: "30px 0" }}>
                  <Text code>{url}</Text> da kiritiladigan ma'lumotlar
                </h3>
                <Form.Item
                  label={url === "ru" ? "Имя" : "Ismi"}
                  name={["fio", url]}
                  rules={[
                    { required: true, message: "Doktor ismini kiriting!" },
                  ]}
                  key="fio"
                >
                  <Input />
                </Form.Item>
              </div>
            ))}
            <div className="width-60">
              <Form.Item
                label="Mutaxasislikni tanlang"
                name="specialty"
                rules={[
                  {
                    required: true,
                    message: "Iltimos dokrtorning mutaxasisliklarini tanlang",
                  },
                ]}
                key="specialty"
              >
                <Select mode="multiple" >
                  {speciality.map((item) => (
                    <Option value={item.id} key={item.id}>
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
                name="gender"
                rules={[{ required: true, message: "Doktor jinsini tanlang!" }]}
                key="gender"
              >
                <Select>
                  <Option key="MALE" value="male">male</Option>
                  <Option key="FEMALE" value="female">female</Option>
                </Select>
              </Form.Item>
            </div>
          </TabPane>
          <TabPane className="flex-center" tab="Shaxsiy malumotlari" key="4">
            <div className="width-60" key={Math.random()}>
              <Form.Item label="Tug'ilgan sanasi:" key="birthday">
                <DatePicker defaultValue={doctorBirthDate ? doctorBirthDate : ""} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Qanday tillarni biladi"
                name="languages"
                key="languages"
              >
                <Select mode="multiple">
                  {allLang.map((item) =>
                  (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  )
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                label="Kontakt malumotlari (tel)"
                name="phone"
                key="phone"
              >
                <Input />
              </Form.Item>
            </div>



            <Form.Item
              name="specializations"
              key="specializations"
            >
              <Select onChange={handleSpesializatsiya} mode="multiple" >
                {specialization.map((item, index) => (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="directions"
              key="directions"
            >
              <Select mode="multiple">
                {specializtionDirections.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

          </TabPane>
          <TabPane className="flex-center" tab="Ta'lim jarayoni" key="2">
            <div className="width-60" key={Math.random()}>
              <Form.Item
                label="Muaxasislik bo'yicha ish staji( Стаж работы по специальности (лет) )"
                name="exactly_specialty_experience"
                key="exactly_specialty_experience"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Aynan shu muaxasislik bo'yicha ish staji (Стаж работы по данной специализации (лет))"
                name="specialty_experience"
                key="specialty_experience"
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                label="Qancha muddat amaliyot o'tagan( Стажировки (лет) )"
                name="internships"
                key="internships"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Diplom seriyasi(Идентификационный номер диплома)"
                name="diplom_series"
                key="diplom_series"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Ilmiy ishlari soni (Научные работы (количество шт)):"
                name="scientific_works"
                key="scientific_works"
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Akademik unvoni (Ученое звание):"
                name="academic_title"
                key="academic_title"
              >
                <Select>
                  {academicTitle.map((item) => (
                    <Option value={item.id} key={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {lang.map(({ url }, index) => (
              <div className="width-60" key={index}>
                <h3 style={{ margin: "30px 0" }}>
                  <Text code>{url}</Text> da kiritiladigan ma'lumotlar
                </h3>

                <Form.Item
                  label={
                    url === "ru"
                      ? "Где получил образование"
                      : "Tamomlagan bilim yurti"
                  }
                  name={["university", url]}
                  key="university"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={
                    url === "ru"
                      ? "Повышение квалификации"
                      : "Malaka oshirish joyi"
                  }
                  name={["professional_development", url]}
                  key="professional_development"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={url === "ru" ? "Ученая степень" : "Akademik darajasi"}
                  name={["academic_degree", url]}
                  key="academic_degree"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={
                    url === "ru"
                      ? "Учебные курсы"
                      : "Qanday o'quv kurslarini bitirgan"
                  }
                  name={["training_courses", url]}
                  key="training_courses"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    url === "ru"
                      ? "Прежние места работы:"
                      : "Oldingi ish joyi:"
                  }
                  name={["previous_workplace", url]}
                  key="previous_workplace"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label={url === "ru" ? "Грамоты:" : "Erishgan yutuqlari:"}
                  name={["achievements", url]}
                  key="achievements"
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
                name="treated_patients"
                key="treated_patients"
              >
                <InputNumber />
              </Form.Item>
            </div>
            {lang.map(({ url }, index) => (
              <div className="width-60" key={index}>
                <h3 style={{ margin: "30px 0" }}>
                  <Text code>{url}</Text> da kiritiladigan ma'lumotlar
                </h3>

                <Form.Item
                  label={url === "ru" ? "Категория" : "Toifasi qanday:"}
                  name={["category", url]}
                  key="category"
                >
                  <Select>
                    <Option value={url
                      === "ru" ? "Высшая" : "Oliy"} key="Oliy">
                      {url
                        === "ru" ? "Высшая" : "Oliy"}
                    </Option>
                    <Option value={url
                      === "ru" ? "Первая" : "Birinchi"} key="Birinchi">
                      {url
                        === "ru" ? "Первая" : "Birinchi"}
                    </Option>
                    <Option value={url
                      === "ru" ? "Вторая" : "Ikkinchi"} key="Ikkinchi">
                      {url
                        === "ru" ? "Вторая" : "Ikkinchi"}
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label={
                    url === "ru"
                      ? "На каких видах медоборудования имеет право и квалификацию работать:"
                      : "Qanday tibbiy uskunalardan foydalana oladi:"
                  }
                  name={["used_medical_equipment", url]}
                  key="used_medical_equipment"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    url === "ru"
                      ? "Какие болезни лечит:"
                      : "Qanday kasalliklarni davolagan:"
                  }
                  name={["treated_diseases", url]}
                  key="treated_diseases"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    url === "ru"
                      ? "Какие лечебные процедуры проводит:"
                      : "Davolash usullari qanday:"
                  }
                  name={["methods_treatment", url]}
                  key="methods_treatment"
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={
                    url === "ru" ? "Кому подчиняется:" : "Kimga bo'ysunadi:"
                  }
                  name={["to_whom_obey", url]}
                  key="to_whom_obey"
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
