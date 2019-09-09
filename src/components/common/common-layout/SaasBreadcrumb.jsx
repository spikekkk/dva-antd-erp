import React from 'react';
import { routerRedux } from 'dva/router';
import styles from './SaasBreadcrumb.less';

import { Breadcrumb  } from 'antd';

function SaasBreadcrumb ({dispatch, location, routes, }) {

    /*普通路由跳转*/
    function toDefaultRoute(path) {
        dispatch(routerRedux.push({
            pathname: path,
        }));
    }

    /*顶部导航跳转*/
    function toHeaderRoute(path) {
        dispatch({
            type: 'headerMenuModel/changeCurrentMenu',
            payload : {
                menuKey: path,
            }
        });
    }

    function toRouter(path) {
        if(path && path.length > 0) {
            if(path.substring(0,1) == '/') {
                toDefaultRoute(path);
            } else {
                toHeaderRoute(path);
            }
        }
    }

    let breadCrumbCont = [];
    routes && routes.length > 0 && routes.map(function(item, index) {

        let {path,breadcrumbName} = item;
        if(breadcrumbName && breadcrumbName.length > 0) {
            breadCrumbCont.push(
                <li key={'saas_bread_crumb_' + index}>
                    <a href="javascript:void(0)"
                        className={(path&&path.length > 0) ? styles.bread_href : styles.bread_default}
                        onClick={()=>toRouter(path)}
                    >
                        {breadcrumbName}
                    </a>
					{ ( routes.length - 1 ) != index && <span>&gt;</span> }
                </li>
            );
        }
    });

    return (
        <div className={styles.saas_bread_crumb_cont}>
            <ul className="saas_bread_crumb">
              {breadCrumbCont}
            </ul>
        </div>
    );
}

export default SaasBreadcrumb;
