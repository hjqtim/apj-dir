// 全局通用reducer
const defaultValue = {
  isShowMenu: true // 菜单显示与隐藏
};

const networkCloset = (state = defaultValue, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'global/setIsShowMenu': {
      return { ...state, isShowMenu: payload };
    }

    default: {
      return { ...state };
    }
  }
};

export default networkCloset;
