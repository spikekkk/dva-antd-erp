import React from 'react';
import { connect, } from 'dva';
import LoginComponent from '../../components/login/LoginComponent';
import styles from './LoginPage.less';

function LoginPage({ dispatch, indexLayout, }) {
  const {
    initData, //window._init_data
    loginAccount,
    loginPassword,
    loading,
  } = indexLayout;

  function dp(name, param) {
    dispatch({
      type: `indexLayout/${name}`,
      payload: {
        ...param,
      },
    });
  }

  const props = {
    dp,
    initData, //window._init_data
    loginAccount,
    loginPassword,
    loading,
  };

  return (
    <div
      className={styles.login_base_box}
      style={{
        background:
          'url(https://img.ishanshan.com/gimg/n/20190615/57840c37b496696cec0dcf8b420dc47c) 0% 0% / cover no-repeat',
      }}
    >
      <LoginComponent {...props} />
      {/* <div className={styles.bg_right}>
        <img
          alt="bg1"
          src="https://img.tamizoo.cn/img/8214239f4ad899d2ee737d79718433ef"
          style={{ width: '50%', maxWidth: 430, }}
        />
        <img
          alt="bg2"
          src="https://img.tamizoo.cn/img/43bdab462447ecfadca1559b621b0dc9"
          style={{ width: '100%', marginTop: '10%', maxWidth: 800, }}
        />
      </div> */}
      {/*!!initData ?
                <div className={styles.foot_content}>
                    <div className={styles.foot_text}>技术支持：杭州闪宝科技有限公司</div>
                    <div className={styles.foot_text}>服务热线： 0571-56000069      联系地址： 杭州市滨江区海威大厦18F</div>
                </div> :
                <div className={styles.foot_content}>
                    <div className={styles.foot_text}>杭州闪宝科技有限公司  浙ICP备1501166号-1</div>
                    <div className={styles.foot_text}>联系方式： 0571-56000069      联系地址： 杭州市滨江区海威大厦18F</div>
                </div>*/}
    </div>
  );
}

function mapStateToProps({ indexLayout, }) {
  return { indexLayout, };
}

export default connect(mapStateToProps)(LoginPage);
