package com.micromoneymate.app.capturaNotificacao;

import android.content.Intent;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.os.Build;
import android.os.Bundle;
import androidx.annotation.RequiresApi;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.PluginEventListener;

@CapacitorPlugin(name = "CapturaNotificacao")
public class capturaNotificacao_Plugin extends Plugin {
    private NotificationCaptureService notificationService;

    @PluginMethod
    public void startCapture(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), NotificationCaptureService.class);
        getContext().startService(serviceIntent);
        call.resolve(new JSObject().put("success", true));
    }

    // Método para enviar notificação para JS
    public void sendNotificationToJS(NotificationData data) {
        JSObject jsObj = data.toJSObject();
        notifyListeners("notificationReceived", jsObj);
    }
}
