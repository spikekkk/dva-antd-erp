import React from 'react';
import { Input, message, Icon, Form, Button, } from 'antd';
import styles from './LoginComponent.less';

function LoginComponent({ dp, loginAccount, loginPassword, loading, }) {
  //账号
  function updateLoginAccount(e) {
    dp('updateState', { loginAccount: e.target.value, });
  }

  //密码
  function updateLoginPassword(e) {
    dp('updateState', { loginPassword: e.target.value, });
  }

  //提交
  function onLoginSubmit() {
    if (
      loginAccount != null &&
      loginAccount != undefined &&
      loginAccount != ''
    ) {
      if (
        loginPassword != null &&
        loginPassword != undefined &&
        loginPassword != ''
      ) {
        dp('login', { acct: loginAccount, pwd: loginPassword, });
      } else {
        return message.error('请输入密码');
      }
    } else {
      return message.error('请输入账号');
    }
  }

  return (
    <div className="saas_login">
      <Form action=""
        method="post"
        name="login_form"
      >
        <div className={styles.saas_login_box}>
          <img
            className={styles.common_logo}
            src="https://img.ishanshan.com/gimg/n/20190615/c97cf74330b68a374c96fbf55a91fe88"
          />
          <div className={styles.saas_login_input_user}>
            <Input
              addonBefore={
                <Icon
                  style={{ color: '#27AEDF', marginLeft: '2px', }}
                  type="user"
                />
              }
              className={styles.saas_login_input}
              onChange={updateLoginAccount}
              placeholder="请输入账号"
              value={loginAccount}
            />
          </div>
          <div className={styles.saas_login_input_pasword}>
            <Input
              addonBefore={
                <Icon
                  style={{ color: '#27AEDF', marginLeft: '2px', }}
                  type="unlock"
                />
              }
              className={styles.saas_login_input}
              onChange={updateLoginPassword}
              onPressEnter={onLoginSubmit}
              placeholder="请输入密码"
              type="password"
              value={loginPassword}
            />
          </div>
          <Button
            className={styles.saas_login}
            loading={loading}
            onClick={() => onLoginSubmit()}
            type="primary"
          >
            登录
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default LoginComponent;
