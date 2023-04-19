import { useEffect } from 'react';
import {  Text, View, Button } from 'react-native';
import notifee, { EventType, TimestampTrigger, TriggerType} from '@notifee/react-native';

import { styles } from './styles';

export default function App() {


  async function createChannelId(){
    const channalId = await notifee.createChannel({
      id: 'test',
      name: 'sales',
      vibration: true,    
    });
    return channalId
  }

  async function updateNotification(){
    await notifee.requestPermission();

    const channalId = await createChannelId()

    await notifee.displayNotification({
      id: '7',
      title: 'ola, Jeferson!',
      body: 'Essa é a minha primeira notificação.',
      ios: {
        categoryId: channalId
      }
    })
  }

  async function displayNotification(){
    await notifee.requestPermission();

    const channalId = await createChannelId()

    await notifee.displayNotification({
      id: '7',
      title: 'ola, <strong>Jeferson!</strong>',
      body: 'Essa é a minha primeira notificação.',
      ios: {
        categoryId: channalId
      }
    })
  }

  async function cancelNotification(){
    await notifee.cancelNotification('7');
  }

  async function scheduleNotification(){
    const date = new Date(Date.now());
    date.setMinutes(date.getMinutes() + 1);

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp:  date.getTime()
    }

    const channalId = await createChannelId();

    await notifee.createTriggerNotification({

      title: 'Notificação agendada',
      body: 'Essa é uma notificação agendada',
      ios: {
        categoryId: channalId,
      }
    }, trigger)
  }

  function listScheduleNotifications(){
    notifee.getTriggerNotificationIds().then(ids => console.log(ids))
  }

  useEffect(()=>{
    return notifee.onForegroundEvent(async({ type, detail })=> {
      switch(type){
        case EventType.DISMISSED:
          console.log('Usuario descartou a notificação');
          break;
        case EventType.ACTION_PRESS:
          console.log('Usuario tocou na notificação', detail.notification);
      }
    });
  },[]);

  useEffect(()=>{
    return notifee.onBackgroundEvent(async ({type, detail})=> {
      if( type === EventType.PRESS) {
        console.log('Usuario tocou na notificação', detail.notification);
      }
    });
  },[]);

  return (
    <View style={styles.container}>
      <Text>Local Notifications!</Text>
      <Button title='Enviar Notificação' onPress={displayNotification}/>
      <Button title='Atualizar Notificação' onPress={updateNotification}/>
      <Button title='Cancelar Notificação' onPress={cancelNotification}/>
      <Button title='Agendar Notificação' onPress={scheduleNotification}/>
      <Button title='Listar Notificação agendadas' onPress={listScheduleNotifications}/>

    </View>
  );
}


