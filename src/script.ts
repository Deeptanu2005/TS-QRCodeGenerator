// TypeScript code to generate QR code using QRCode library
declare var QRCode: any;

// Get elements with proper types
const qrUrl: HTMLInputElement = document.getElementById("qrCodeURL") as HTMLInputElement;
const button: HTMLButtonElement = document.getElementById("genQR") as HTMLButtonElement;
const image: HTMLImageElement = document.getElementById("qrCode") as HTMLImageElement;

button.addEventListener("click", (): void => {
    if (typeof QRCode === "undefined") {
        console.error("QRCode library not loaded");
        return;
    }

    const url: string = qrUrl.value.trim();

    if (url !== "") {
        QRCode.toDataURL(url)
            .then((generatedUrl: string): void => {
                image.src = generatedUrl;
            })
            .catch((err: Error): void => console.error("QR Code generation error:", err));
    } else {
        alert("Please enter a URL!");
    }
});

function downloadImage(): void {
    const img: HTMLImageElement = document.getElementById("qrCode") as HTMLImageElement;
    if (!img || !img.src) {
        console.error("Image not found or invalid source.");
        return;
    }

    const link: HTMLAnchorElement = document.createElement("a") as HTMLAnchorElement;
    link.href = img.src;
    link.download = "qr-image.png"; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}