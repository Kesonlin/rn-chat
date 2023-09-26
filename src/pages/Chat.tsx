import React, {useEffect} from 'react';
import {Text} from 'native-base';

interface IProps {
  route: any;
  navigation: any;
}
export default function (props: IProps) {
  const {navigation, route} = props;
  console.log('route', route);
  useEffect(() => {});
  return <Text>{route.params.frends}</Text>;
}
