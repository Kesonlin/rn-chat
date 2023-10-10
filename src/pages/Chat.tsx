import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Avatar, Button, Input, Text, TextArea, View} from 'native-base';
import {io} from 'socket.io-client';
import store from '../store';
import {request} from '../network';
import {useIsFocused} from '@react-navigation/native';

interface IProps {
  route: any;
  navigation: any;
}

interface MessageType {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  time: Date;
}

interface ChatType {
  user: userinfoType;
  content: string;
}

function Mine(props: ChatType): JSX.Element {
  const {content, user} = props;
  return (
    <View style={{flexDirection: 'row-reverse', marginBottom: 10}}>
      <Avatar
        bg="green.500"
        source={{
          uri: user.avatar,
        }}></Avatar>
      <View
        style={{
          backgroundColor: 'green',
          padding: 10,
          borderRadius: 8,
          maxWidth: 200,
          marginRight: 10,
        }}>
        <Text style={{color: 'white'}}>{content}</Text>
      </View>
    </View>
  );
}

function You(props: ChatType): JSX.Element {
  const {content, user} = props;
  return (
    <View style={{flexDirection: 'row', marginBottom: 10}}>
      <Avatar
        bg="green.500"
        source={{
          uri: user.avatar,
        }}></Avatar>
      <View
        style={{
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 8,
          maxWidth: 200,
        }}>
        <Text style={{color: 'white'}}>{content}</Text>
      </View>
    </View>
  );
}

function Message(props: any): JSX.Element {
  const {list = [], user, to} = props;

  return (
    <View style={{backgroundColor: 'pink', padding: 10}}>
      {list.map((v: MessageType) =>
        v.sender === user.userName ? (
          <Mine content={v.message} user={user} key={v.id} />
        ) : (
          <You content={v.message} user={to} key={v.id} />
        ),
      )}
      {/* 输入框 */}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {/* 消息输入框 */}
        <Input
          placeholder="Type a message"
          style={{flex: 1, marginRight: 10}}
        />

        {/* 发送按钮 */}
        <Button style={{backgroundColor: 'green', borderRadius: 8}}>
          <Text style={{color: 'white'}}>Send</Text>
        </Button>
      </View>
    </View>
  );
}

export default function (props: IProps) {
  const {navigation, route} = props;
  const [info, setInfo] = useState<userinfoType>();
  const [socket, setSosket] = useState<any>(null);
  const [list, setList] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState('');
  const isFouced = useIsFocused();
  const infoRef = useRef(info);
  // console.log('route', route);
  const getMsgs = useCallback(
    async (from: any, to = route?.params?.frends) => {
      from = from ? from : info;

      // console.log('info', info, 'from', from, 'to', to);
      // console.log('route.params.frends', route.params.frends);
      if (!from || !to) return;
      try {
        const {data} = await request({
          url: '/message/all',
          method: 'post',
          data: {
            from: from.userName,
            to: to.userName,
          },
        });

        setList(data.data.list);
      } catch (e) {
        console.log('eeee', e);
      }
    },
    [info, route?.params?.frends],
  );

  useEffect(() => {
    console.log('socket connect');

    setSosket(io('http://10.0.2.2:3000'));
    return () => {
      // socket?.close();
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    console.log('socket111');

    socket.emit('connection', async () => {
      console.log('connect success');
      // await socket.join(from);
    });
    socket.on('join', (cb: () => void) => {
      // console.log('socket', cb);
      cb();
      // await socket.join(from);
    });

    socket.on('showMessage', () => {
      // console.log('receive message');

      getMsgs(infoRef.current);
    });

    socket.on('disconnect', () => {
      console.log('socket is disconnect');
    });

    return () => {
      // if (!socket) return;
      console.log('the page is close');

      // socket?.close();
    };
  }, [socket, getMsgs]);

  useEffect(() => {
    if (!isFouced) {
      // socket?.close();
      return;
    }
    store
      .load({
        key: 'userInfo',
      })
      .then(res => {
        setInfo(res);
        getMsgs(res);
        infoRef.current = res;
      })
      .catch(e => {
        console.log('storage error', e);
        navigation.navigate('login');
      });
    // getMsgs();
  }, [isFouced, getMsgs, navigation]);

  // console.log('info111111111', info);

  const send = () => {
    // console.log(
    //   'message:',
    //   textAreaValue,
    //   'from',
    //   info,
    //   'to:',
    //   route.params.frends,
    // );
    // console.log(socket);

    socket.emit('sendMessage', {
      sender: info?.userName,
      receiver: route.params.frends.userName,
      time: new Date().toJSON(),
      message: textAreaValue,
    });
    setTimeout(() => {
      // getMsgs();
      setTextAreaValue('');
    }, 100);
  };

  return (
    <View style={{backgroundColor: 'yellow'}}>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <Message list={list} user={info} to={route?.params?.frends} />
      {/* </SafeAreaView> */}

      <TextArea
        shadow={2}
        h={20}
        autoCompleteType={{}}
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
