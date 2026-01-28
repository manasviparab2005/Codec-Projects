let currentTabId = null;
let startTime = Date.now();
let currentDomain = null;

const getDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
};

const updateTime = async () => {
  try {
    if (currentDomain) {
      const now = Date.now();
      const duration = now - startTime;
      startTime = now;

      const data = await chrome.storage.local.get([currentDomain, 'goals', 'notified']);
      const totalTime = (data[currentDomain] || 0) + duration;
      const goals = data.goals || {};
      const notified = data.notified || {}; // Track notified domains for the day

      await chrome.storage.local.set({ [currentDomain]: totalTime });

      // Check Goals
      // Normalize domain for check
      const normalizedDomain = currentDomain.replace(/^www\./, '');
      const limitMinutes = goals[normalizedDomain];

      if (limitMinutes) {
        const spentMinutes = totalTime / 1000 / 60;

        if (spentMinutes > limitMinutes) {
          // ALWAYS Enforce Overlay if over limit
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tabs.length > 0) {
            // Only send to the specific tab if it matches the exceeded domain
            // We are updating time for 'currentDomain', so tabs[0] is likely relevant or we check url
            const tabDomain = getDomain(tabs[0].url)?.replace(/^www\./, '');

            if (tabDomain === normalizedDomain) {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: "SHOW_WARNING",
                message: `You have exceeded your ${limitMinutes} minute limit on ${normalizedDomain}.`
              }).catch(async () => {
                // Content script likely not loaded (page not refreshed). Inject it manually.
                try {
                  await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                  });
                  // Retry message
                  chrome.tabs.sendMessage(tabs[0].id, {
                    action: "SHOW_WARNING",
                    message: `You have exceeded your ${limitMinutes} minute limit on ${normalizedDomain}.`
                  });
                } catch (err) {
                  console.error("Failed to inject script:", err);
                }
              });
            }
          }

          // ONE-TIME System Notification
          const iconUrl = chrome.runtime.getURL('icon128.png');
          if (!notified[normalizedDomain]) {
            chrome.notifications.create({
              type: 'basic',
              iconUrl: iconUrl,
              title: 'Goal Exceeded!',
              message: `You have exceeded your ${limitMinutes} minute limit on ${normalizedDomain}.`
            });

            // Mark as notified
            notified[normalizedDomain] = true;
            await chrome.storage.local.set({ notified });
          }
        }
      }

      // Also track by date for daily trends
      const today = new Date().toISOString().split('T')[0];
      const dailyKey = `daily_${today}`;
      const dailyData = await chrome.storage.local.get([dailyKey]);
      const dailyStats = dailyData[dailyKey] || {};
      dailyStats[currentDomain] = (dailyStats[currentDomain] || 0) + duration;
      await chrome.storage.local.set({ [dailyKey]: dailyStats });
    }
  } catch (err) {
    console.error("Error updating time:", err);
  }
};

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateTime();
  currentTabId = activeInfo.tabId;
  const tab = await chrome.tabs.get(currentTabId);
  if (tab.url) {
    currentDomain = getDomain(tab.url);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tabId === currentTabId && changeInfo.url) {
    await updateTime();
    currentDomain = getDomain(changeInfo.url);
  }
});

// Handle window focus changes (e.g. user switches to another app)
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Browser lost focus
    await updateTime();
    currentDomain = null;
  } else {
    // Browser regained focus, find active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      await updateTime();
      currentDomain = getDomain(tabs[0].url);
      startTime = Date.now();
    }
  }
});

// Handle idle state
chrome.idle.setDetectionInterval(60); // 60 seconds
chrome.idle.onStateChanged.addListener(async (newState) => {
  if (newState !== 'active') {
    await updateTime();
    currentDomain = null;
  } else {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
      startTime = Date.now();
      currentDomain = getDomain(tabs[0].url);
    }
  }
});

// Robustness: Periodic save every 10 seconds
setInterval(async () => {
  if (currentDomain) {
    // Just calling updateTime will add the duration since last startTime and reset startTime
    // This is perfect for periodic saves.
    await updateTime();
  }
}, 10000);
