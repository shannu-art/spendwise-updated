package com.example.spendwise;

import android.app.Notification;
import android.content.Intent;
import android.os.Bundle;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.text.TextUtils;
import java.util.Locale;

/** Prototype listener: forwards only notifications from known payment apps.
 * Do not treat parsed notifications as bank-confirmed transactions. */
public class UpiNotificationListenerService extends NotificationListenerService {
  private static final String[] PAYMENT_PACKAGES = {
    "com.google.android.apps.nbu.paisa.user", // Google Pay (package may vary by build/region)
    "com.phonepe.app",
    "net.one97.paytm"
  };

  @Override public void onNotificationPosted(StatusBarNotification sbn) {
    if (sbn == null || sbn.getPackageName() == null) return;
    boolean match = false;
    for (String p : PAYMENT_PACKAGES) if (p.equals(sbn.getPackageName())) { match = true; break; }
    if (!match) return;
    Notification n = sbn.getNotification(); if (n == null || n.extras == null) return;
    Bundle e = n.extras;
    CharSequence title = e.getCharSequence(Notification.EXTRA_TITLE);
    CharSequence text = e.getCharSequence(Notification.EXTRA_BIG_TEXT);
    if (TextUtils.isEmpty(text)) text = e.getCharSequence(Notification.EXTRA_TEXT);
    if (TextUtils.isEmpty(title) && TextUtils.isEmpty(text)) return;
    String combined = ((title == null ? "" : title.toString()) + " " + (text == null ? "" : text.toString())).trim();
    // Avoid forwarding unrelated app notifications; still review parsed values in the app.
    String low = combined.toLowerCase(Locale.ROOT);
    if (!(low.contains("paid") || low.contains("received") || low.contains("sent") || low.contains("debited") || low.contains("credited") || low.contains("₹") || low.contains("inr"))) return;
    Intent out = new Intent("com.example.spendwise.UPI_ALERT");
    out.setPackage(getPackageName());
    out.putExtra("packageName", sbn.getPackageName());
    out.putExtra("title", title == null ? "" : title.toString());
    out.putExtra("text", text == null ? "" : text.toString());
    out.putExtra("postedAt", sbn.getPostTime());
    sendBroadcast(out);
  }
}
