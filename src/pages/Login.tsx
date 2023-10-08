import React, {useCallback, useState} from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Heading,
  Input,
  Link,
  Pressable,
  StatusBar,
  Text,
  Toast,
  VStack,
  useColorModeValue,
  useToast,
} from 'native-base';
import {Animated, Dimensions} from 'react-native';
import {SceneMap, TabView} from 'react-native-tab-view';
import Register from './Register';
import {request} from '../network';
import store from '../store';

interface IProps {
  tabProps: any;
  navigateMsg: () => void;
}

function LoginTab(props: IProps): JSX.Element {
  const {tabProps, navigateMsg} = props;
  const [info, setInfo] = useState({userName: '', password: ''});
  // navigation.navigate('register');
  console.log('login props', props);
  const toast = useToast();
  const handleLogin = async () => {
    // 调用接口进行登录验证，返回结果
    const res: any = await request({
      url: '/user/check',
      method: 'post',
      data: info,
    });
    console.log(res.data);
    const data = res.data;
    // const loginSuccess = await false;

    if (data && data.success) {
      // 登录成功的操作
      console.log('登录成功', data);
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              登录成功！
            </Box>
          );
        },
      });
      await store.save({
        key: 'userInfo',
        data: data.data,
      });

      navigateMsg();
    } else {
      Toast.show({
        title: data.msg,
        // type: 'danger',
        placement: 'bottom',
        duration: 3000,
      });
    }
  };

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <Heading
          size="lg"
          fontWeight="600"
          color="coolGray.800"
          _dark={{
            color: 'warmGray.50',
          }}>
          Welcome
        </Heading>
        <Heading
          mt="1"
          _dark={{
            color: 'warmGray.200',
          }}
          color="coolGray.600"
          fontWeight="medium"
          size="xs">
          Sign in to continue!
        </Heading>

        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>UserName</FormControl.Label>
            <Input
              onChangeText={value =>
                setInfo({
                  ...info,
                  userName: value,
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              type="password"
              onChangeText={value =>
                setInfo({
                  ...info,
                  password: value,
                })
              }
            />
            <Link
              _text={{
                fontSize: 'xs',
                fontWeight: '500',
                color: 'indigo.500',
              }}
              alignSelf="flex-end"
              mt="1">
              Forget Password?
            </Link>
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={handleLogin}>
            Sign in
          </Button>
          <HStack mt="6" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}>
              I'm a new user.{' '}
            </Text>
            <Link
              _text={{
                color: 'indigo.500',
                fontWeight: 'medium',
                fontSize: 'sm',
              }}
              onPress={() => {
                console.log('PRESS');

                tabProps.jumpTo('register');
              }}>
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Center>
  );
}

function LoginScreen({navigation}) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'login',
      title: 'login',
    },
    {
      key: 'register',
      title: 'register',
    },
  ]);

  const navigateMsg = useCallback(() => {
    navigation.navigate('main');
  }, [navigation]);

  const initialLayout = {
    width: Dimensions.get('window').width,
  };
  const renderScene = SceneMap({
    // first: (props) => <LoginTab ...props />,
    login: props => <LoginTab navigateMsg={navigateMsg} tabProps={props} />,
    register: Register,
  });

  const renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? 1 : 0.5,
            ),
          });
          const color =
            index === i
              ? useColorModeValue('#000', '#e5e5e5')
              : useColorModeValue('#1f2937', '#a1a1aa');
          const borderColor =
            index === i
              ? 'cyan.500'
              : useColorModeValue('coolGray.200', 'gray.400');
          return (
            <Box
              borderBottomWidth="3"
              borderColor={borderColor}
              flex={1}
              alignItems="center"
              p="3"
              key={JSON.stringify(route)}
              cursor="pointer">
              <Pressable
                onPress={() => {
                  console.log(i);
                  setIndex(i);
                }}>
                <Animated.Text
                  style={{
                    color,
                  }}>
                  {route.title}
                </Animated.Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={{
        marginTop: StatusBar.currentHeight,
      }}
    />
  );
}

export default LoginScreen;
