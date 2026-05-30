const appVersion =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_APP_VERSION ||
  "lmo-quran-20260526-cache-v2";

function buildRecoveryScript(version: string) {
  return `
(function () {
  var version = ${JSON.stringify(version)};
  var versionKey = "lmo-quran-version";
  var reloadKey = "lmo-quran-cache-reload-" + version;

  function clearCaches() {
    var tasks = [];
    if ("caches" in window) {
      tasks.push(caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (key) { return caches.delete(key); }));
      }).catch(function () {}));
    }
    if ("serviceWorker" in navigator) {
      tasks.push(navigator.serviceWorker.getRegistrations().then(function (registrations) {
        return Promise.all(registrations.map(function (registration) {
          return registration.update().catch(function () {});
        }));
      }).catch(function () {}));
    }
    return Promise.all(tasks);
  }

  function recover() {
    if (sessionStorage.getItem(reloadKey)) return;
    sessionStorage.setItem(reloadKey, "1");
    clearCaches().finally(function () {
      localStorage.setItem(versionKey, version);
      window.location.reload();
    });
  }

  try {
    var previousVersion = localStorage.getItem(versionKey);
    if (previousVersion && previousVersion !== version) {
      recover();
    } else {
      localStorage.setItem(versionKey, version);
    }
  } catch (error) {}

  function shouldRecover(message) {
    return /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module|Invalid or unexpected token|Minified React error|Application error/i.test(message || "");
  }

  window.addEventListener("error", function (event) {
    var message = event && (event.message || (event.error && event.error.message));
    if (shouldRecover(message)) recover();
  });

  window.addEventListener("unhandledrejection", function (event) {
    var reason = event && event.reason;
    var message = typeof reason === "string" ? reason : reason && (reason.message || reason.toString && reason.toString());
    if (shouldRecover(message)) recover();
  });
})();`;
}

export default function CacheRecoveryScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: buildRecoveryScript(appVersion),
      }}
    />
  );
}
