package pl.langedudei.app.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.widget.RemoteViews;
import java.net.URLEncoder;
import pl.langedudei.app.MainActivity;
import pl.langedudei.app.R;

public class KurakWidgetProvider extends AppWidgetProvider {
    public static final String ACTION_NEXT = "pl.langedudei.app.ACTION_WIDGET_NEXT";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        KurakWidgetStorage.Item item = KurakWidgetStorage.getCurrentItem(context);
        for (int appWidgetId : appWidgetIds) {
            updateWidgetView(context, appWidgetManager, appWidgetId, item);
        }
        KurakWidgetAlarm.scheduleNext(context);
    }

    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        KurakWidgetAlarm.scheduleNext(context);
    }

    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
        KurakWidgetAlarm.cancel(context);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent != null ? intent.getAction() : null;
        if (action == null) return;

        if (KurakWidgetAlarm.ACTION_ROTATE.equals(action)) {
            KurakWidgetStorage.advanceNext(context);
            updateAllWidgets(context);
            KurakWidgetAlarm.scheduleNext(context);
        } else if (ACTION_NEXT.equals(action)) {
            KurakWidgetStorage.advanceNext(context);
            updateAllWidgets(context);
        } else if (Intent.ACTION_BOOT_COMPLETED.equals(action)) {
            KurakWidgetAlarm.scheduleNext(context);
        }
    }

    public static void updateAllWidgets(Context context) {
        if (context == null) return;
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName cn = new ComponentName(context, KurakWidgetProvider.class);
        int[] appWidgetIds = manager.getAppWidgetIds(cn);
        if (appWidgetIds == null || appWidgetIds.length == 0) return;

        KurakWidgetStorage.Item item = KurakWidgetStorage.getCurrentItem(context);
        for (int id : appWidgetIds) {
            updateWidgetView(context, manager, id, item);
        }
    }

    private static void updateWidgetView(Context context, AppWidgetManager appWidgetManager, int appWidgetId, KurakWidgetStorage.Item item) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_kurak_layout);

        // Treść powtórki
        views.setTextViewText(R.id.widget_text_en, item.en);
        views.setTextViewText(R.id.widget_text_pl, item.pl);
        views.setTextViewText(R.id.widget_text_example, item.example != null && !item.example.isEmpty() ? item.example : "Powtórz na głos z Kurakiem.");
        views.setTextViewText(R.id.widget_emoji, item.emoji);
        views.setTextViewText(R.id.widget_badge, item.badge);

        // Przycisk "Następne 🔁"
        Intent nextIntent = new Intent(context, KurakWidgetProvider.class);
        nextIntent.setAction(ACTION_NEXT);
        nextIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);

        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }

        PendingIntent nextPendingIntent = PendingIntent.getBroadcast(
            context,
            appWidgetId * 100 + 1,
            nextIntent,
            flags
        );
        views.setOnClickPendingIntent(R.id.widget_btn_next, nextPendingIntent);

        // Deep link do ćwiczeń utrwalających ("Ćwicz z Kurakiem 🎯" lub kliknięcie w kartę)
        try {
            String encodedId = URLEncoder.encode(item.id != null ? item.id : item.en, "UTF-8");
            Intent practiceIntent = new Intent(context, MainActivity.class);
            practiceIntent.setAction(Intent.ACTION_VIEW);
            practiceIntent.putExtra("extra_action", "practice");
            practiceIntent.putExtra("extra_word_id", item.id);
            practiceIntent.putExtra("extra_word_en", item.en);
            practiceIntent.putExtra("extra_word_pl", item.pl);
            practiceIntent.putExtra("extra_word_emoji", item.emoji);
            practiceIntent.putExtra("extra_route", "#/review?word=" + encodedId);
            practiceIntent.setData(Uri.parse("langedudei://review?word=" + encodedId));
            practiceIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);

            PendingIntent practicePendingIntent = PendingIntent.getActivity(
                context,
                appWidgetId * 100 + 2,
                practiceIntent,
                flags
            );

            views.setOnClickPendingIntent(R.id.widget_btn_practice, practicePendingIntent);
            views.setOnClickPendingIntent(R.id.widget_content_container, practicePendingIntent);
            views.setOnClickPendingIntent(R.id.widget_kurak_avatar, practicePendingIntent);
        } catch (Exception e) {
            e.printStackTrace();
        }

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
