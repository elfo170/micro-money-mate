import { WebPlugin } from '@capacitor/core';
import type { CapturaNotificacaoPlugin, NotificationData } from './definitions';

export class CapturaNotificacaoWeb extends WebPlugin implements CapturaNotificacaoPlugin {
  async startCapture(): Promise<{ success: boolean }> {
    throw new Error('CapturaNotificacao não é suportado na Web.');
  }
  addListener(
    eventName: 'notificationReceived',
    listenerFunc: (notification: NotificationData) => void
  ): Promise<{ remove: () => Promise<void> }> {
    throw new Error('CapturaNotificacao não é suportado na Web.');
  }
}
