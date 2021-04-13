import React from 'react';
import { VERSION, Actions } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import reducers, { namespace } from './states';
import DispositionDialog from './components/CallDisposition/DispositionDialog';

const PLUGIN_NAME = 'CallDispositionPlugin';

export default class CallDispositionPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    flex.AgentDesktopView.Panel1.Content.add(<DispositionDialog
      key="disposition-modal"
    />, { sortOrder: 100 });


    manager.workerClient.on("reservationCreated", reservation => {
      console.log('reservationCreated: ', reservation);
      //const isVoiceQueue = reservation.task.taskChannelUniqueName === 'voice';
      const isInboundTask = reservation.task.attributes.direction === 'inbound';
      //Register listener for reservation wrapup event
      //if (isVoiceQueue) {
        reservation.on('wrapup', reservation => {
          Actions.invokeAction('SetComponentState', {
            name: 'DispositionDialog',
            state: { isOpen: true }
          });
        });
      //}
    });




  }


  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}
