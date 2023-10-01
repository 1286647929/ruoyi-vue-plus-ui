export interface CarmiVO {
  /**
   * 卡密id
   */
  cardId: string | number;

  /**
   * 卡密
   */
  cardKey: string;

  /**
   * 卡密类型
   */
  cardType: string;

  /**
   * 状态（0未使用 1已使用）
   */
  status: string;

  /**
   * 创建者
   */
  createBy: number;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 备注
   */
  remark: string;

}

export interface CarmiForm extends BaseEntity {
  /**
   * 卡密id
   */
  cardId?: string | number;

  /**
   * 卡密数量
   */
  cardNum?: number;

  /**
   * 卡密前缀
   */
  cardPre?: string;

  /**
   * 卡密类型
   */
  cardType?: string;

  /**
   * 状态（0未使用 1已使用）
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;

}

export interface CarmiQuery extends PageQuery {
  /**
   * 卡密
   */
  cardKey?: string;

  /**
   * 卡密类型
   */
  cardType?: string;

  /**
   * 状态（0未使用 1已使用）
   */
  status?: string;

}
