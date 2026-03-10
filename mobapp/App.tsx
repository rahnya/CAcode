import React, { useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { handleBridgeMessage } from './bridge/handleMessage';
import { getDatabase } from './db/database';

// In production, load from bundled asset. In dev, load from webpack-dev-server.
const DEV_URL = 'http://10.0.2.2:3000'; // Android emulator → host machine
const PROD_URL = Platform.select({
  android: 'file:///android_asset/webapp/index.html',
  ios: './webapp/index.html',
  default: DEV_URL,
});

const WEBAPP_URL = __DEV__ ? DEV_URL : PROD_URL;

export default function App() {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    // Initialize database on app start
    getDatabase();
  }, []);

  const onMessage = async (event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      const result = await handleBridgeMessage(message);

      const js = `
        window.__bridge_resolve('${message.id}', ${JSON.stringify(result)});
        true;
      `;
      webViewRef.current?.injectJavaScript(js);
    } catch (error) {
      console.error('Bridge message error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        ref={webViewRef}
        source={{ uri: WEBAPP_URL }}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        allowFileAccess
        originWhitelist={['*']}
        style={styles.webview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});
