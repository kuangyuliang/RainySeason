import { PAGE_SIZE } from '@/constants';
import request from '@/utils/request';

export function fetch({ page = 1 }) {
  return request(`http://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${PAGE_SIZE}`);
}

export function patch(id, values) {
  return request(`/api/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
}

export function remove(id){
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}