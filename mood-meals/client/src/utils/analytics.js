// utils/analytics.js

export const logEvent = (eventName, params = {}) => {
  if (window.gtag) {
    window.gtag("event", eventName, params);
  } else {
    console.warn("Google Analytics not initialized yet");
  }
};
