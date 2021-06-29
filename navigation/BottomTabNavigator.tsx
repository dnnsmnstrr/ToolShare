import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Button } from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import Icon from '../components/Icon';
import IconButton from '../components/IconButton';
import Tools from '../screens/Tools';
import ToolDetails from '../screens/ToolDetails';
import AddTool from '../screens/AddTool';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import useAuth from '../hooks/useAuth';

const LogoutButton = () => {
  const {logout} = useAuth()
  return <Button
  title='Logout'
  color='red'
  onPress={logout}
  />
}

const NavButton = ({title = '', goTo, color = 'blue', navigation}) => (
  <Button
    style={{ paddingRight: 10 }}
    title={title}
    color={color}
    onPress={() => navigation.navigate(goTo || title)}
  />
)

const NavAction = ({name, family, onPress, color, size=26}) => (
  <IconButton
    style={{ paddingRight: 10 }}
    name={name}
    family={family}
    color={color}
    onPress={onPress}
  />
)

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
      <BottomTab.Screen
        name="Tools"
        component={TabOneNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => <Icon size={28} name={focused ? 'hammer' : 'hammer-outline'} family='ionic' color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={TabTwoNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => <Icon size={28} name={'toolbox'} family='materialCommunity' focused={focused} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

function TabOneNavigator() {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="Tools"
        component={Tools}
        options={({navigation}) => ({
          headerTitle: 'Tools',
          headerRight: () => <NavAction name='add' onPress={() => navigation.navigate('AddTool')}/>
        })}
      />
      <TabOneStack.Screen
        name="AddTool"
        component={AddTool}
        options={{ headerTitle: 'Werkzeug hinzufügen' }}
      />
      <TabOneStack.Screen
        name="ToolDetails"
        component={ToolDetails}
        options={{ headerTitle: 'Tool' }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({
          headerTitle: 'Profil',
          headerRight: () => <NavAction name='settings' onPress={() => navigation.navigate('Settings')} size={26}/>
        })}
      />
      <TabTwoStack.Screen
        name="ToolEdit"
        component={ToolDetails}
        options={{ headerTitle: 'Tool' }}
      />
      <TabTwoStack.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          headerTitle: 'Einstellungen',
          headerRight: LogoutButton
        })}
      />
    </TabTwoStack.Navigator>
  );
}
