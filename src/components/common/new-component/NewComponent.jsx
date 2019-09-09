/* eslint-disable react/no-multi-comp */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/*
    NewModal,       //左边划入框
    StatusFlag,     //状态标志项
    NewButton,      //新按钮
    AlertModal,     //提示modal框
    NullData,       //无数据页面
    ProgressBar,    //进度条modal
    CommonModal,    //通用modal
    GradientBlock,  //渐变div块
*/

import React from 'react';
import { Button, Icon, Select, Modal, Popover, } from 'antd';
import Media from 'react-media';
import styles from './NewComponent.less';
const Option = Select.Option;

/*左边划入框*/
export function NewModal({
  children, //modal_content内容
  headVisible, //modal的header是否显示
  title, //modal的标题
  visible, //modal是否显示
  closable, //modal右上角是否显示关闭X
  onOk, //modal点击确认
  onCancel, //modal点击取消
  width, //modal宽度(默认600)
  footer, //modal_foot内容(若没有footer属性，则自定生成默认footer;若不显示footer，则footer = '')
  top, //距离浏览器上方距离(默认0)
  bottom, //距离浏览器下方距离(默认0)
  height, //高度(默认100%)
}) {
  const formatTop = top;
  const formatBottom = bottom || 0;
  const formatHeight = height || 'calc(100% - 68px)';

  return (
    <div className="common_detail">
      <div
        className={
          visible
            ? styles.all_page_right_enter_modal_open
            : styles.all_page_right_enter_modal_close
        }
        style={{
          width: width || 650,
          top: formatTop,
          bottom: formatBottom,
          height: formatHeight,
        }}
      >
        {headVisible == false ? null : (
          <div className={styles.page_right_enter_modal_header}>
            <div className={styles.page_right_enter_modal_header_title}>
              {title || '标题'}
            </div>
            {closable ? (
              <div className={styles.page_right_enter_modal_header_close}>
                <Icon
                  className={styles.page_right_enter_modal_header_close_x}
                  onClick={onCancel}
                  type="close"
                />
              </div>
            ) : null}
          </div>
        )}
        <div
          className={styles.page_right_enter_modal_content}
          style={
            headVisible == false && footer == ''
              ? { height: '100%', }
              : headVisible && footer != ''
                ? { height: 'calc(100% - 100px)', }
                : { height: 'calc(100% - 50px)', }
          }
        >
          {children}
        </div>
        {footer == undefined ? (
          <div className={styles.page_right_enter_modal_footer}>
            <div className={styles.page_right_enter_modal_footer_content}>
              <Button key="cancel"
                onClick={onCancel}
                type="ghost"
              >
                关闭
              </Button>
              ,
              <Button
                key="submit"
                onClick={onOk}
                style={{ marginLeft: 10, }}
                type="primary"
              >
                确认
              </Button>
            </div>
          </div>
        ) : footer == '' ? null : (
          <div className={styles.page_right_enter_modal_footer}>
            <div className={styles.page_right_enter_modal_footer_content}>
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * 状态标志项
 * @author 赵健
 * content string 文字内容优先级高
 * children string 文字内容优先级低
 * type string 类型('red','deep_red','gray','yellow','green','light_blue',和默认不填)
 * onClick function 点击事件
 * style object 自定义样式
 */
export function StatusFlag({
  className,
  children,
  content,
  type,
  onClick,
  style,
}) {
  return (
    <div className={styles.status_flag}
      onClick={onClick}
      style={style}
    >
      <div
        className={styles.status_flag_point}
        style={{
          backgroundColor:
            type == 'red'
              ? '#ff7f75'
              : type == 'deep_red'
                ? '#cc4342'
                : type == 'gray'
                  ? '#a9b4bc'
                  : type == 'yellow'
                    ? '#fcc047'
                    : type == 'green'
                      ? '#88c70a'
                      : type == 'light_blue'
                        ? '#7eb4f8'
                        : '#5d9cec',
        }}
      />
      <div>{content || children || undefined}</div>
    </div>
  );
}

/* 带蓝色小块的标题
 * author 赵健
 * content string/ReactDOM 标题内容(默认'标题内容')，优先级高
 * children string/ReactDOM 标题内容(默认'标题内容')，优先级低
 * popoverContent string/ReactDom 是否出现帮助悬浮
 * popoverTrigger string 帮助是鼠标悬浮显示还是点击显示(默认是'hover')
 * popoverPlacement string 帮助框悬浮位置(默认'right)
 * iconType string logo种类(默认是'question-circle-o')
 * className object/string 自定义类名
 * style object 样式
 */
export function BlockTitle({
  content,
  children,
  popoverContent,
  popoverTrigger,
  popoverPlacement,
  iconType,
  className,
  style,
}) {
  const formatClassName = !!className ? ' ' + className : '';
  return (
    <div className={'common_block_title' + formatClassName}
      style={style}
    >
      <div className={styles.title_block} />
      <div className={styles.title_content}>{content || children}</div>
      {!!popoverContent ? (
        <Popover
          content={popoverContent}
          placement={popoverPlacement || 'right'}
          trigger={popoverTrigger || 'hover'}
        >
          <Icon type={iconType || 'question-circle-o'} />
        </Popover>
      ) : null}
    </div>
  );
}

/*新按钮*/
export function NewButton({
  children, //标签之间添加的内容
  type, //primary,ghost
  style, //自定义样式
  onClick, //点击事件
}) {
  return (
    <div
      className={
        type == 'ghost' ? styles.new_button_ghost : styles.new_button_primary
      }
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}

/*提示modal框*/
export function AlertModal({
  content, //内容
  title, //标题
  maskClosable, //是否点击蒙层关闭
  visible, //是否显示
  closable, //是否显示关闭X
  width, //modal宽度
  onOk, //确认
  onCancel, //取消
  buttonLoading, //按钮加载状态
  footerEnsure, //确认按钮的名字
  footerCancel, //取消按钮的名字
  btnVisible, //显示取消按钮控制
}) {
  return (
    <Modal
      className="common_alert_Modal"
      closable={closable || true}
      footer={[
        btnVisible ? (
          ''
        ) : (
          <Button
            disabled={buttonLoading || false}
            key="onCancel"
            loading={buttonLoading || false}
            onClick={onCancel}
            size="default"
            style={{ minWidth: 80, }}
            type="ghost"
          >
            {footerCancel || '取消'}
          </Button>
        ),
        <Button
          disabled={buttonLoading || false}
          key="onOk"
          loading={buttonLoading || false}
          onClick={onOk}
          size="default"
          style={{ minWidth: 80, marginLeft: 20, }}
          type="primary"
        >
          {footerEnsure || '确定'}
        </Button>,
      ]}
      maskClosable={maskClosable || false}
      onCancel={onCancel}
      onOk={onOk}
      title={title || 'title'}
      visible={visible || false}
      width={width || 400}
    >
      {content}
    </Modal>
  );
}

/*无数据页面*/
export function NullData({
  height, //默认100
  content, //显示文案
  children,
}) {
  return (
    <div className={styles.null_data}
      style={{ height: height || 100, }}
    >
      <img src="https://img.ishanshan.com/gimg/n/20190619/bfd41391d65c666c19afa11b3eb1b42d" />
      <div>{content || children}</div>
    </div>
  );
}

/*
 * 进度条弹窗
 * author 赵健
 * className object/string 自定义类名
 * visible boolean modal是否显示
 * type string 种类('move'/默认'fixed')
 * content string 进度条内文案(默认'Loading')，优先级高
 * children string 进度条内文案(默认'Loading')，优先级低
 * duration string 动画时间(默认4s)
 * timingFunction string 滑动速度曲线
 */
export function ProgressBarModal({
  className,
  visible,
  type,
  content,
  children,
  duration,
  timingFunction,
}) {
  const formatClassName = !!className ? ' ' + className : '';
  return (
    <Modal
      className={'zj_common_progress_bar_modal' + formatClassName}
      closable={false}
      footer={null}
      maskClosable={false}
      title={null}
      visible={visible || false}
      width={550}
    >
      <div
        className={
          type == 'move' ? styles.progress_move : styles.progress_fixed
        }
        data-content={content || children || '加载中'}
        style={{
          animationDuration: duration || '4s',
          animationTimingFunction: timingFunction || 'linear',
        }}
      />
    </Modal>
  );
}

/*
 * 纯进度条
 * author 赵健
 * type string 种类('move'/默认'fixed')
 * height string/number => ('200px',200) 高度 默认200
 * content string 进度条内文案(默认'Loading')，优先级高
 * children string 进度条内文案(默认'Loading')，优先级低
 * duration string 动画时间(默认5s)
 * timingFunction string 滑动速度曲线
 */
export function ProgressBar({
  type,
  height,
  content,
  children,
  duration,
  timingFunction,
}) {
  return (
    <div className="zj_common_progress_bar"
      style={{ height: height || 200, }}
    >
      <div
        className={
          type == 'move' ? styles.progress_move : styles.progress_fixed
        }
        data-content={content || children || '加载中'}
        style={{
          animationDuration: duration || '4s',
          animationTimingFunction: timingFunction || 'linear',
        }}
      />
    </div>
  );
}

/*
 *author zhaojian
 *children 表单内容(默认[])
 *title 表单标题(默认'表单标题')
 *maskClosable 点击蒙层是否关闭(默认false)
 *visible boolean modal是否显示
 *onOk function 点击确认事件
 *onCancel function 点击取消事件
 *onButtonLoading 确认按钮加载状态
 *footerEnsure 确认按钮内的文字
 *footerCancel 取消按钮内的文字
 */
export function CommonModal({
  children, //内容
  title, //标题
  maskClosable, //是否点击蒙层关闭
  visible, //是否显示
  closable, //是否显示关闭X
  width, //modal宽度
  onOk, //确认
  onCancel, //取消
  onButtonLoading, //按钮加载状态
  footerEnsure, //确认按钮的名字
  footerCancel, //取消按钮的名字
}) {
  return (
    <Modal
      className="zj_global_common_modal"
      closable={closable || true}
      footer={[
        <Button
          key="onCancel"
          onClick={onCancel}
          size="default"
          style={{ minWidth: 80, }}
          type="ghost"
        >
          {footerCancel || '取消'}
        </Button>,
        <Button
          disabled={onButtonLoading || false}
          key="onOk"
          loading={onButtonLoading || false}
          onClick={onOk}
          size="default"
          style={{ minWidth: 80, marginLeft: 20, }}
          type="primary"
        >
          {footerEnsure || '确定'}
        </Button>,
      ]}
      maskClosable={maskClosable || false}
      onCancel={onCancel}
      onOk={onOk}
      title={title || '表单标题'}
      visible={visible || false}
      width={width || 500}
    >
      {children || []}
    </Modal>
  );
}

/*单颜色渐变色块
 *author zhaojian
 *children 表单内容(默认[])
 *className 自定义类名
 *style 自定义样式
 *colorArr 颜色数组rgb['255','255','255']
 */
export function GradientBlock({ children, className, style, colorArr, angle, }) {
  const formatClassName = !!className ? ' ' + className : '';
  const formatColorArr =
    !!colorArr && colorArr.length > 0
      ? colorArr.slice(0, 3)
      : ['93', '156', '236',];
  const colorOne = `rgba(${formatColorArr[0]},${formatColorArr[1]},${
    formatColorArr[2]
  },.5)`;
  const colorTwo = `rgba(${formatColorArr[0]},${formatColorArr[1]},${
    formatColorArr[2]
  },1)`;
  const render = `${window.currentKernel ||
    '-webkit-'}linear-gradient(${angle || '-90deg'},${colorOne},${colorTwo})`;
  return (
    <div
      className={'common_gradient_block' + formatClassName}
      style={{ background: render, ...style, }}
    >
      {children}
    </div>
  );
}
