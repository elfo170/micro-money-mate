export interface NotificationData {
  id: string;
  packageName: string;
  title: string;
  text: string;
  subText?: string;
  timestamp: number;
  isNew: boolean;
  extras: any;
}

export interface CapturaNotificacaoPlugin {
  startCapture(): Promise<{ success: boolean }>;
  addListener(
    eventName: 'notificationReceived',
    listenerFunc: (notification: NotificationData) => void
  ): Promise<{ remove: () => void }>;
}
