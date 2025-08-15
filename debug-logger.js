// Debug script to monitor browser network requests and localStorage
console.log("=== DEBUG LOGGER LOADED ===");

// Monitor all fetch requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log("=== FETCH REQUEST ===");
  console.log("URL:", args[0]);
  console.log("Options:", args[1]);
  console.log("Headers:", args[1]?.headers);
  console.log("Current localStorage authToken:", localStorage.getItem('authToken'));
  
  return originalFetch.apply(this, args)
    .then(response => {
      console.log("=== FETCH RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Headers:", Object.fromEntries(response.headers.entries()));
      console.log("Set-Cookie headers:", response.headers.get('set-cookie'));
      return response;
    });
};

// Monitor localStorage changes
const originalSetItem = localStorage.setItem;
localStorage.setItem = function(key, value) {
  console.log("=== LOCALSTORAGE SET ===");
  console.log("Key:", key);
  console.log("Value:", value);
  return originalSetItem.call(this, key, value);
};

const originalGetItem = localStorage.getItem;
localStorage.getItem = function(key) {
  const value = originalGetItem.call(this, key);
  console.log("=== LOCALSTORAGE GET ===");
  console.log("Key:", key);
  console.log("Value:", value);
  return value;
};

// Check document cookies periodically
setInterval(() => {
  console.log("=== PERIODIC COOKIE CHECK ===");
  console.log("Document cookies:", document.cookie);
  console.log("LocalStorage authToken:", localStorage.getItem('authToken'));
}, 5000);

console.log("=== DEBUG LOGGER ACTIVE ===");