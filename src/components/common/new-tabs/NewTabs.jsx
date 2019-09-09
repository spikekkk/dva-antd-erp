import React from 'react';
import { Icon, Popover, } from 'antd';
import styles from './NewTabs.less';

function NewTabs({
  changeRoute,
  closeTab,

  tabList, //历史页面
  tabKey, //当前页面key
}) {
  const content = (
    <ul className={styles.tab_list}>
      {tabList &&
        tabList.map((item, index) => {
          return (
            <li
              className={styles.tab_item}
              key={'tab_item_' + index}
              onClick={changeRoute.bind(null, item.key, item.parentKey)}
            >
              {tabList.length > 1 ? (
                <Icon
                  onClick={closeTab.bind(null, item.key)}
                  style={{
                    margin: '0 10px 0 0',
                    fontSize: 6,
                    cursor: 'pointer',
                  }}
                  type="close"
                />
              ) : null}
              <a style={{ marginRight: 10, }}>{item.title}</a>
            </li>
          );
        })}
    </ul>
  );

  return (
    <div
      style={{ position: 'relative', background: '#EBECF0', paddingRight: 20, }}
    >
      <Popover
        content={content}
        overlayClassName="tab_list_pop"
        placement="bottomRight"
        trigger="click"
      >
        <Icon className={styles.more_tab}
          type="caret-down"
        />
      </Popover>

      <div className={styles.new_tab_bar}>
        {tabList &&
          tabList.map((item, index) => {
            return (
              <span
                className={
                  styles.new_tab_item +
                  ' ' +
                  (item.key == tabKey ? styles.new_tab_item_active : '')
                }
                id={'tab' + index}
                key={'tab' + index}
                onClick={changeRoute.bind(null, item.key, item.parentKey)}
              >
                {item.title}

                {tabList.length > 1 ? (
                  <Icon
                    onClick={closeTab.bind(null, item.key)}
                    style={{ margin: '0 10px', fontSize: 6, }}
                    type="close"
                  />
                ) : null}
              </span>
            );
          })}
      </div>
    </div>
  );
}

export default NewTabs;
