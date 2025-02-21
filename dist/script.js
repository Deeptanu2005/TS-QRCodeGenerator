"use strict";
const qrUrl = document.getElementById("qrCodeURL");
const button = document.getElementById("genQR");
const image = document.getElementById("qrCode");
button.addEventListener("click", () => {
    if (typeof QRCode === "undefined") {
        console.error("QRCode library not loaded");
        return;
    }
    const url = qrUrl.value.trim();
    if (url !== "") {
        QRCode.toDataURL(url)
            .then((generatedUrl) => {
            image.src = generatedUrl;
        })
            .catch((err) => console.error("QR Code generation error:", err));
    }
    else {
        alert("Please enter a URL!");
    }
});
function downloadImage() {
    const img = document.getElementById("qrCode");
    if (!img || !img.src) {
        console.error("Image not found or invalid source.");
        return;
    }
    const link = document.createElement("a");
    link.href = img.src;
    link.download = "qr-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
//# sourceMappingURL=script.js.map