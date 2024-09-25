export default defineAppConfig({
  pages: ["pages/RemoveWatermark/index", "pages/AnalysisDetails/index", "pages/FAQ/index", "pages/Tutorial/index", "pages/CreateActivationCode/index"],
  subPackages: [
    {
      root: "subPages/",
      pages: ["ToolsList/index", "ExpressQuery/index", "HotSearchList/index", "WebLink/index", "NationalDayAvatar/index"],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
});
