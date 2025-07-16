import { registerPlugin } from '@capacitor/core';
import type { CapturaNotificacaoPlugin } from './definitions';

const CapturaNotificacao = registerPlugin<CapturaNotificacaoPlugin>('CapturaNotificacao');

export * from './definitions';
export { CapturaNotificacao };
