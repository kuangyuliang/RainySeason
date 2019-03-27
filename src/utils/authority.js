import moment from 'moment';

export function getLocalStorage(key) {
    const data = localStorage.getItem(key);
    if (data) {
        const { value, expired } = JSON.parse(data);
        if (!expired) {
            return value;
        }
        else {
            if (moment().isAfter(moment.unix(expired))) {
                return value;
            }
            removeLocalStorage(key);
        }
    }
    return '';
}

export function setLocalStorage(key, value, expired = '') {
    if (!isNaN(parseInt(expired))) {
        expired = moment().add(expired, 's').unix();
    }
    return localStorage.setItem(key, JSON.stringify({ value, expired }));
}

export function removeLocalStorage(key) {
    return localStorage.removeItem(key);
}