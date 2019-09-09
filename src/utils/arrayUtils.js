import moment from 'moment';

/*
 * textarea数据格式转换
 * @params textarea内容
 */
export function transformArea(text) {
    let finial = undefined;
    if(!!text){
//        if(text.indexOf('[') > -1){
//            finial = JSON.parse(text).join('<br/>').replace(new RegExp("<br/>","g"), '\n');
//        } else {
            finial = text.replace(new RegExp("<br/>","g"), '\n');
//        }
    }
    return finial;
}

/*
 * 平级数据转成树形结构
 */
export function listToTree(arr, rootId) {
    let results = [], temp;
    for(let i = 0; i < arr.length; i++) {
        if(arr[i].parent_id == rootId) {
            let obj = {...arr[i]};
            temp = listToTree(arr, arr[i].id);
            if(temp.length > 0) {
                obj.children = temp;
            }
            results.push(obj);
        }
    }
    return results;
}

/*
 * 二级菜单按分组
 */
export function listToGroup(arr) {
    let mapMenuItems = {};//菜单的分组数据
    let groupIds = [];//二级菜单的分组

    if(arr && arr.length > 0) {
        arr.map(function(item) {
            let itemGroupId = item.group_id || '0';
            if(groupIds.findIndex((value) => value == itemGroupId) == -1) {
                groupIds.push(itemGroupId);
                mapMenuItems[itemGroupId] = [];
            }
        });

        groupIds = groupIds.sort((a,b) => parseInt(a + '') - parseInt(b + ''));

        groupIds.map(function(gidItem) {
            arr.map(function(menuItem) {
                let itemGroupId = menuItem.group_id || '0';
                if(itemGroupId == gidItem) {
                    mapMenuItems[gidItem].push(menuItem);
                }
            });
        });
    }

    return mapMenuItems;
}

/*
 * 对象数组按某一属性排序(数据内容是int)
 */
export function objListSort(arr, sortField) {
    let new_arr = arr.sort(function(obj1, obj2){
        let num1 = obj1[sortField] || 0;
        let num2 = obj2[sortField] || 0;
        return parseInt(num1 + '') - parseInt(num2 + '');
    });
    return new_arr;
}

/*
 * 对象数组按某一属性排序(数据内容是时间)
 */
export function objListSortOfTime(arr, sortField, format) {
    if(arr && arr.length > 0) {
        let new_arr = arr.sort(function(obj1, obj2){
            let str1 = obj1[sortField];
            let str2 = obj2[sortField];
            let time1 = moment(str1, format);
            let time2 = moment(str2, format);
            return time1 - time2;
        });
        return new_arr;
    } else {
        return arr;
    }
}

/*
 * 对象数组按某一属性分组
 */
export function objListGroup(arr, groupField) {
    if(arr && arr.length > 0) {
        let obj = {};
        let keys = [];
        arr.forEach(function(item) {
            let field = item[groupField];
            if(keys.findIndex(function(v) {
                return v == field;
            }) == -1) {
                keys.push(field);
                obj[field] = [item];

            } else {
                obj[field].push(item);
            }
        });

        return obj;
    } else {
        return {};
    }
}

/*
 * 课程表数据整理算法
 *
 */
export function scheduleDataAlgorithm(scheduleDataList) {
    let afterGroupData = objListGroup(scheduleDataList, 'studyDate');//按日期分组后数据

    let dayKeys = Object.keys(afterGroupData);

    let classScheduleData = {};
    dayKeys.forEach(function(item) {
        let dayScheduleDataList = afterGroupData[item];// 一天的所有课程表计划

        if(dayScheduleDataList && dayScheduleDataList.length > 0) {
            let afterSortList = objListSortOfTime(dayScheduleDataList, 'startTime', 'HH:mm');//按照开始时间排序

            let data = {};

            let min_begin_time = '';
            let max_end_time = '';

            afterSortList.forEach(function(classItem) {

                let class_begin_time = classItem.startTime;
                let class_end_time   = classItem.endTime;

                if(min_begin_time == '') {
                    min_begin_time = class_begin_time;
                }
                if(max_end_time == '') {
                    max_end_time = class_end_time;
                }

                //新一行的课程表数据
                if(class_begin_time >= max_end_time) {
                    //更新当前最小开始时间
                    min_begin_time = class_begin_time;
                    //更新当前最大的结束时间
                    max_end_time = class_end_time;

                    if(!data[min_begin_time]) {
                        data[min_begin_time] = [];
                    }
                    data[min_begin_time].push(classItem);
                } else {
                    if(!data[min_begin_time]) {
                        data[min_begin_time] = [];
                    }
                    data[min_begin_time].push(classItem);

                    //更新当前最大的结束时间
                    if(class_end_time > max_end_time) {
                        max_end_time = class_end_time;
                    }
                }
            });
            classScheduleData[item] = data;
        }
    });

    return classScheduleData;
}

/*
 * 数组去重
 * 返回去重后数组
 */
export function uniqueArr(arr){
　　var res =[];
　　var json = {};
　　for(var i=0;i<arr.length;i++){
　　　　if(!json[arr[i]]){
　　　　　　res.push(arr[i]);
　　　　　　json[arr[i]] = 1;
　　　　}
　　}
　　return res;
}
