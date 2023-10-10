import React, {useState} from 'react';
import {Platform, Image} from 'react-native';
import {
  Toast,
  Center,
  Box,
  FormControl,
  Heading,
  VStack,
  useToast,
  Button,
  Input,
} from 'native-base';
import {launchImageLibrary} from 'react-native-image-picker';
import {request} from '../network';

// import Icon from 'react-native-vector-icons/FontAwesome';

const Register = (props: any): JSX.Element => {
  // console.log(props);
  const toast = useToast();
  const [info, setInfo] = useState<userinfoType>({
    userName: '',
    password: '',
    // avatar: '',
  });
  const [photo, setPhoto] = useState<any>();

  const handleChoosePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      console.log('response', response);
      if (
        response &&
        !response.didCancel &&
        response.assets &&
        response.assets.length > 0
      ) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const createFormData = (body: {[key: string]: any} = {}) => {
    const data = new FormData();
    console.log('photo', photo);
    if (photo) {
      data.append('avatar', {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      });
    }

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    console.log(' Platform.OS', Platform.OS);

    console.log(data);

    return data;
  };

  const handleRegister = async () => {
    try {
      if (!info || !info.userName || !info.password) {
        toast.show({
          title: '用户名或者密码不能为空！',
        });
        return;
      }
      const res: any = await request({
        url: '/user/create',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: createFormData(info),
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
    } catch (e) {
      console.log(e);
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
          {photo && (
            <>
              {/* <Text>{JSON.stringify(photo)}</Text> */}
              <Image
                source={{uri: photo?.uri}}
                style={{width: 100, height: 100}}
              />
              {/* <Button title="Upload Photo" onPress={handleUploadPhoto} /> */}
            </>
          )}
          <Button onPress={handleChoosePhoto}>choose picker</Button>
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
