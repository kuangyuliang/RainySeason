const encode = (value) => {
    return encodeURIComponent(value)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']')
}

let nextStr = '';
function serialize(obj) {
    let str = ''
    if (typeof obj == 'object') {
        for (let i in obj) {
            if (typeof obj[i] != 'function' && typeof obj[i] != 'object') {
                str += i + '=' + obj[i] + '&';
            } else if (typeof obj[i] == 'object') {
                nextStr = '';
                str += changeSonType(i, obj[i])
            }
        }
    }
    return str.replace(/&$/g, '');
}

function changeSonType(objName, objValue) {
    if (typeof objValue == 'object') {
        for (let i in objValue) {
            if (typeof objValue[i] != 'object') {
                let value = objName + '[' + i + ']=' + objValue[i];
                nextStr += encodeURI(value) + '&';
            } else {
                changeSonType(objName + '[' + i + ']', objValue[i]);
            }
        }
    }
    return nextStr;
}

export default serialize;