// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SHOW_WARNING") {
        showOverlay(request.message);
    }
});

function showOverlay(msg) {
    if (document.getElementById('productivity-tracker-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'productivity-tracker-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.95);
        color: white;
        z-index: 2147483647;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    `;

    const title = document.createElement('h1');
    title.innerText = "Time Limit Exceeded!";
    title.style.fontSize = "3rem";
    title.style.marginBottom = "1rem";
    title.style.color = "#ef4444";

    const message = document.createElement('p');
    message.innerText = msg || "You have used up your time for this site.";
    message.style.fontSize = "1.5rem";
    message.style.marginBottom = "2rem";

    const button = document.createElement('button');
    button.innerText = "Close Page";
    button.style.cssText = `
        padding: 10px 20px;
        font-size: 1.2rem;
        background-color: #ef4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.1s;
    `;
    button.onmouseover = () => button.style.transform = "scale(1.05)";
    button.onmouseout = () => button.style.transform = "scale(1)";
    button.onclick = () => {
        // We can't actually close the tab from content script easily without window.close which might be blocked
        // But we can just leave the overlay there to block usage.
        // Or navigate away
        window.location.href = "https://www.google.com";
    };

    const ignoreBtn = document.createElement('button');
    ignoreBtn.innerText = "I need 1 more minute";
    ignoreBtn.style.cssText = `
        margin-top: 10px;
        background: transparent;
        border: 1px solid #666;
        color: #888;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
    `;
    ignoreBtn.onclick = () => {
        const domain = window.location.hostname.replace(/^www\./, '');
        chrome.runtime.sendMessage({ action: "ADD_TIME", domain: domain });
        overlay.remove();
    };

    overlay.appendChild(title);
    overlay.appendChild(message);
    overlay.appendChild(button);
    overlay.appendChild(ignoreBtn);

    document.body.appendChild(overlay);
}
