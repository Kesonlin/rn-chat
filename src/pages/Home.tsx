import React, {useEffect, useState} from 'react';
import {
  AspectRatio,
  Box,
  Center,
  HStack,
  Heading,
  Stack,
  Text,
  Image,
  Modal,
  TextArea,
} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import store from '../store';
import {request} from '../network';
import {
  Button,
  ButtonIcon,
  ButtonText,
  EditIcon,
  Icon,
} from '@gluestack-ui/themed';

function EditElm(props: any): JSX.Element {
  const {info, setInfo} = props;
  const [showModal, setShowModal] = useState(false);
  const [recentText, setRecentText] = useState();
  useState(() => {
    setRecentText(info?.recentText);
  }, [info]);

  const updateRecentText = async () => {
    try {
      const {data} = await request({
        url: '/user/update',
        method: 'post',
        data: {
          recentText,
        },
        headers: {
          Authorization: info.token,
        },
      });
      console.log(data);
      await store.remove({
        key: 'userInfo',
      });
      await store.save({
        key: 'userInfo',
        data: {
          ...info,
          recentText: data.data.recentText,
        },
      });
      setInfo({
        ...info,
        recentText,
      });
      setShowModal(false);
      if (data.success) {
      }
    } catch (e) {
      console.log(e);

      setShowModal(false);
    }
  };

  return (
    <Center>
      <Button onPress={() => setShowModal(true)}>
        <ButtonIcon as={EditIcon} mr="$2" />
        <ButtonText>
          <Text>Edit</Text>
        </ButtonText>
      </Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>
            <Text>Edit you sign</Text>
          </Modal.Header>
          <Modal.Body>
            <TextArea
              shadow={2}
              h="100"
              placeholder="please chang you sign"
              w="100%"
              value={recentText}
              onChangeText={value => setRecentText(value)}
              _light={{
                placeholderTextColor: 'trueGray.700',
                bg: 'coolGray.100',
                _hover: {
                  bg: 'coolGray.200',
                },
                _focus: {
                  bg: 'coolGray.200:alpha.70',
                },
              }}
              _dark={{
                bg: 'coolGray.800',
                _hover: {
                  bg: 'coolGray.900',
                },
                _focus: {
                  bg: 'coolGray.900:alpha.70',
                },
              }}
              autoCompleteType={{}}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                <Text>Cancel</Text>
              </Button>
              <Button onPress={updateRecentText}>
                <Text>Save</Text>
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}

export default function (props: any) {
  const {navigation} = props;
  const isFouced = useIsFocused();
  const [info, setInfo] = useState<userinfoType>();
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
        navigation.navigate('login');
      });
  }, [isFouced, navigation]);
  return (
    <Box alignItems="center" marginTop="24">
      <Box
        maxW="80"
        rounded="lg"
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
        <Box>
          <AspectRatio w="100%" ratio={16 / 9}>
            <Image
              source={{
                uri: info?.avatar,
              }}
              alt="image"
            />
          </AspectRatio>
          <Center
            bg="violet.500"
            _dark={{
              bg: 'violet.400',
            }}
            _text={{
              color: 'warmGray.50',
              fontWeight: '700',
              fontSize: 'xs',
            }}
            position="absolute"
            bottom="0"
            px="3"
            py="1.5">
            AVATAR
          </Center>
        </Box>
        <Stack p="4" space={3}>
          <Stack space={2}>
            <Heading size="md" ml="-1">
              {info?.userName}
            </Heading>
            <Text
              fontSize="xs"
              _light={{
                color: 'violet.500',
              }}
              _dark={{
                color: 'violet.400',
              }}
              fontWeight="500"
              ml="-0.5"
              mt="-1">
              {info?.createTime}
            </Text>
          </Stack>
          <Text fontWeight="400">{info?.recentText}</Text>
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              <EditElm info={info} setInfo={setInfo} />
            </HStack>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}
