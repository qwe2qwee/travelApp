const { TabTrigger } = require("expo-router/ui");
console.log("TabTrigger:", TabTrigger);
// Check if it's a forwardRef or function
if (TabTrigger) {
  console.log("isFunction:", typeof TabTrigger === "function");
  // We can't easily see typescript types from JS runtime, but we might see defaultProps or propTypes if defined
  console.log("propTypes:", TabTrigger.propTypes);
}
