import React, { useState } from "react";
import { Layout, Menu, Avatar, Drawer, Popover, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { routes } from "../data/routes";
import { Logout } from "../server/config/logout";
import { deleteCookie } from "../functions/useCookies";
import { TOKEN } from "../assets/constants";
const { Header, Sider, Content } = Layout;

const LayOut = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = () => {
    modal ? setVisible(!visible) : setCollapsed(!collapsed);
  };
  const UserLogout = () => {
    Logout().then(() => {
      localStorage.removeItem("activeId");
      deleteCookie(TOKEN);
      deleteCookie("doctorId");
      window.location.href = "/login";
    });
  };
  const content = (
    <Button type='primary' onClick={UserLogout}>
      Logout
    </Button>
  );
  // useEffect(() => {
  //   OrderGet().then((res) => {
  //     setorderlength(res.data.content.length);
  //   });
  // }, [orderlenght]);
  return (
    <Layout key='layout_jsx'>
      <Drawer
        title='Menular'
        placement='left'
        closable={true}
        onClose={toggle}
        visible={visible}
        getContainer={false}
        style={{ position: "absolute" }}>
        <Menus toggle={toggle} />
      </Drawer>
      <Sider
        className='d-md-block d-none vh-100 left-menu'
        trigger={null}
        collapsible
        collapsed={modal ? true : collapsed}
        breakpoint='md'
        collapsedWidth='60'
        onBreakpoint={(broken) => {
          setModal(broken);
        }}>
        <div className='logo'>{collapsed ? "" : `MedPay`}</div>
        <Menus color='dark' />
      </Sider>
      <Layout className='site-layout'>
        <Header className='site-layout-background' style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div className='right-notification-userInfo'>
            <Link to='/user'>
              <Popover content={content}>
                <Avatar
                  size={40}
                  src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                />
              </Popover>
            </Link>
          </div>
        </Header>
        <Content
          className='site-layout-background'
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayOut;

const Menus = (props) => {
  return (
    <Menu theme={props.color} mode='inline'>
      {routes.map((item, index) => (
        <Menu.Item key={"" + index} icon={item.icon} onClick={props.toggle}>
          <Link to={item.route}>{item.name}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
};
