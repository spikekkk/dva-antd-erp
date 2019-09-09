import React from 'react';
import styles from './calendarSet.less';
import HolidayYear from './calendarYear';

function HolidaySet ({
  holidays, //[] 节假日
  year, //年份
  today, //当日

  selectDate, //选中日期
  beforeYear, //上一年
  nextYear, //下一年
}){
  return (
    <div>
      <div className={styles.holidayYearDiv}>
        <div className={styles.holidayYearDiv_title}>
          <a onClick={()=> beforeYear()}
            style={{marginLeft: 20,}}
          >上一年</a>
          <font style={{marginLeft : 50, marginRight : 50,}}>{year}</font>
          <a onClick={()=> nextYear()}>下一年</a>
        </div>
        <HolidayYear holidays={holidays}
          selectDate={selectDate}
          today={today}
          year={year || '2019'}
        />
      </div>
    </div>
  );
}
export default HolidaySet;
