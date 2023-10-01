import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserVO, UserForm, UserQuery, UserexpireVo } from "@/api/card/user/types";

/**
 * 查询用户信息列表
 * @param query
 * @returns {*}
 */

export const listUser = (query?: UserQuery): AxiosPromise<UserVO[]> => {
  return request({
    url: '/card/user/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询用户信息详细
 * @param userId
 */
export const getUser = (userId: string | number): AxiosPromise<UserVO> => {
  return request({
    url: '/card/user/' + userId,
    method: 'get'
  });
};

/**
 * 新增用户信息
 * @param data
 */
export const addUser = (data: UserForm) => {
  return request({
    url: '/card/user',
    method: 'post',
    data: data
  });
};

/**
 * 修改用户信息
 * @param data
 */
export const updateUser = (data: UserForm) => {
  return request({
    url: '/card/user',
    method: 'put',
    data: data
  });
};

export const expireUser = (data: UserexpireVo) => {
  return request({
    url: '/card/user/expire',
    method: 'put',
    data: data
  });
};

/**
 * 用户状态修改
 * @param userId 用户ID
 * @param status 用户状态
 */
export const changeUserStatus = (userId: number | string, status: string) => {
  const data = {
    userId,
    status
  };
  return request({
    url: '/card/user/changeStatus',
    method: 'put',
    data: data
  });
};

/**
 * 删除用户信息
 * @param userId
 */
export const delUser = (userId: string | number | Array<string | number>) => {
  return request({
    url: '/card/user/' + userId,
    method: 'delete'
  });
};
