import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Box,
  Heading,
  FlatList,
  HStack,
  Avatar,
  VStack,
  Spacer,
} from 'native-base';
import store from '../store';
import {useIsFocused} from '@react-navigation/native';
import {request} from '../network';

export default function Message(props: any): JSX.Element {
  const {navigation} = props;
  const isFouced = useIsFocused();
  const [info, setInfo] = useState([]);
  useEffect(() => {
    if (!isFouced) return;

    store
      .load({
        key: 'userInfo',
      })
      .then(_ => {
        // console.log('storage1', res);
        // setInfo(res);
        // navigation.navigate('login');
      })
      .catch(e => {
        console.log('storage error', e);
        navigation.navigate('login');
      });
  }, [navigation, isFouced]);

  useEffect(() => {
    // if (!isFouced) return;

    request({
      url: '/user/all',
    }).then(({data}) => {
      // console.log(data);
      setInfo(data);
    });
  }, [isFouced]);

  return (
    <Box>
      <Heading fontSize="xl" p="4" pb="3">
        Inbox
      </Heading>
      <FlatList
        data={info}
        renderItem={({item}: {item: userinfoType}) => (
          <View
            borderBottomWidth="1"
            _dark={{
              borderColor: 'muted.50',
            }}
            borderColor="muted.800"
            pl={['0', '4']}
            pr={['0', '5']}
            py="2"
            onTouchEnd={() => {
              console.log('chat');

              navigation.navigate('chat', {frends: item});
            }}>
            <HStack space={[2, 3]} justifyContent="space-between">
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
                {/* <Text
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}>
                  {item.recentText}
                </Text> */}
              </VStack>
              <Spacer />
              {/* <Text
                fontSize="xs"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800"
                alignSelf="flex-start">
                {item.timeStamp}
              </Text> */}
            </HStack>
          </View>
        )}
        keyExtractor={item => item?.id!}
      />
    </Box>
  );
}
