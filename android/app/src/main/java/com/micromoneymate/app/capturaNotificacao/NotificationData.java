package com.micromoneymate.app.capturaNotificacao;

import android.os.Bundle;
import com.getcapacitor.JSObject;

public class NotificationData {
    public String id;
    public String packageName;
    public String title;
    public String text;
    public String subText;
    public long timestamp;
    public boolean isNew;
    public Bundle extras;

    public NotificationData(String id, String packageName, String title, String text, String subText, long timestamp, boolean isNew, Bundle extras) {
        this.id = id;
        this.packageName = packageName;
        this.title = title;
        this.text = text;
        this.subText = subText;
        this.timestamp = timestamp;
        this.isNew = isNew;
        this.extras = extras;
    }

    public JSObject toJSObject() {
        JSObject obj = new JSObject();
        obj.put("id", id);
        obj.put("packageName", packageName);
        obj.put("title", title);
        obj.put("text", text);
        obj.put("subText", subText);
        obj.put("timestamp", timestamp);
        obj.put("isNew", isNew);
        obj.put("extras", extras != null ? extras.toString() : null);
        return obj;
    }
}
