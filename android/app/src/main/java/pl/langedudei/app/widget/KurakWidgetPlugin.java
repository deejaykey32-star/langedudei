package pl.langedudei.app.widget;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "KurakWidget")
public class KurakWidgetPlugin extends Plugin {

    private static String pendingWordId = null;

    public static synchronized void setPendingLaunchWord(String wordId) {
        pendingWordId = wordId;
    }

    public static synchronized String getAndClearPendingLaunchWord() {
        String word = pendingWordId;
        pendingWordId = null;
        return word;
    }

    @PluginMethod
    public void syncDifficultItems(PluginCall call) {
        try {
            JSArray items = call.getArray("items");
            if (items != null) {
                KurakWidgetStorage.saveItemsJson(getContext(), items.toString());
                KurakWidgetProvider.updateAllWidgets(getContext());
            }
            call.resolve();
        } catch (Exception e) {
            call.reject("Błąd synchronizacji widgetu: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getLaunchItem(PluginCall call) {
        JSObject ret = new JSObject();
        String word = getAndClearPendingLaunchWord();
        ret.put("wordId", word);
        call.resolve(ret);
    }

    @PluginMethod
    public void refreshWidget(PluginCall call) {
        KurakWidgetProvider.updateAllWidgets(getContext());
        call.resolve();
    }
}
