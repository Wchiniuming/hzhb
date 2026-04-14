export const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    colorBgBase: '#ffffff',
    colorTextBase: '#262626',
    borderRadius: 6,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
      bodyBg: '#f0f2f5',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff',
      itemHoverBg: '#f5f5f5',
    },
    Card: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
    },
    Button: {
      primaryShadow: '0 2px 0 rgba(24, 144, 255, 0.2)',
    },
  },
};

export const colors = {
  primary: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#13c2c2',
  
  gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientSuccess: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  gradientWarning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  gradientInfo: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  
  background: {
    light: '#f0f2f5',
    card: '#ffffff',
    header: '#ffffff',
    sidebar: '#ffffff',
  },
  
  text: {
    primary: '#262626',
    secondary: '#8c8c8c',
    disabled: '#bfbfbf',
  },
  
  border: {
    default: '#d9d9d9',
    light: '#f0f0f0',
  },
  
  cardColors: [
    { bg: '#1890ff', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { bg: '#52c41a', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
    { bg: '#faad14', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { bg: '#13c2c2', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { bg: '#722ed1', gradient: 'linear-gradient(135deg, #e100ff 0%, #7f00ff 100%)' },
    { bg: '#eb2f96', gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)' },
  ],
};
