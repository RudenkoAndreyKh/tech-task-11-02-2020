import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { NavigationScreenProp, NavigationState, NavigationParams, SafeAreaView } from "react-navigation";

const width = Dimensions.get('screen').width;

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface State {

}

interface TabBarItem {
  displayName: string,
  imageSource: any,
  activeImageSource: any
}
class TabBarComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {

    }
  }

  public items: TabBarItem[] = [
    {
      displayName: 'PlanetList',
      imageSource: 'https://img.icons8.com/ios-filled/40/aaaaaa/earth-planet.png',
      activeImageSource: 'https://img.icons8.com/ios-filled/40/fd2e45/earth-planet.png'
    },
    {
      displayName: 'Favorites',
      imageSource: 'https://img.icons8.com/material/40/aaaaaa/like--v1.png',
      activeImageSource: 'https://img.icons8.com/material/40/fd2e45/like--v1.png',
    }
  ]

  public handlePress = (index: number) => () => {
    let openDisplay = this.items[index].displayName;
    this.props.navigation.navigate(openDisplay);
  };

  render() {
    return (
      <React.Fragment>
        <SafeAreaView
          forceInset={{ top: 'never', horizontal: 'never', bottom: 'always' }}>
          <View style={styles.tabBar}>
            {
              this.items.map((item: TabBarItem, index: number) => {
                const focused = this.props.navigation.state.index == index;

                return (
                  <TouchableOpacity
                    onPress={this.handlePress(index)}
                    style={styles.oneTab}
                    key={index}>
                    <Image
                      style={styles.tabBtnIcon}
                      source={{ uri: focused ? item.activeImageSource : item.imageSource }}
                    />
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </SafeAreaView>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: '#3B3935',
    flexDirection: "row",
    justifyContent: 'space-between',
    width: width
  },
  oneTab: {
    backgroundColor: '#17141C',
    alignItems: 'center',
    width: width / 2,
    paddingVertical: 12,
  },
  tabBtnIcon: {
    width: 30,
    height: 30,
  },
});

export default TabBarComponent