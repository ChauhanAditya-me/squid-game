// Simple fixed version
// ...existing code...
document.addEventListener("DOMContentLoaded", function () {
  console.log("Script loaded");
  // Start button event
  const startBtn = document.getElementById("startBtn");
  if (startBtn) {
    startBtn.onclick = function () {
      console.log("Start clicked");
      alert("Game starting...");
    };
  }
});
