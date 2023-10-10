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
} from 'native-base';
import {useIsFocused} from '@react-navigation/native';
import store from '../store';

export default function (props: any) {
  const {navigation} = props;
  const isFouced = useIsFocused();
  const [info, setInfo] = useState<userinfoType>();
  useEffect(() => {
    if (!isFouced) return;
    console.log('加载1');

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
    <Box alignItems="center">
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
            PHOTOS
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
          <Text fontWeight="400">
            Bengaluru (also called Bangalore) is the center of India's high-tech
            industry. The city is also known for its parks and nightlife.
          </Text>
          <HStack alignItems="center" space={4} justifyContent="space-between">
            <HStack alignItems="center">
              <Text
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
                fontWeight="400">
                6 mins ago
              </Text>
            </HStack>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
}
