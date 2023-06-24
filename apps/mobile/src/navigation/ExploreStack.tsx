import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import Header from '../components/common/Header'
import { ExploreScreen } from '../screens/ExploreScreen'
import useMobileStore from '../store'

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>()

export const ExploreStack = (): JSX.Element => {
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor)

  return (
    <Navigator>
      <Screen
        name="Explore"
        options={{
          title: 'Explore',
          headerTitle: (props) => <Header {...props} />,
          headerShadowVisible: false,
          // headerStyle: {
          //   backgroundColor: theme.colors.background
          // },
          animationEnabled: true,
          headerStyle: {
            backgroundColor: `${homeGradientColor}35`,
            // hide header shadow
            shadowColor: 'transparent', // this covers iOS
            elevation: 0 // this covers Android
          }
        }}
        component={ExploreScreen}
      />
    </Navigator>
  )
}
