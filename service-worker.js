// ===== KOHS立方体テスト - サービスワーカー =====
// キャッシュの名前。ファイルを更新したときは、この末尾の数字(v1)を
// v2, v3 ... のように増やすと、古いキャッシュが破棄されて
// 新しい内容が反映されます。
const CACHE_NAME = 'kohs-cache-v1';

// オフラインでも使えるように保存しておくファイル一覧
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

// インストール時：必要なファイルをまとめてキャッシュに保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 有効化時：古いバージョンのキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ファイル取得時：キャッシュにあればそれを返し、なければネットから取得
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
