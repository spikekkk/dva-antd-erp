import React from 'react';
import styles from './CommonLayoutComponent.less';
import LeftMenu from '../../../pages/common/left-menu/LeftMenu';
import SiderMenuPage from '../../../pages/common/sider-menu/SiderMenuPage';
import SaasBreadcrumb from './SaasBreadcrumb';

import { Layout } from 'antd';
const { Header, Sider, Content } = Layout;

function CommonLayoutComponent ({dispatch, children, collapsed, width, collapsedWidth, location, routes, }) {

    let {pathname} = location;

    let isOverview = /^.*homepage$/.test(pathname);

    let top_header_height = '50px';

    return (

        <Layout style={{height: 'calc(100vh - ' + top_header_height + ')'}}>
            <Sider
              trigger={null}
              collapsible
              width={width}
              collapsedWidth={collapsedWidth}
              collapsed={collapsed}
            >
              <div className={styles.left_menu_cont}
                style={{
                    height: 'calc(100vh - ' + top_header_height + ')'
                }}
              >
                  <SiderMenuPage />
              </div>

           </Sider>

           <Layout>
               <Content id = 'common_content_left' style={{height: 'calc(100vh - ' + top_header_height + ')', padding: '0 10px', position: 'relative', backgroundColor: '#fff'}}>
                   {!!false && <div className={styles.content_split}></div>}
                   {!!(!isOverview) && <div className={styles.layout_bread_crumb}>
                      <SaasBreadcrumb dispatch={dispatch} location={location} routes={routes}/>
                  </div>}
                   <div className={styles.page_layout_content} style={isOverview ? {height: '100%', paddingTop: '10px'} : {height: '100%', paddingTop: '0'}}>
                       <div className={styles.page_content}>
                           {children}
                       </div>
                   </div>
               </Content>
            </Layout>

        </Layout>
    );
}

export default CommonLayoutComponent;
