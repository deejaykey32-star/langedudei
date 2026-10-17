package pl.langedudei.app.widget;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.List;

public class KurakWidgetStorage {
    private static final String PREFS_NAME = "kurak_widget_prefs";
    private static final String KEY_ITEMS = "difficult_items_json";
    private static final String KEY_INDEX = "current_word_index";

    public static class Item {
        public String id;
        public String en;
        public String pl;
        public String emoji;
        public String example;
        public String badge;

        public Item(String id, String en, String pl, String emoji, String example, String badge) {
            this.id = id;
            this.en = en;
            this.pl = pl;
            this.emoji = emoji != null && !emoji.isEmpty() ? emoji : "💡";
            this.example = example != null ? example : "";
            this.badge = badge != null && !badge.isEmpty() ? badge : "❌ Do powtórki";
        }
    }

    private static final Item[] STARTER_ITEMS = new Item[] {
        new Item("C2:a blessing in disguise", "a blessing in disguise", "szczęście w nieszczęściu", "🍀", "Losing that job was a blessing in disguise.", "⚠️ Idiom C2"),
        new Item("C1:resilient", "resilient", "odporny, elastyczny (psychicznie)", "🌳", "Children are remarkably resilient after difficulties.", "❌ Trudne słowo"),
        new Item("C2:to cut corners", "to cut corners", "iść na skróty (kosztem jakości)", "✂️", "They cut corners and the project failed.", "⚠️ Idiom C2"),
        new Item("A2:missed_bus", "I missed the bus, so I took a taxi.", "Spóźniłem się na autobus, więc wziąłem taksówkę.", "🚌💨🚕", "At work, I had an important morning meeting.", "❌ Trudne zdanie"),
        new Item("C1:ambiguous", "ambiguous", "dwuznaczny, niejednoznaczny", "❓", "The ending of the film is deliberately ambiguous.", "❌ Trudne słowo"),
        new Item("C2:to bite the bullet", "to bite the bullet", "zacisnąć zęby i zrobić to", "😬", "I bit the bullet and called my client.", "⚠️ Idiom C2"),
        new Item("A1:family", "family", "rodzina", "👨‍👩‍👧‍👦", "I love spending Sunday with my family.", "🔄 Powtórka A1"),
        new Item("B1:pragmatic", "pragmatic", "pragmatyczny, praktyczny", "🛠️", "We need a pragmatic approach to this task.", "❌ Trudne słowo"),
        new Item("C2:serendipity", "serendipity", "szczęśliwy zbieg okoliczności", "✨", "We met in London by pure serendipity.", "❌ Trudne słowo"),
        new Item("C2:the tip of the iceberg", "the tip of the iceberg", "wierzchołek góry lodowej", "🧊", "These problems are just the tip of the iceberg.", "⚠️ Idiom C2")
    };

    public static synchronized void saveItemsJson(Context context, String json) {
        if (context == null) return;
        SharedPreferences sp = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        sp.edit().putString(KEY_ITEMS, json).apply();
    }

    public static synchronized List<Item> getItems(Context context) {
        List<Item> list = new ArrayList<>();
        if (context == null) {
            for (Item item : STARTER_ITEMS) list.add(item);
            return list;
        }

        SharedPreferences sp = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String raw = sp.getString(KEY_ITEMS, null);
        if (raw != null && !raw.trim().isEmpty()) {
            try {
                JSONArray arr = new JSONArray(raw);
                for (int i = 0; i < arr.length(); i++) {
                    JSONObject obj = arr.getJSONObject(i);
                    String id = obj.optString("id", "");
                    String en = obj.optString("en", "");
                    String pl = obj.optString("pl", "");
                    String emoji = obj.optString("emoji", "💡");
                    String example = obj.optString("example", "");
                    String badge = obj.optString("badge", "❌ Błędna odp.");
                    if (!en.isEmpty()) {
                        list.add(new Item(id, en, pl, emoji, example, badge));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (list.isEmpty()) {
            for (Item item : STARTER_ITEMS) list.add(item);
        }
        return list;
    }

    public static synchronized Item getCurrentItem(Context context) {
        List<Item> items = getItems(context);
        if (items.isEmpty()) return STARTER_ITEMS[0];
        SharedPreferences sp = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int idx = sp.getInt(KEY_INDEX, 0);
        if (idx < 0 || idx >= items.size()) {
            idx = 0;
            sp.edit().putInt(KEY_INDEX, 0).apply();
        }
        return items.get(idx);
    }

    public static synchronized Item advanceNext(Context context) {
        List<Item> items = getItems(context);
        if (items.isEmpty()) return STARTER_ITEMS[0];
        SharedPreferences sp = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int idx = sp.getInt(KEY_INDEX, 0);
        idx = (idx + 1) % items.size();
        sp.edit().putInt(KEY_INDEX, idx).apply();
        return items.get(idx);
    }
}
