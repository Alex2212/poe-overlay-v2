document.addEventListener("DOMContentLoaded", () => {
  const titleBar = document.getElementById("title-bar");
  const closeButton = document.getElementById("close");
  let lastX = 0;
  let lastY = 0;
  let dragging = false;

  closeButton.addEventListener("click", (e) => { 
    console.log('close window');
    window.electronAPI.closeWindow()
  });


  titleBar.addEventListener("mousedown", (e) => {
    dragging = true;
    lastX = e.screenX;
    lastY = e.screenY;

    const onMouseMove = (e) => {
      if (!dragging) return;

      const deltaX = e.screenX - lastX;
      const deltaY = e.screenY - lastY;

      // Only send if there's movement
      if (deltaX !== 0 || deltaY !== 0) {
        window.electronAPI.sendDragPosition(deltaX, deltaY);
        lastX = e.screenX;
        lastY = e.screenY;
      }
    };

    const onMouseUp = () => {
      dragging = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });

  const webview = document.querySelector("webview");
    webview.addEventListener("did-finish-load", () => {
    let attempts = 0;

    const tryInject = () => {
      if (attempts > 10) {
        console.error("Failed to inject style after multiple attempts");
        return;
      }
      webview.executeJavaScript(`
          try {
            const root = document.querySelector('app-root');
            if (!root) throw new Error('app-root not found yet');
            const style = document.createElement('style');
            style.innerHTML = \`
            .bottom, .logo, .results, .login-section-container, .active-filter-section-container{
                display: none !important;
            }
  
            body {
                background-image: url('/bg1.jpg') !important;
                background-color: black !important;
            }

            ::-webkit-scrollbar {
                width: 12px !important;
                }

                ::-webkit-scrollbar-track {
                background: black !important;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to right,#463c29 0%,#3e3324 25%,#2f281c 50%,#3e3324 75%,#463c29 100%) !important;
                    border-radius: 6px !important;
                    border: 1px solid rgb(128, 120, 91) !important;
                    box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5); !important;
                }
            \`;
            document.head.appendChild(style);
          } catch (err) {
            throw err;
          }`).then(() => {
          console.log("✅ CSS injected successfully!");
        }).catch((err) => {
          console.warn("Retrying injection:", err.message);
          attempts++;
          setTimeout(tryInject, 300);
        });
    };

    tryInject();
  });
});
