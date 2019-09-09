/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import { Button, } from 'antd';
import styles from './memberCardManageComponent.less';
import { NullData, ProgressBar, } from '../../common/new-component/NewComponent';
function MemberCardComponent({
  dataSource, //列表信息
  loading,
  updateStatusOpen, //状态改变弹窗
  addAndEditMemberCard, //编辑
  stockSettingFunc, // 查看
  shelvesFunc, // 上架
  downloadTemplate, //下载模板
}) {
  return (
    <div className={styles.memberCard}>
      {!loading && dataSource && dataSource.length > 0 ? (
        <div className={styles.memberCardList}>
          {dataSource.map(function(item, index) {
            return (
              <div className={styles.memberCardItem}
                key={'card_' + index}
              >
                <div className={styles.memberCardInner}>
                  <div className={styles.vip_card}>
                    <img src={item.cover} />
                  </div>
                  <div className={styles.vip_card_info}>
                    <div className={styles.vip_info_item}>
                      <span>{item.cardName || '-'}</span>
                      <div className={styles.cardType}>{item.cardName}</div>
                      <span>卡号：{item.spuId || '0'}</span>
                    </div>
                    <div className={styles.vip_info_item}>
                      <span className={styles.createTime}>
                        新建时间：{item.createTime || '-'}
                      </span>
                      <span>会员卡有效期：{item.validPeriod || '0'}天</span>
                    </div>
                    <div className={styles.vip_info_item}>
                      卡内权益商品：{item.goodsNum || '0'}个
                    </div>
                    <div className={styles.vip_info_item}>
                      <span className={styles.createTime}>
                        被分享次数：{item.shareTimes || '0'}次
                      </span>
                      <span>
                        状态：
                        {item.status == '0'
                          ? '下架'
                          : item.status == '1'
                            ? '上架'
                            : ''}
                      </span>
                    </div>
                    <div className={styles.vip_info_item}>
                      <span className={styles.createTime}>
                        原价：{item.price || '0'}元
                      </span>
                      <span>结算价：{item.settlePrice || '0'}元</span>
                    </div>
                    <div className={styles.vip_info_item}>
                      <span>最近上传</span>
                      <span style={{ cursor: 'pointer', }}>
                        「会员卡预约配置」
                      </span>
                      <span>模块：</span>
                      <div
                        className={styles.cardType}
                        onClick={stockSettingFunc.bind(this, item)}
                        style={{ cursor: 'pointer', }}
                      >
                        查看
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={downloadTemplate}
                    style={{ marginRight: '20px', }}
                    type="primary"
                  >
                    下载模板
                  </Button>
                  <div className={styles.btns}>
                    <Button
                      onClick={addAndEditMemberCard.bind(this, '2', item)}
                      style={{ marginRight: '20px', }}
                      type="primary"
                    >
                      编辑内容
                    </Button>
                    {item.status == '1' ? (
                      <Button onClick={updateStatusOpen.bind(this, item)}>
                        下架
                      </Button>
                    ) : (
                      <Button onClick={shelvesFunc.bind(this, item)}>
                        上架
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !loading && dataSource && dataSource.length <= 0 ? (
        <NullData content={'暂时没有数据'}
          height={400}
        />
      ) : (
        <ProgressBar content={'加载中'}
          height={400}
        />
      )}
    </div>
  );
}

export default MemberCardComponent;
