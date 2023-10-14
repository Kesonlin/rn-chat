import React, {useEffect, useState} from 'react';
import {
  AddIcon,
  AspectRatio,
  Avatar,
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Modal,
  ScrollView,
  Spacer,
  Stack,
  Text,
  VStack,
} from 'native-base';
import {launchImageLibrary} from 'react-native-image-picker';
import {request} from '../network';
import {useIsFocused} from '@react-navigation/native';
import store from '../store';
import {Platform} from 'react-native';
function Moment(props: any): JSX.Element {
  const {item} = props;
  return (
    <Box alignItems="center" w="100%" borderColor="pink" mb="4">
      <Box
        // maxW="96"
        // rounded="lg"
        pl="4"
        pr="4"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: 'coolGray.600',
          backgroundColor: 'gray.700',
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}>
        <HStack
          space={[2, 3]}
          justifyContent="space-between"
          marginBottom="1"
          mt="3">
          <Avatar
            size="48px"
            source={{
              uri: item.avatar,
            }}
          />
          <VStack>
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold>
              {item.userName}
            </Text>
            <Text
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}>
              {item.createTime}
            </Text>
          </VStack>
          <Spacer />
        </HStack>
        <Box>
          <Stack space={3}>
            <Heading size="md" ml="3" mt="2" mb="2">
              {item.title}
            </Heading>
          </Stack>
          <AspectRatio w="100%" ratio={16 / 9}>
            <Image
              source={{
                uri: item.photo,
              }}
              alt="image"
            />
          </AspectRatio>
        </Box>
        <Stack p="4" space={3}>
          <Text fontWeight="400" fontSize="md">
            {item.content}
          </Text>
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center"></HStack>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}

function AddMoment(props: any): JSX.Element {
  const {info, getMoments} = props;
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState<any>();
  const [moment, setMoment] = useState<any>();

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
      data.append('photo', {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
      });
    }

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    // console.log(' Platform.OS', Platform.OS);

    console.log(data);

    return data;
  };

  const addMoment = async () => {
    console.log('moment', moment);
    try {
      await request({
        url: '/moment/create',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: info.token,
        },
        data: createFormData({...moment, createTime: new Date().toJSON()}),
      });
      setPhoto(null);
      getMoments();
    } catch (e) {}

    setShowModal(false);
  };

  return (
    <Center>
      <IconButton
        colorScheme="indigo"
        icon={<AddIcon />}
        onPress={() => setShowModal(true)}
      />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} w="100%">
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Add a Moment</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Title</FormControl.Label>
              <Input
                onChangeText={value =>
                  setMoment({
                    ...moment,
                    title: value,
                  })
                }
              />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Content</FormControl.Label>
              <Input
                onChangeText={value =>
                  setMoment({
                    ...moment,
                    content: value,
                  })
                }
              />
            </FormControl>
            <Image
              source={
                photo
                  ? {uri: photo?.uri}
                  : require('../assets/default-image.jpg')
              }
              //   source={{uri: require('../assets/default-image.jpg')}}

              //   source={require('../assets/default-image.jpg')}
              //   style={{width: 100, height: 100}}
              h="24"
              w="100%"
              mt="3"
            />
            <Button onPress={handleChoosePhoto}>choose the photo</Button>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              <Button onPress={addMoment}>Save</Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}

export default function () {
  const isFouced = useIsFocused();
  const [info, setInfo] = useState<userinfoType>();
  const [momentList, setMomentList] = useState<any[]>([]);

  const getMoments = async () => {
    try {
      const {data} = await request({
        url: '/moment/get',
        headers: {
          Authorization: info.token,
        },
      });
      console.log(data);
      if (!data) return;
      setMomentList(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!isFouced) return;

    store
      .load({
        key: 'userInfo',
      })
      .then(res => {
        console.log('storage1', res);
        setInfo(res);
      })
      .catch(e => {
        console.log('storage error', e);
      });
  }, [isFouced]);

  useEffect(() => {
    if (!isFouced || !info) return;
    getMoments();
  }, [isFouced, info]);

  return (
    <Box>
      <Stack
        h="10"
        direction="row"
        mb="2.5"
        mt="1.5"
        mr="2"
        alignItems="center"
        justifyContent="center">
        <Heading w="5/6" textAlign="center">
          Welcome to Moments !
        </Heading>
        {/* <Text> */}
        <AddMoment info={info} getMoments={getMoments} />
      </Stack>
      <ScrollView h="90%">
        {momentList.map(item => (
          <Moment item={item} key={item.id} />
        ))}
      </ScrollView>
    </Box>
  );
}
