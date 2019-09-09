/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import styles from './calendarSet.less';
import HolidayMonth from './calendarMonth';
function HolidayYear ({
  holidays, //[] 节假日
  year, //年份
  today, //当天

  selectDate,
}){


  const months = [1,2,3,4,5,6,7,8,9,10,11,12,];

  return (
    <div className={styles.holidayBox}>
      {months.map((m, index)=>{
        return <HolidayMonth holidays={holidays}
          key={index}
          month={m}
          selectDate={selectDate}
          today={today}
          year={year}
        />;
        	})
        	}
    </div>
  );
}
export default HolidayYear;
