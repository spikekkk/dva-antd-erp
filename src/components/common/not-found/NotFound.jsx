import React from 'react';
import styles from './NotFound.less';

function NotFound ({location, children, route}) {

    return (
        <div className={styles.not_found_cont} >
           未找到相应组件
        </div>
    );
}

export default NotFound;