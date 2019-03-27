import request from '@/utils/request';
import qs from 'querystring';

export async function send(params) {
  let { url, method, param } = params;
  let p = { method };
  switch (method.toUpperCase()) {
    case "GET":
    case "DELETE":
      if (param) {
        url += `?${qs.stringify(param)}`;
      }
      break;
    default:
      p = { method, body: JSON.stringify(param) };
  }
  
  return request(`/api/${url}`, p);
}