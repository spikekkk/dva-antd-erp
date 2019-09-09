import React from 'react';

import styles from './calendarSet.less';
import HolidayDay from './calendarDay';

function HolidayMonth ({
  holidays,
  month, //[] 节假日
  year, //年份
  today, //当日

  selectDate,
}){

  const date = new Date(year, month, 0); // 一年中的每个月最后一天是几号
  const days = date.getDate(); // 一年中的每个月有多少天

  const firstDate = new Date(year, month-1, 1); // 某月的第一天
  const weekDay = new Date(firstDate).getDay(); // 某月的第一天星期几

  //生成日期数组
  const monthDay = [];
  for(let index = 0; index < weekDay; index++){
    monthDay.push('');
  }
  for(let index = 0; index < days; index++){
    monthDay.push(index + 1);
  }
  const rows = [];
  let cols = [];
  for(let i=0; i<monthDay.length; i++ ){
    if(i>0 && (i % 7 == 0)){
      rows.push(cols);
      cols = [];
    }
    cols.push(monthDay[i]);
  }
  rows.push(cols);
  const todayDate = new Date(today);
  const tYear = todayDate.getFullYear();
  const tMonth = todayDate.getMonth()+1;
  const tDay = todayDate.getDate();
  return (
    <div className={styles.holidayMonthDiv}>
      <div className={styles.holidayMonthHead}>{month}月</div>
      <div className={styles.holidayMonthTitle}>
        <div className={styles.holidayMonthTitleItem}>日</div>
        <div className={styles.holidayMonthTitleItem}>一</div>
        <div className={styles.holidayMonthTitleItem}>二</div>
        <div className={styles.holidayMonthTitleItem}>三</div>
        <div className={styles.holidayMonthTitleItem}>四</div>
        <div className={styles.holidayMonthTitleItem}>五</div>
        <div className={styles.holidayMonthTitleItem}>六</div>
      </div>
      {rows.map((row, index) =>{
        		return <div className={styles.holidayMonthRow}
          key={index}
        		       >
          <HolidayDay day={row[0]||''}
            holidays={holidays}
            key={index+'_0'}
            month={month}
            selectDate={selectDate}
            tDay={tDay}
            tMonth={tMonth}
            tYear={tYear}
            weekDay={0}
            year={year}
          />
          <HolidayDay day={row[1]||''}
            holidays={holidays}
            key={index+'_1'}
            month={month}
            selectDate={selectDate}
            tDay={tDay}
            tMonth={tMonth}
            tYear={tYear}
            weekDay={1}
            year={year}
          />
          <HolidayDay day={row[2]||''}
            holidays={holidays}
            key={index+'_2'}
            month={month}
            selectDate={selectDate}
            tDay={tDay}
            tMonth={tMonth}
            tYear={tYear}
            weekDay={2}
            year={year}
          />
          <HolidayDay day={row[3]||''}
            holidays={holidays}
            key={index+'_3'}
            month={month}
            selectDate={selectDate}
            tDay={tDay}
            tMonth={tMonth}
            tYear={tYear}
            weekDay={3}
            year={year}
          />
          <HolidayDay day={row[4]||''}
            holidays={holidays}
            key={index+'_4'}
            month={month}
            selectDate={selectDate}
            tDay={tDay}
            tMonth={tMonth}
            tYear={tYear}
            weekDay={4}
            year={year}
          />
          <HolidayDay day={row[5]||''}
            holidays={holidays}
            key={index+'_5'}
            month={month}
            selectDate={selectDate}
            tDay={tDay}
            tMonth={tMonth}
            tYear={tYear}
            weekDay={5}
            year={year}
          />
          <HolidayDay day={row[6]||''}
            holidays={holidays}
            key={index+'_6'}
            month={month}
            selectDate={selectDate}
            tDay={tDay}
            tMonth={tMonth}
            tYear={tYear}
            weekDay={6}
            year={year}
          />
        				</div>;

        	})}
    </div>

  );
}
export default HolidayMonth;
