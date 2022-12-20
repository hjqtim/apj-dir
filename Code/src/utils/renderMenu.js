import _ from 'lodash';

/**
 *
 * @param {*} groups 支持的群组
 * @param {*} userGroups 用户的群组
 * @returns true为显示该菜单，false为隐藏该菜单
 */
const renderMenu = (groups, userGroups) => {
  if (!groups?.length || !userGroups?.length) {
    return true;
  }
  if (!_.intersection(groups, userGroups).length) {
    return false;
  }
  return true;
};

export default renderMenu;
