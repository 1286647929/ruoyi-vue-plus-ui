import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CarmiVO, CarmiForm, CarmiQuery } from '@/api/card/carmi/types';

/**
 * 查询卡密列表
 * @param query
 * @returns {*}
 */

export const listCarmi = (query?: CarmiQuery): AxiosPromise<CarmiVO[]> => {
  return request({
    url: '/card/carmi/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询卡密详细
 * @param cardId
 */
export const getCarmi = (cardId: string | number): AxiosPromise<CarmiVO> => {
  return request({
    url: '/card/carmi/' + cardId,
    method: 'get'
  });
};

/**
 * 新增卡密
 * @param data
 */
export const addCarmi = (data: CarmiForm) => {
  return request({
    url: '/card/carmi',
    method: 'post',
    data: data
  });
};

/**
 * 修改卡密
 * @param data
 */
export const updateCarmi = (data: CarmiForm) => {
  return request({
    url: '/card/carmi',
    method: 'put',
    data: data
  });
};

/**
 * 删除卡密
 * @param cardId
 */
export const delCarmi = (cardId: string | number | Array<string | number>) => {
  return request({
    url: '/card/carmi/' + cardId,
    method: 'delete'
  });
};

export const pay = (data: any) => {
  return request({
    url: '/pay/topay',
    method: 'post',
    data: data
  });
};

/**
 * 根据订单查询卡密
 * @param data
 */
export const getCarmiByOrder = (data: any): AxiosPromise<CarmiVO> => {
  return request({
    url: '/pay/checkpaystatus',
    method: 'get',
    params: data
  });
};
