/*
 * @Author: cds 
 * @Date: 2018-10-16 09:48:45 
 * @Last Modified by: cds
 * @Last Modified time: 2018-10-16 09:59:08
 */

/**
 * 训练模型拼接并去重；
 * 如果旧的训练模型中存在当前训练用户的数据，则更新当前用户的数据
 */
exports.MergeArray = function (newArr, oldArr) {
    var _arr = new Array();
    for (var i = 0; i < newArr.length; i++) {
        _arr.push(newArr[i]);
    }
    for (var i = 0; i < oldArr.length; i++) {
        var flag = true;
        for (var j = 0; j < newArr.length; j++) {
            if (oldArr[i].className == newArr[j].className) {
                flag = false;
                break;
            }
        }
        if (flag) {
            _arr.push(oldArr[i]);
        }
    }
    return _arr;
}