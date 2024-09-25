export default defineAppConfig({
  pages: [
    'pages/RemoveWatermark/index',
    'pages/AnalysisDetails/index',
    'pages/FAQ/index',
    'pages/Tutorial/index',
    'pages/CreateActivationCode/index',
  ],
  subPackages: [
    {
      root: 'subPages/',
      pages: [
        'ToolsList/index',
        'EatTodayWhat/index',
        'CrazyThursday/index',
        'RandomPassword/index',

        // 'ExpressQuery/index',
        // 'HotSearchList/index',
        // 'WebLink/index',
        // 'TvBoxOffice/index',
        // 'HistoryToday/index',
        // 'GoldPrice/index',
      ],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
});
