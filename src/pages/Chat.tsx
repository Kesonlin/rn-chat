import React, {useEffect, useState} from 'react';
import {Button, Center, Stack, Text, TextArea, VStack, View} from 'native-base';
import {io} from 'socket.io-client';
import store from '../store';
import {request} from '../network';
import {useIsFocused} from '@react-navigation/native';

interface IProps {
  route: any;
  navigation: any;
}

interface MessageType {
  sender: string;
  receiver: string;
  message: string;
  time: Date;
}

function Message(props: any): JSX.Element {
  const {list = [], user} = props;
  <VStack space={4} alignItems="center">
    <Center w="64" h="20" bg="indigo.300" rounded="md" shadow={3} />
    <Center w="64" h="20" bg="indigo.500" rounded="md" shadow={3} />
    <Center w="64" h="20" bg="indigo.700" rounded="md" shadow={3} />
  </VStack>;

  return (
    <Stack mb="2.5" mt="1.5" direction="column" space={3}>
      {list.map((v: MessageType) => (
        <View>
          <Center
            maxW="2xs"
            bg="primary.300"
            rounded="md"
            shadow={3}
            // style={{float: 'right'}}
          >
            <Text fontSize="xl">
              msg: {v.message} from: {v.sender} to: {v.receiver}
            </Text>
          </Center>
        </View>
      ))}
    </Stack>
  );
}

export default function (props: IProps) {
  const {navigation, route} = props;
  const [info, setInfo] = useState({});
  const [socket, setSosket] = useState<any>('');
  const [list, setList] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState('');
  const isFouced = useIsFocused();
  console.log('route', route);
  useEffect(() => {
    store
      .load({
        key: 'userInfo',
      })
      .then(res => {
        // console.log('storage1', res);
        setInfo(res.data[0]);
      })
      .catch(e => {
        console.log('storage error', e);
        navigation.navigate('login');
      });
  }, [navigation]);

  useEffect(() => {
    setSosket(io('http://10.0.2.2:3000'));
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('connection', async socket => {
      console.log('connect success');
      // await socket.join(from);
    });
    socket.on('join', cb => {
      // console.log('socket', cb);
      cb();
      // await socket.join(from);
    });

    socket.on('showMessage', getMsgs);
  }, [socket]);

  useEffect(() => {
    if (!isFouced) return;
    getMsgs();
  }, [isFouced]);

  const getMsgs = async () => {
    const {data} = await request({
      url: '/message/all',
      method: 'post',
      data: {
        from: info?.userName,
        to: route.params.frends,
      },
    });
    setList(data.data.list);
  };

  const send = () => {
    console.log(
      'message:',
      textAreaValue,
      'from',
      info,
      'to:',
      route.params.frends,
    );
    socket.emit('sendMessage', {
      sender: info?.userName,
      receiver: route.params.frends,
      time: new Date().toJSON(),
      message: textAreaValue,
    });
  };

  return (
    <View>
      <Message list={list} user={info} />
      <TextArea
        shadow={2}
        h={20}
        // placeholder="Text Area Placeholder"
        value={textAreaValue}
        onChangeText={text => setTextAreaValue(text)}
        w="200"
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
      />
      <Button onPress={send}>
        <Text>send</Text>
      </Button>
    </View>
  );
}
