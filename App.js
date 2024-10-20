import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import AddItemsScreen from './screens/AddItemsScreen';
import ProfileScreen from './screens/ProfileScreen';
import SectionScreen from './screens/SectionScreen';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'; 
import { Sunshiney_400Regular } from '@expo-google-fonts/sunshiney';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync(); 

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Disable default header
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Section" component={SectionScreen} />
      <Stack.Screen
        name="AddItems"
        component={AddItemsScreen}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Disable default header
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Sunshiney_400Regular,
  });

  const onLayoutRootView = React.useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'HomeStack') {
              iconName = 'home-outline';
            } else if (route.name === 'ProfileStack') {
              iconName = 'chatbubble-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} style={styles.icon} />;
          },
          tabBarActiveTintColor: '#9FD6CA',
          tabBarInactiveTintColor: '#95a5a6',
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        })}
      >
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="AddItemsTab"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarButton: (props) => (
              <TouchableOpacity style={styles.centerButton} onPress={props.onPress}>
                <Ionicons name="add-circle-outline" size={50} color="#9FD6CA" />
              </TouchableOpacity>
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate('HomeStack', { screen: 'AddItems' });
            },
          })}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    elevation: 0,
    backgroundColor: '#fffbf0',
    borderRadius: 25,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    padding: 5,
    top: 10,
  },
  centerButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fffbf0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});
