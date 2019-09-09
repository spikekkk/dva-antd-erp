import React from 'react';
import { connect, } from 'dva';
import { Pagination, } from 'antd';
import ShopListComponent from '../../components/shop-manage/shopManageListComponent';

import SearchComponents from '../../components/common/new-component/manager-list/ManagerListSearch';
import ShopDetailComponent from '../../components/shop-manage/shopDetailComponent';
import EditeShopDetailComponent from '../../components/shop-manage/editeShopDetailComponent';

function shopManagePage({ dispatch, shopDetailModel, }) {
  const {
    isCopy,
    /*分页项*/
    resultCount,
    pageIndex,
    pageSize,
    dataSource, //列表信息
    loading,
    shopItemDetailShow,
    detailLoading,
    shopDetailMess,
    editeShopDetailShow,
    createLoading,
    confirmCreateAction,
    shareVisible, // 分享图片显示
    shareImage, // 分享图片预览
    previewVisible, //门店图片预览显示
    previewImage, //门店图片预览图片,
    lng,
    lat,
    shopAddress,
    addShopLoading, //新增loading
  } = shopDetailModel;

  function showEditShop(type, val) {
    if (type == 1) {
      console.log('创建门店');
      dispatch({
        type: 'shopDetailModel/updateState',
        payload: {
          shopDetailMess: {},
          lng: 0,
          lat: 0,
          shopAddress: '',
          shopItemDetailShow: false,
          editeShopDetailShow: true,
        },
      });
    } else if (type == 2) {
      console.log('编辑门店');
      dispatch({
        type: 'shopDetailModel/updateState',
        payload: {
          shopItemDetailShow: false,
          editeShopDetailShow: true,
        },
      });
    } else if (type == 3) {
      console.log('复制门店');
      dispatch({
        type: 'shopDetailModel/queryShopDetail',
        payload: {
          id: val,
        },
      });
      dispatch({
        type: 'shopDetailModel/updateState',
        payload: {
          isCopy: true,
          shopItemDetailShow: false,
          editeShopDetailShow: true,
        },
      });
    }
  }
  /*跳转门店详情 */
  function toShopDetail(id) {
    dispatch({
      type: 'shopDetailModel/queryShopDetail',
      payload: {
        id: id,
      },
    });
  }
  /*关闭查看新增编辑弹窗 */
  function closeDialog() {
    dispatch({
      type: 'shopDetailModel/updateState',
      payload: {
        shopItemDetailShow: false,
        editeShopDetailShow: false,
      },
    });
  }
  /*编辑门店*/
  function saveValues(values) {
    if (values.shopId && !isCopy) {
      dispatch({
        type: 'shopDetailModel/updateShopDetail',
        payload: {
          ...values,
        },
      });
    } else {
      dispatch({
        type: 'shopDetailModel/addShopDetail',
        payload: {
          ...values,
        },
      });
    }
  }

  /*搜索*/
  function searchFunction(values) {
    const searchValue = {
      ...values,
      startTime: !!values.createTime
        ? values.createTime[0].format('YYYY-MM-DD 00:00:00')
        : undefined,
      endTime: !!values.createTime
        ? values.createTime[1].format('YYYY-MM-DD 23:59:59')
        : undefined,
    };
    delete searchValue.createTime;
    for (const i in searchValue) {
      if (!searchValue[i]) {
        delete searchValue[i];
      }
    }

    searchValue.address &&
      searchValue.address.forEach((item, index) => {
        if (index === 0 && item) searchValue.province = item;
        if (index === 1 && item) searchValue.city = item;
        if (index === 2 && item) searchValue.district = item;
      });
    delete searchValue.address;
    dispatch({
      type: 'shopDetailModel/queryShoplist',
      payload: {
        searchContent: searchValue,
        pageIndex: 0,
        pageSize,
      },
    });
  }
  /*改变分页*/
  function pageOnChange(pageIndex, pageSize) {
    dispatch({
      type: 'shopDetailModel/pageChange',
      payload: {
        pageIndex,
        pageSize,
      },
    });
  }
  /*分享图片预览显示*/
  function sharePreview(file) {
    dispatch({
      type: 'shopDetailModel/updateState',
      payload: {
        shareVisible: true,
        shareImage: file.url || file.thumbUrl,
      },
    });
  }
  /*分享图片取消预览*/
  function shareCancel() {
    dispatch({
      type: 'shopDetailModel/updateState',
      payload: {
        shareVisible: false,
        shareImage: '',
      },
    });
  }
  /*门店图片预览显示*/
  function handlePreview(file) {
    dispatch({
      type: 'shopDetailModel/updateState',
      payload: {
        previewVisible: true,
        previewImage: file.url || file.thumbUrl,
      },
    });
  }
  /*门店图片取消预览*/
  function handleCancel() {
    dispatch({
      type: 'shopDetailModel/updateState',
      payload: {
        previewVisible: false,
        previewImage: '',
      },
    });
  }
  /*更新地址 */
  function updateAddree(val) {
    dispatch({
      type: 'shopDetailModel/updateState',
      payload: {
        shopAddress: val.shopAddress,
        lng: val.lng,
        lat: val.lat,
      },
    });
  }

  /*门店详情 */
  const shopDetailProps = {
    isCopy,
    detailLoading,
    shopDetailMess,
    shopItemDetailShow,
    showEditShop,
    editeShopDetailShow,
    closeDialog,
    createLoading,
    confirmCreateAction,
    sharePreview,
    shareVisible, // 分享图片显示
    shareImage, // 分享图片预览,
    shareCancel,
    previewVisible,
    previewImage,
    handlePreview,
    handleCancel,
    updateAddree,
    lng,
    lat,
    shopAddress,
    saveValues,
    createLoading: addShopLoading,
  };
  /*新增门店*/
  const btns = [
    {
      label: '新建',
      handle: showEditShop.bind(this, 1),
    },
  ];

  /* 会员卡列表内容 */
  const shopListProps = {
    showEditShop,
    dataSource, //列表信息
    loading,
    toShopDetail,
  };
  /*搜索栏属性*/
  const searchComponentProps = {
    search: {
      onSearch: searchFunction,
      onClear: searchFunction,
      fields: [
        { key: 'name', type: 'input', placeholder: '门店名称', },
        {
          key: 'createTime',
          type: 'rangePicker',
          showTime: false,
          width: '220px',
          format: 'YYYY-MM-DD',
          startPlaceholder: '创建开始时间',
          endPlaceholder: '创建结束时间',
        },
        {
          key: 'status',
          type: 'select',
          placeholder: '门店状态',
          options: [
            { label: '营业中', key: '1', },
            { label: '歇业中', key: '2', },
            { label: '停业整顿', key: '9', },
          ],
        },
        {
          key: 'address',
          type: 'cascender',
          placeholder: '选择地区',
        },
      ],
    },
    rightBars: {
      btns: btns,
      isSuperSearch: false,
    },
  };
  /* 分页 */
  const pagination = {
    total: resultCount,
    pageIndex: pageIndex,
    pageSize: pageSize,
    showTotal: total => `共 ${total} 条`,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: pageOnChange,
    onChange: pageOnChange,
  };
  return (
    <div style={{ height: '100%', overflow: 'hidden', }}>
      <div style={{ position: 'relative', height: 'calc(100% - 42px)', }}>
        <SearchComponents {...searchComponentProps} />
        <div style={{ fontSize: '20px', }}>现有门店：{pagination.total}家</div>
        <ShopListComponent {...shopListProps} />
      </div>
      <div
        className="manager_list_pagination_box"
        style={{
          bottom: '49px',
          width: 'calc(100% - 170px)',
        }}
      >
        <div className="manager_list_pagination">
          <Pagination
            {...pagination}
            current={parseInt(pagination.pageIndex) + 1}
            pageSizeOptions={['20', '50', '100', '500', '1000',]}
            size="small"
          />
        </div>
      </div>
      {/* 查看店铺详情 */}
      <ShopDetailComponent style={{ width: '800px', }}
        {...shopDetailProps}
      />
      {/* 新增编辑店铺详情 */}
      <EditeShopDetailComponent {...shopDetailProps} />
    </div>
  );
}

function mapStateToProps({ shopDetailModel, }) {
  return { shopDetailModel, };
}

export default connect(mapStateToProps)(shopManagePage);
