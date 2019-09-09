import React from 'react';
import {Spin} from 'antd';

import styles from './WaitPage.less';

function WaitPage () {

    return (
        <div className={styles.wait_page_cont}>
            <Spin size="large"  className={styles.wait_span} />
            <p>正在火速加载中...</p>
        </div>
    );
}

export default WaitPage;
