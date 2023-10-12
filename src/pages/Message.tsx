import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Box,
  FlatList,
  HStack,
  Avatar,
  VStack,
  Spacer,
  IconButton,
} from 'native-base';
import store from '../store';
import {useIsFocused} from '@react-navigation/native';
import {request} from '../network';
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SearchIcon,
} from '@gluestack-ui/themed';

export default function Message(props: any): JSX.Element {
  const {navigation} = props;
  const isFouced = useIsFocused();
  const [originList, setOriginList] = useState<userinfoType[]>([]);
  const [list, setList] = useState<userinfoType[]>([]);

  useEffect(() => {
    if (!isFouced) return;

    store
      .load({
        key: 'userInfo',
      })
      .then(res => {
        console.log('message info', res);
        // setInfo(res);
        // navigation.navigate('login');
      })
      .catch(e => {
        console.log('storage error', e);
        navigation.navigate('login');
      });
  }, [navigation, isFouced]);

  useEffect(() => {
    if (!isFouced) return;

    request({
      url: '/user/all',
    }).then(({data}) => {
      // console.log(data);
      setOriginList(data);
      setList(data);
    });
  }, [isFouced]);

  const searchList = (key: string) => {
    key = key.trim();
    const filterList = originList.filter(item => item.userName?.includes(key));
    setList(filterList);
  };

  return (
    <Box>
      <Input>
        <InputSlot pl="$3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField placeholder="Search..." onChangeText={searchList} />
      </Input>
      <FlatList
        data={list}
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
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}>
                  {item.recentText}
                </Text>
              </VStack>
              <Spacer />
              <Text
                fontSize="xs"
                _dark={{
                  color: 'warmGray.50',
                }}
                color="coolGray.800"
                alignSelf="flex-start">
                {item.createTime}
              </Text>
            </HStack>
          </View>
        )}
        keyExtractor={item => item?.id!}
      />
    </Box>
  );
}
