/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { routerRedux, } from 'dva/router';
import { Layout, Menu, Icon, Popover, Dropdown, Badge, Tabs, Button } from 'antd';
import styles from './IndexLayoutComponent.less';
import NewTabs from '../common/new-tabs/NewTabs';

const { Header, Footer, Sider, Content, } = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;

function IndexLayoutComponent({
  children,

  currentShop, //当前园区
  passCount, //审核通过
  refuseCount, //审核拒绝
  goodsName, //是否是门票页面信息
  shopList, //通过登录人获取所管辖的游乐园
  activeShop,

  /*方法*/
  onSelect,
  onOpenChange,
  ChangePassWord,
  changeShop,
  logout,

  /*菜单*/
  subMuneKeys, //父级菜单key数组
  currentMenuKey, //当前子菜单key
  menuList, //菜单列表

  /*tab页*/
  tabList, //历史页面
  tabKey, //选中的tab
  tabChange, //切换tab
  tabEdit,
  closable, //标签页能否关闭

  NewTabsProps,

  toDefaultRoute,
  waitHandleCount,
}) {
  /*用户*/
  const user_drap_menu = (
    <Menu className={styles.user_drap_menu}>
      <Menu.Item key="update_password">
        <a
          className={styles.top_user_drap_menu_text}
          href="javascript:void(0)"
          onClick={ChangePassWord}
        >
          修改密码
        </a>
      </Menu.Item>
      <Menu.Item key="logout">
        <a
          className={styles.top_user_drap_menu_text}
          onClick={logout}
          target="_self"
        >
          注销
        </a>
      </Menu.Item>
    </Menu>
  );

  const msg = (
    <div>
      <div style={{ color: '#FE9E0F', }}>
        {passCount} 个 {goodsName}审核通过
      </div>
      <div style={{ color: '#05aadb', }}>
        {refuseCount} 个 {goodsName}未审核通过
      </div>
    </div>
  );

  return (
    <Layout className={styles.main_layout}>
      <Header className={styles.main_layout_header}>
        <div className={styles.main_layout_header_left}>
          <img
            className={styles.org_logo_img_cont}
            src="https://img.ishanshan.com/gimg/n/20190619/dd8b23388b2f48c75a652300eeb18c03"
          />
          <div className={styles.org_logo_name_cont}>
            <span>惠吧会员卡</span>
          </div>
        </div>

        <div className={styles.main_layout_header_right}>
          <Button onClick={toDefaultRoute} type="primary" className={styles.order_button}>{waitHandleCount}个取消预约订单待处理</Button>
          
          <Popover content={msg}>
            <div className={styles.main_layout_header_right_item}>
              <Badge
                count={Number(passCount) + Number(refuseCount)}
                offset={[2, -2,]}
                style={{
                  backgroundColor: '#CE304B',
                  minWidth: 14,
                  height: 14,
                  paddingLeft: 4,
                  paddingRight: 4,
                  lineHeight: '14px',
                }}
              >
                <Icon className={styles.btn_a_icon}
                  type="message"
                />
              </Badge>
            </div>
          </Popover>

          <Dropdown overlay={user_drap_menu}>
            <div className={styles.main_layout_header_right_item}>
              <Icon className={styles.btn_a_icon}
                type="user"
              />
              <div className={styles.user_text_trigger}>
                <Icon
                  className={styles.user_text_trigger_icon}
                  type="cas-right-bottom"
                />
              </div>
            </div>
          </Dropdown>
        </div>
        <div className={styles.header_show_split} />
      </Header>

      <Layout className={styles.main_layout_right_block}>
        <Sider className={styles.main_layout_left_menu}
          width={170}
        >
          <div className={styles.sider_title} />
          <Menu
            className={styles.sider_menu}
            mode="inline"
            onOpenChange={onOpenChange}
            onSelect={onSelect}
            openKeys={[subMuneKeys,]}
            selectedKeys={[currentMenuKey,]}
            style={{ overflow: 'auto', }}
            theme="dark"
          >
            {menuList &&
              menuList.map((menu, index) => {
                if (menu.pid == 0) {
                  return (
                    <SubMenu
                      key={menu.route}
                      title={
                        <span>
                          <Icon className={styles.menu_icon}
                            type={menu.icon}
                          />
                          <span>{menu.name}</span>
                        </span>
                      }
                    >
                      {menuList &&
                        menuList.map((item, key) => {
                          if (item.pid == menu.id) {
                            return (
                              <Menu.Item key={item.route}>
                                {item.name}
                              </Menu.Item>
                            );
                          }
                        })}
                    </SubMenu>
                  );
                }
              })}
          </Menu>
          <div className={styles.sider_footer}>
            <p>版本号：1.0.0</p>
            <p>更新时间：2019/06/14</p>
          </div>
        </Sider>

        <Content
          className={styles.main_layout_content}
          id="common_content_left"
        >
          <NewTabs {...NewTabsProps} />
          <div style={{ height: 'calc( 100% - 28px )', padding: 10, }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default IndexLayoutComponent;
