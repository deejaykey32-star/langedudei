package pl.langedudei.app.widget;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.SystemClock;

public class KurakWidgetAlarm {
    public static final String ACTION_ROTATE = "pl.langedudei.app.ACTION_WIDGET_ROTATE";
    // Rotacja co 5 minut (300 000 ms)
    public static final long ROTATION_INTERVAL_MS = 5 * 60 * 1000L;
    private static final int ALARM_REQUEST_CODE = 9081;

    public static void scheduleNext(Context context) {
        if (context == null) return;
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        Intent intent = new Intent(context, KurakWidgetProvider.class);
        intent.setAction(ACTION_ROTATE);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pi = PendingIntent.getBroadcast(context, ALARM_REQUEST_CODE, intent, flags);
        long triggerAt = SystemClock.elapsedRealtime() + ROTATION_INTERVAL_MS;

        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                am.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME, triggerAt, pi);
            } else {
                am.set(AlarmManager.ELAPSED_REALTIME, triggerAt, pi);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void cancel(Context context) {
        if (context == null) return;
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        Intent intent = new Intent(context, KurakWidgetProvider.class);
        intent.setAction(ACTION_ROTATE);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent pi = PendingIntent.getBroadcast(context, ALARM_REQUEST_CODE, intent, flags);
        try {
            am.cancel(pi);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
