package com.micromoneymate.app.capturaNotificacao;

import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.RequiresApi;

public class NotificationCaptureService extends NotificationListenerService {
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        if (!"br.com.xp.carteira".equals(sbn.getPackageName())) return;
        Bundle extras = sbn.getNotification().extras;
        NotificationData data = new NotificationData(
            sbn.getKey(),
            sbn.getPackageName(),
            extras.getString("android.title", ""),
            extras.getString("android.text", ""),
            extras.getString("android.subText", null),
            sbn.getPostTime(),
            sbn.isOngoing(),
            extras
        );
        capturaNotificacao_Plugin plugin = (capturaNotificacao_Plugin) getApplication();
        if (plugin != null) {
            plugin.sendNotificationToJS(data);
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // Opcional: implementar se quiser capturar remoção
    }
}
