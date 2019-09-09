import React from 'react';
import { Button, } from 'antd';
import styles from './shopManageListComponent.less';
import { NullData, ProgressBar, } from '../common/new-component/NewComponent';

function ShopListComponent({
  dataSource, //列表信息
  loading,
  toShopDetail,
  showEditShop,
}) {
  const ShopStatus = function(status) {
    if (status === '1') {
      return <div>营业中</div>;
    }
    if (status === '2') {
      return <div>歇业中</div>;
    }
    if (status === '9') {
      return <div>停业整顿</div>;
    }
  };

  return (
    <div className={styles.shopListContainer}>
      {!loading && dataSource && dataSource.length > 0 ? (
        <div className={styles.shopList}>
          {dataSource.map(function(item, index) {
            return (
              <div className={styles.shopItem}
                key={'shop_' + index}
              >
                <div onClick={toShopDetail.bind(this, item.id)}>
                  <div
                    className={styles.shopLogo}
                    style={{ backgroundImage: `url(${item.logo})`, }}
                  />

                  <div className={styles.shopDetail}>
                    <h3 className={styles.shopTitle}>{item.name}</h3>
                    <div className={styles.contentLineOne}>
                      <div className={styles.city}>城市:{item.city}</div>
                      <div className={styles.goodsCount}>
                        商品:{item.goodsCount || 0}个
                      </div>
                    </div>
                    <div className={styles.address}>{item.address}</div>
                    <div className={styles.createTime}>
                      新建时间：{item.createTime}
                    </div>
                    <div className={styles.status}>
                      {ShopStatus(item.status)}
                    </div>
                  </div>
                </div>
                <Button
                  className={styles.copyBtn}
                  onClick={showEditShop.bind(this, 3, item.id)}
                  type="primary"
                >
                  复制门店
                </Button>
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

export default ShopListComponent;
