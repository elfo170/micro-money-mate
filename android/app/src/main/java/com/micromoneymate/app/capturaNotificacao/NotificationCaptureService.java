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
        Intent intent = new Intent("com.micromoneymate.app.NOTIFICATION_CAPTURED");
        intent.putExtra("id", data.id);
        intent.putExtra("packageName", data.packageName);
        intent.putExtra("title", data.title);
        intent.putExtra("text", data.text);
        intent.putExtra("subText", data.subText);
        intent.putExtra("timestamp", data.timestamp);
        intent.putExtra("isNew", data.isNew);
        intent.putExtra("extras", data.extras != null ? data.extras.toString() : null);
        sendBroadcast(intent);
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        // Opcional: implementar se quiser capturar remoção
    }
}
