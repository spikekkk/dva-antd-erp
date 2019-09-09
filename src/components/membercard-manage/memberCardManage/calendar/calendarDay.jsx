/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
import React from 'react';
import styles from './calendarSet.less';
import moment from 'moment';

function HolidayDay ({
  year, //年份
  month, //月份
  day,
  tYear,
  tMonth,
  tDay,
  weekDay,
  holidays,

  selectDate,
}){
  function charge( DateType, Number ){
    if( DateType < Number ){
      return '0' + DateType;
    }else{
      return DateType;
    }
  }

  // 是否是已过去的时间
  const tm = charge(tMonth, 10);
  const td = charge(tDay, 10);
  const m = charge(month, 10);
  const d = charge(day, 10);
  const tDate = tYear + '-' + tm + '-' + td;
  const date = year + '-' + m + '-' + d;
  let isBeforeToday = false;
  if(day > 0) {
    isBeforeToday = moment(tDate).isAfter(date);
  }

  //是否今天判断
  const isToday = (tYear==year && tMonth==month && tDay==day);
  let dayStr ='';
  let isChecked = false;
  if(!!day){
    const Months  = charge(month,10);
	    const Day     = charge(day,10);
	    dayStr = year + '-' + Months + '-' + Day;
    //是否被选中
    isChecked = !!holidays && holidays.indexOf(dayStr)>=0;
  }
  return (
    <div className={!!day ?
      ((weekDay==6||weekDay==0)?styles.holidayMonthWeekend :styles.holidayMonthWeekday):
      styles.holidayMonthBlackday}
      // eslint-disable-next-line react/jsx-indent-props
    onClick={() =>{!isBeforeToday ? selectDate( dayStr ) : ''; }}
      // eslint-disable-next-line react/jsx-indent-props
    style={
      isBeforeToday ?
        {
          color:'#bcbcbc',
          background:'#f5f5f5',
        }
        :
        isChecked ?
          {backgroundColor: '#5D9CEC', color:'#ffffff',}
          :
          isToday ?
            {border:'1px solid #5D9CEC', color: '#5D9CEC', fontWeight:'bold',}
            : {}
    }
    >
      {day||''}</div>
  );
}
export default HolidayDay;
