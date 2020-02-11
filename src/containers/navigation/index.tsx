import { createSwitchNavigator, createAppContainer } from "react-navigation";
import AppStack from "./tab-bar/tab-bar.router";

export default createAppContainer(createSwitchNavigator(
  {
    App: AppStack,
  },
  {
    backBehavior: 'initialRoute',
    initialRouteName: 'App',
  }
));
