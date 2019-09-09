/*
 * 比较两个对象的属性是否相同
 */
export function objEquals(source, target) {
    if(source == undefined && target == undefined) {
        return true;
    }
    if(source == undefined || target == undefined) {
        return false;
    }

    let sourceKeys = Object.keys(source);
    let targetKeys = Object.keys(target);

    if(sourceKeys.length != targetKeys.length) {
        return false;
    }

    for(let i = 0; i < sourceKeys.length; i++) {
        let sourceKey = sourceKeys[i];
        if(source[sourceKey] != target[sourceKey]) {
            return false;
        }
    }
    return true;
}
