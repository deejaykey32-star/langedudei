package pl.langedudei.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import pl.langedudei.app.widget.KurakWidgetPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(KurakWidgetPlugin.class);
        super.onCreate(savedInstanceState);
        handleWidgetIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleWidgetIntent(intent);
    }

    private void handleWidgetIntent(Intent intent) {
        if (intent == null) return;
        String wordId = intent.getStringExtra("extra_word_id");
        if ((wordId == null || wordId.isEmpty()) && intent.getData() != null) {
            Uri data = intent.getData();
            wordId = data.getQueryParameter("word");
        }

        if (wordId != null && !wordId.trim().isEmpty()) {
            final String targetWord = wordId.trim();
            KurakWidgetPlugin.setPendingLaunchWord(targetWord);

            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().post(() -> {
                    String js = "window.dispatchEvent(new CustomEvent('widget-practice', { detail: { wordId: '" 
                        + targetWord.replace("'", "\\'") + "' } }));";
                    getBridge().getWebView().evaluateJavascript(js, null);
                });
            }
        }
    }
}
