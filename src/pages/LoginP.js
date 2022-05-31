import React, { useState } from "react";
import axios from "axios";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  message,
  Avatar,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { setCookie } from "../functions/useCookies";
import { API_URL, TOKEN } from "../assets/constants";
import { loginUser } from "../server/config/auth";
import "../style/loginpage.css";
const { Title } = Typography;

const LoginP = () => {
  const [isSubmitting, setSubmitting] = useState(false);

  const [loginForm] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    setSubmitting(true);
    loginUser(values)
      .then((res) => {
        console.log('asd', res);
        if (res && res.status === 200 && res.data) {
          console.log(res.data.token);
          setCookie(TOKEN, res.data.token);
          const headers = {
            "Accept": "application/json",
            Authorization: `Bearer ${res.data.token}`,
          };
          axios
          .get(API_URL + "doctor/information/data/get", {
            headers,
          }).then((data) => {
            console.log(data);
            window.location.href = "/dashboard";
            }).catch((err) => {
              console.log(err);
            })
          // .then((res) => {
          // setCookie("doctorId", res.data[0].doctorId);
          // axios
          //   .get(API_URL + "schedule/doctor/" + res.data[0].doctorId, {
          //     headers,
          //   })
          //   .then((res) => {
          //     // localStorage.setItem(
          //     //   "activeId",
          //     //   res.data.doctorSchedule.length > 0 &&
          //     //     res.data.doctorSchedule[0].timetableObjectId
          //     //     ? res.data.doctorSchedule[0].timetableObjectId
          //     //     : null
          //     // );
          //   });
          // })
          // .catch((err) => {
          //   setSubmitting(false);
          //   message.error(err.response.data.message, [0.5]);
          //   console.log(err);
          // });
        } else {
          message.error(
            "Ошибка логина или пароля! Пожалуйста, попробуйте еще раз :))",
            [0.5]
          );
          loginForm.resetFields();
          setSubmitting(false);

        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.log(err.response);
      });
  };
  return (
    <div className='essential_container_login_page'>
      <Row
        key='login_row'
        justify='center'
        align='middle'
        className='essential_row'>
        <div className='login_avatar_div'>
          <Avatar size={75} className='login_avatar' icon={<UserOutlined />} />
        </div>
        <Col xs={20} sm={12} md={16} lg={16}>
          <Title level={3} className='text-center login_title'>
            Войдите в свой кабинет на сайте
          </Title>

          <Form form={loginForm} name='basic' onFinish={onFinish} >
            <Form.Item
              name='username'
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите ваш логин!",
                },
              ]}
              key='username'>
              <Input
                autoFocus
                prefix={
                  <UserOutlined
                    className='site-form-item-icon'
                    id='usericon_login'
                  />
                }
                placeholder='Пожалуйста, введите ваш логин'
                disabled={isSubmitting}
                className='login_input'
              />
            </Form.Item>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите пароль!",
                },
              ]}
              key='password'>
              <Input.Password
                prefix={
                  <LockOutlined
                    className='site-form-item-icon'
                    id='lockicon_login'
                  />
                }
                placeholder='Пожалуйста, введите пароль'
                disabled={isSubmitting}
                className='login_input'
              />
            </Form.Item>
            <Form.Item key='sumbitbtn'>
              <Button
                type='primary'
                htmlType='submit'
                className='w-100'
                style={{
                  borderRadius: "11px",
                  padding: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  lineHeight: "22px",
                  fontWeight: "800",
                  boxShadow: "2px 2px 10px rgb(120,100,100)",
                  backgroundColor: '#4998af'
                }}
                disabled={isSubmitting}
                loading={isSubmitting}>
                Вход
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default LoginP;
