import React from 'react';
import { Button, Icon , Select ,Radio ,Menu, Dropdown, message } from 'antd';
import style from './modelDetailTop.less';
const ButtonGroup = Button.Group;

export function MOdelDetailTop({
    title,
    onCancel,
    handleMenuClick,
}){

    const menu = (
                  <Menu onClick={handleMenuClick}>
                     <Menu.Item key="1">删除</Menu.Item>
                  </Menu>
                );


    function visibleChange( visible ){
		console.log( visible );

	}


    return(
        <div className={style.model_detail_bigDiv}>
            <div className={style.model_detail_img}></div>
            <div className={style.model_detail_top}>
                <div className={style.model_detail_topTitle}>
                    <div className={style.model_detail_title}>
                        {title}
                    </div>
                    <div className={style.model_detail_close}>
                        <Icon type="close" onClick={onCancel} className={style.model_detail_close_icon}/>
                    </div>
                    <div className={style.model_detail_btn}>
                          <ButtonGroup>
                              <Button type="primary" className={style.model_detail_btn1}>编辑</Button>
                              <Dropdown
                                    overlay = { menu }
                                    trigger = {[ 'click' ]}
                                    onVisibleChange = { visibleChange }
                              >
                                   <Button className={style.model_detail_btn2}>.&nbsp;.&nbsp;.</Button>
                              </Dropdown>

                          </ButtonGroup>
                    </div>

                </div>
            </div>
        </div>
    )
}
