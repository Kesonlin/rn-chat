import React, {useState} from 'react';
import {
  AddIcon,
  AspectRatio,
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Modal,
  Popover,
  ScrollView,
  Spacer,
  Stack,
  Text,
  VStack,
} from 'native-base';
import {launchImageLibrary} from 'react-native-image-picker';
// const defaultPhoto = require('../assets/default-image.jpg');
import defaultPhoto from '../assets/default-image.jpg';
function Moment(): JSX.Element {
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
              uri: 'http://10.0.2.2:3000//henry1000000042.jpg',
            }}
          />
          <VStack>
            <Text
              _dark={{
                color: 'warmGray.50',
              }}
              color="coolGray.800"
              bold>
              {1111}
            </Text>
            <Text
              color="coolGray.600"
              _dark={{
                color: 'warmGray.200',
              }}>
              {2222}
            </Text>
          </VStack>
          <Spacer />
          {/* <Text
          fontSize="xs"
          _dark={{
            color: 'warmGray.50',
          }}
          color="coolGray.800"
          alignSelf="flex-start">
          {'createTime'}
        </Text> */}
        </HStack>
        <Box>
          <Stack space={3}>
            <Heading size="md" ml="3" mt="2" mb="2">
              The Garden City
            </Heading>
            {/* <Text
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
              The Silicon Valley of India.
            </Text> */}
          </Stack>
          <AspectRatio w="100%" ratio={16 / 9}>
            <Image
              source={{
                uri: 'https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg',
              }}
              alt="image"
            />
          </AspectRatio>
          {/* <Center
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
            PHOTOS
          </Center> */}
        </Box>
        <Stack p="4" space={3}>
          <Text fontWeight="400" fontSize="md">
            Bengaluru (also called Bangalore) is the center of India's high-tech
            industry. The city is also known for its parks and nightlife.
          </Text>
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              {/* <Text
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="400">
                6 mins ago
              </Text> */}
            </HStack>
          </HStack>
        </Stack>
      </Box>
      {/* <Divider
        my="2"
        h="2"
        _light={{
          bg: '#ccc',
        }}
        _dark={{
          bg: 'muted.50',
        }}
      /> */}
    </Box>
  );
}

function AddMoment(): JSX.Element {
  //   const defaultPhoto = require('../assets/default-image.jpg');

  const [showModal, setShowModal] = useState(false);
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
  console.log('defaultPhoto', defaultPhoto);

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
              <Input />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Content</FormControl.Label>
              <Input />
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
              <Button
                onPress={() => {
                  setShowModal(false);
                }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Center>
  );
}

export default function () {
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
        <AddMoment />
      </Stack>
      <ScrollView h="90%">
        <Moment />
        <Moment />
      </ScrollView>
    </Box>
  );
}
