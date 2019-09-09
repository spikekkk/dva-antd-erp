/* eslint-disable no-undef */
import fetch from 'dva/fetch';
import reqwest from 'reqwest';
import Promise from 'promise-polyfill';
import JsonP from 'fetch-jsonp';
import { message, } from 'antd';

function parseJSON(response) {
  return response.json();
}
function parseJSON1(response) {
  return response.blob();
}
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

window.requestData = function(url, options) {
  let ct = '';
  options.isForm
    ? (ct = 'application/x-www-form-urlencoded')
    : (ct = 'application/json');
  options = {
    ...options,
    credentials: 'include', //fetch  请求加上cookie
    headers: {
      ...options.headers,
      isAjax: 'yes',
      'Content-Type': ct,
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  return fetch(url, options)
    .then(checkStatus)
    .then(options.isJson ? parseJSON1 : parseJSON)
    .then(function(ret) {
      if (ret && ret.errorCode == 2000) {
        if (ret.errorMessage.indexOf('登录') > -1) {
          throw new Error(ret.errorMessage);
        }
      }
      return { ret, };
    })
    .catch(err => {
      if (err.message.indexOf('登录') > -1) {
        throw err;
      } else {
        return { err, };
      }
    });
  //    return fetch(url, options)
  //        .then(checkStatus)
  //        .then(parseJSON)
  //        .then((ret) => ({ ret }))
  //        .catch(function(err) {
  //        console.info('fetch error', err);
  //    });
};

window.serviceRequest = function(url, data, suc, fail) {
  //异步请求
  reqwest({
    url: url,
    method: 'POST',
    type: 'json',
    headers: {
      isAjax: 'yes',
    },
    data: data,
  }).then(
    result => {
      if (result.errorCode == 9000) {
        if (suc) {
          suc(result);
        }
      } else {
        if (result.errorCode == 2000) {
          window.location = BASE_URL;
        } else {
          if (fail) {
            fail(result);
          } else {
            message.error(result.errorMessage || '服务器开小差啦');
          }
        }
      }
    },
    function(err, msg) {
      message.error('服务器开小差啦');
    }
  );
};

window._ = function(...value) {
  console.info('console', ...value);
};

// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError(
        'Array.prototype.findIndex called on null or undefined'
      );
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    const list = Object(this);
    const length = list.length >>> 0;
    const thisArg = arguments[1];
    let value;

    for (let i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return i;
      }
    }
    return -1;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    const list = Object(this);
    const length = list.length >>> 0;
    const thisArg = arguments[1];
    let value;

    for (let i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

window.JsonpRequest = function(url, suc, fail) {
  JsonP(url, {
    jsonpCallback: 'callback',
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if (json.status == '1') {
        if (!!suc) {
          suc();
        }
      } else {
        if (!!fail) {
          fail();
        }
      }
      console.log('parsed json', json);
    })
    .catch(function(ex) {
      if (!!fail) {
        fail();
      }
      console.log('parsing failed', ex);
    });
};

window._ = function(...value) {
  console.info(...value);
};
