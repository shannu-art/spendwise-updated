package com.example.spendwise;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.provider.Settings;
import android.text.TextUtils;
import android.net.Uri;
import android.os.Build;
import android.service.notification.StatusBarNotification;
import android.app.NotificationManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "UpiNotification")
public class UpiNotificationPlugin extends Plugin {
  private BroadcastReceiver receiver;

  @Override public void load() {
    receiver = new BroadcastReceiver() {
      @Override public void onReceive(Context context, Intent intent) {
        if (!"com.example.spendwise.UPI_ALERT".equals(intent.getAction())) return;
        JSObject data = new JSObject();
        data.put("packageName", intent.getStringExtra("packageName"));
        data.put("title", intent.getStringExtra("title"));
        data.put("text", intent.getStringExtra("text"));
        data.put("postedAt", intent.getLongExtra("postedAt", System.currentTimeMillis()));
        notifyListeners("transactionNotification", data, true);
      }
    };
    IntentFilter filter = new IntentFilter("com.example.spendwise.UPI_ALERT");
    if (Build.VERSION.SDK_INT >= 33) getContext().registerReceiver(receiver, filter, Context.RECEIVER_NOT_EXPORTED);
    else getContext().registerReceiver(receiver, filter);
  }

  @PluginMethod public void openNotificationSettings(PluginCall call) {
    Intent i = new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);
    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    getContext().startActivity(i);
    call.resolve();
  }

  @PluginMethod public void getStatus(PluginCall call) {
    String enabled = Settings.Secure.getString(getContext().getContentResolver(), "enabled_notification_listeners");
    boolean granted = enabled != null && enabled.contains(getContext().getPackageName());
    JSObject ret = new JSObject(); ret.put("granted", granted); call.resolve(ret);
  }

  @Override protected void handleOnDestroy() {
    if (receiver != null) { try { getContext().unregisterReceiver(receiver); } catch (Exception ignored) {} }
    super.handleOnDestroy();
  }
}
