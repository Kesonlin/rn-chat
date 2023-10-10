import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Avatar,
  Button,
  Input,
  ScrollView,
  Text,
  TextArea,
  View,
} from 'native-base';
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
        }}
      />
      <View
        bgColor="pink.300"
        style={{
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
        }}
      />
      <View
        bgColor="teal.300"
        style={{
          padding: 10,
          borderRadius: 8,
          maxWidth: 200,
          marginLeft: 10,
        }}>
        <Text style={{color: 'white'}}>{content}</Text>
      </View>
    </View>
  );
}

function Message(props: any): JSX.Element {
  const {list = [], user, to, scrollRef} = props;
  // const scrollRef = useRef<any>();

  return (
    <ScrollView h="5/6" bgColor="primary.400" paddingTop="6" ref={scrollRef}>
      {list.map((v: MessageType) =>
        v.sender === user.userName ? (
          <Mine content={v.message} user={user} key={v.id} />
        ) : (
          <You content={v.message} user={to} key={v.id} />
        ),
      )}
    </ScrollView>
  );
}

export default function (props: IProps) {
  const {navigation, route} = props;
  const [info, setInfo] = useState<userinfoType>();
  const [list, setList] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState('');
  const isFouced = useIsFocused();
  const infoRef = useRef(info);
  const socketRef = useRef<any>();
  const scrollRef = useRef<any>();
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
    const instance = io('http://10.0.2.2:3000');
    socketRef.current = instance;
    socketRef.current.emit('connection', async () => {
      console.log('connect success');
      // await socket.join(from);
    });
    socketRef.current.on('join', (cb: () => void) => {
      // console.log('socket', cb);
      cb();
      // await socket.join(from);
    });

    socketRef.current.on('showMessage', () => {
      // console.log('receive message');

      getMsgs(infoRef.current);
    });

    socketRef.current.on('disconnect', (reason: string) => {
      console.log('socket is disconnect', reason);
    });
    return () => {
      socketRef.current.close();
      console.log('the page is close');
      socketRef.current.disconnect();
    };
  }, [getMsgs]);

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

  useEffect(() => {
    scrollRef.current?.scrollToEnd();
  }, [list]);

  const send = () => {
    // console.log(
    //   'message:',
    //   textAreaValue,
    //   'from',
    //   info,
    //   'to:',
    //   route.params.frends,
    // );

    socketRef.current.emit('sendMessage', {
      sender: info?.userName,
      receiver: route.params.frends.userName,
      time: new Date().toJSON(),
      message: textAreaValue,
    });
    setTimeout(() => {
      // getMsgs();
      // console.log('scrollRef', scrollRef);
      setTextAreaValue('');
    }, 100);
  };

  return (
    <View style={{backgroundColor: 'yellow'}}>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
      <Message
        list={list}
        user={info}
        to={route?.params?.frends}
        scrollRef={scrollRef}
      />
      {/* </SafeAreaView> */}

      <TextArea
        shadow={2}
        h={20}
        autoCompleteType={{}}
        // placeholder="Text Area Placeholder"
        value={textAreaValue}
        onChangeText={text => setTextAreaValue(text)}
        w="100%"
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
      <Button onPress={send} bgColor="violet.300">
        <Text>send</Text>
      </Button>
    </View>
  );
}
