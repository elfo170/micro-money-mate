package com.micromoneymate.app.capturaNotificacao;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.IntentFilter;
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

@CapacitorPlugin(name = "CapturaNotificacao")
public class capturaNotificacao_Plugin extends Plugin {
    private final BroadcastReceiver notificationReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            JSObject jsObj = new JSObject();
            jsObj.put("id", intent.getStringExtra("id"));
            jsObj.put("packageName", intent.getStringExtra("packageName"));
            jsObj.put("title", intent.getStringExtra("title"));
            jsObj.put("text", intent.getStringExtra("text"));
            jsObj.put("subText", intent.getStringExtra("subText"));
            jsObj.put("timestamp", intent.getLongExtra("timestamp", 0));
            jsObj.put("isNew", intent.getBooleanExtra("isNew", false));
            jsObj.put("extras", intent.getStringExtra("extras"));
            notifyListeners("notificationReceived", jsObj);
        }
    };

    @Override
    public void load() {
        super.load();
        IntentFilter filter = new IntentFilter("com.micromoneymate.app.NOTIFICATION_CAPTURED");
        getContext().registerReceiver(notificationReceiver, filter);
    }

    @Override
    protected void handleOnDestroy() {
        getContext().unregisterReceiver(notificationReceiver);
        super.handleOnDestroy();
    }

    @PluginMethod
    public void startCapture(PluginCall call) {
        Intent serviceIntent = new Intent(getContext(), NotificationCaptureService.class);
        getContext().startService(serviceIntent);
        call.resolve(new JSObject().put("success", true));
    }
}
