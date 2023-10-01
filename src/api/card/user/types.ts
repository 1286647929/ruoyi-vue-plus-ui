export interface UserVO {
  /**
   * 用户ID
   */
  userId: string | number;

  /**
   * 用户账号
   */
  userName: string;

  /**
   * 用户类型
   */
  userType: string;

  /**
   * 过期时间
   */
  expireTime: string;

  /**
   * 帐号状态（0正常 1停用）
   */
  status: string;

  /**
   * 最后登录IP
   */
  loginIp: string;

  /**
   * 最后登录时间
   */
  loginDate: string;

  /**
   * 备注
   */
  remark: string;

}

export interface UserForm extends BaseEntity {
  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 用户账号
   */
  userName?: string;

  /**
   * 用户类型
   */
  userType?: string;

  /**
   * 密码
   */
  password?: string;

  /**
   * 过期时间
   */
  expireTime?: string;

  /**
   * 帐号状态（0正常 1停用）
   */
  status?: string;

  /**
   * 最后登录IP
   */
  loginIp?: string;

  /**
   * 最后登录时间
   */
  loginDate?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 卡密
   */
  cardKey?: string;
}

export interface UserQuery extends PageQuery {
  /**
   * 用户账号
   */
  userName?: string;

  /**
   * 用户类型
   */
  userType?: string;

  /**
   * 过期时间
   */
  expireTime?: string;

  /**
   * 帐号状态（0正常 1停用）
   */
  status?: string;

  /**
   * 最后登录IP
   */
  loginIp?: string;
}

export interface UserexpireVo {
  /**
   * 用户ID
   */
  userId?: string | number;

  /**
   * 用户账号
   */
  userName?: string;

  /**
   * 卡密
   */
  cardKey?: string;
}
