import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import {
  Container,
  Input,
  Button,
  Text,
  Toast,
  Center,
  Box,
  useColorModeValue,
  StatusBar,
  FormControl,
  HStack,
  Heading,
  Link,
  VStack,
  useToast,
} from 'native-base';
import {request} from '../network';
import store from '../store';
// import Icon from 'react-native-vector-icons/FontAwesome';

const Register = props => {
  console.log(props);
  const toast = useToast();
  const [info, setInfo] = useState({
    userName: '',
    password: '',
    avatar: '',
  });

  const handleRegister = async () => {
    const res: any = await request({
      url: '/user/create',
      method: 'post',
      data: info,
    });

    const data = res?.data;

    if (data && data.success) {
      console.log('注册成功', data);
      toast.show({
        render: () => {
          return (
            <Box bg="emerald.500" px="2" py="1" rounded="sm" mb={5}>
              注册成功！
            </Box>
          );
        },
      });
      props.jumpTo('login');
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
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading
          size="lg"
          color="coolGray.800"
          _dark={{
            color: 'warmGray.50',
          }}
          fontWeight="semibold">
          Welcome
        </Heading>
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: 'warmGray.200',
          }}
          fontWeight="medium"
          size="xs">
          Sign up to continue!
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
          </FormControl>
          {/* <FormControl>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input type="password" />
          </FormControl> */}
          <Button mt="2" colorScheme="indigo" onPress={handleRegister}>
            Sign up
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Register;
