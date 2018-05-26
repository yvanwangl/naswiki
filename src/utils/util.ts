import request from './request';

function formatDate(date: Date | string) {
    if (typeof date == 'string') {
        date = new Date(date);
    }
    return date;
}

/**
 * 日期格式化工具方法
 * @param date 
 * @param formatType  1: 2017-03-22 ; 2: 2017年03月22日
 */
export function dateFormat(date: Date | string, formatType: number = 1) {
    date = formatDate(date);
    let year = date.getFullYear();
    let month = `0${date.getMonth() + 1}`.substr(-2);
    let day = `0${date.getDate()}`.substr(-2);
    let dateStr = `${year}-${month}-${day}`;
    switch (formatType) {
        case 1:
            dateStr = `${year}-${month}-${day}`;
            break;
        case 2:
            dateStr = `${year}年 ${month}月 ${day}日`;
            break;
    }
    return dateStr;
}

/*时间格式化工具方法*/
export function timeFormat(date: Date | string) {
    date = formatDate(date);
    let hours = `0${date.getHours()}`.substr(-2);
    let minutes = `0${date.getMinutes()}`.substr(-2);
    return `${hours}:${minutes}`;
}

/*时间格式化 时:分:秒*/
export function timeFormat2(date: Date | string) {
    date = formatDate(date);
    let hours = `0${date.getHours()}`.substr(-2);
    let minutes = `0${date.getMinutes()}`.substr(-2);
    let seconds = `0${date.getSeconds()}`.substr(-2);
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * 判断一个对象是否为空对象
 */
export function emptyObj(obj: object) {
    if (typeof obj !== 'object') {
        throw new Error('obj must be object type');
    }
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

/**
 * 获取用户授权信息
 */
export function userAuth() {
    let authenticate = false;
    let admin = false;
    let user = sessionStorage.getItem('user');
    if (user) {
        let userInfo = JSON.parse(user);
        authenticate = user && userInfo.userId && userInfo.username;
        admin = authenticate && userInfo.admin;
    }
    return {
        authenticate,
        admin
    };
}

/**
 * 退出事件
 */
export function logOut() {
    return request('/api/logout', { method: 'post' }).then((result) => {
        if (result && result.success) {
            sessionStorage.removeItem('user');
        }
    });
}