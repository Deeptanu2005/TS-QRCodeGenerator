declare var QRCode: any;
declare var bootstrap: any;

// Get elements with proper types
const qrUrl = document.getElementById("qrCodeURL") as HTMLInputElement;
const button = document.getElementById("genQR") as HTMLButtonElement;
const image = document.getElementById("qrCode") as HTMLImageElement;

// Generate QR Code
button.addEventListener("click", (): void => {
    const url = qrUrl.value.trim();
    
    if (url === "") {
        alert("Please enter a URL!");
        return;
    }

    if (typeof QRCode === "undefined") {
        console.error("QRCode library not loaded");
        return;
    }

    const modalElement = document.getElementById("staticBackdrop");
    if (!modalElement) {
        console.error("Modal element not found");
        return;
    }

    const myModal = new bootstrap.Modal(modalElement);
    myModal.show();

    QRCode.toDataURL(url)
        .then((generatedUrl: string): void => {
            image.src = generatedUrl;
        })
        .catch((err: Error): void => console.error("QR Code generation error:", err));
});

// Download Image
function downloadImage(): void {
    if (!image || !image.src) {
        console.error("Image not found or invalid source.");
        return;
    }

    const link = document.createElement("a");
    link.href = image.src;
    link.download = "qr-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

interface QRCodeData {
    id: string;
    name: string;
    src: string;
}

// Save to localStorage
function saveToLocalStorage(qrList: QRCodeData[]): void {
    localStorage.setItem("savedQRs", JSON.stringify(qrList));
}

// Load from localStorage
function loadFromLocalStorage(): QRCodeData[] {
    const data = localStorage.getItem("savedQRs");
    return data ? JSON.parse(data) : [];
}

// Save QR Code
function saveQR(): void {
    const image: HTMLImageElement | null = document.getElementById("qrCode") as HTMLImageElement;
    if (!image || !image.src) {
        console.error("Image not found or invalid source.");
        return;
    }

    const qrName: string | null = prompt("Enter a name for this QR Code:");
    if (!qrName || qrName.trim().length < 2 || qrName.trim().length > 10) {
        alert("QR Code not saved! Name must be between 2 and 10 characters.");
        return;
    }

    const savedQRs: HTMLElement | null = document.getElementById("savedQRs");
    if (!savedQRs) {
        console.error("Saved QR section not found.");
        return;
    }

    let qrList = loadFromLocalStorage();

    // Enforce limit of 10 QR codes
    if (qrList.length >= 10) {
        alert("You can only save up to 10 QR codes. Please delete some before adding new ones.");
        return;
    }

    const newQR: QRCodeData = {
        id: Date.now().toString(),
        name: qrName.trim(), // Trim to remove extra spaces
        src: image.src,
    };

    qrList.push(newQR);
    saveToLocalStorage(qrList);
    renderQRList();

    // Close the modal
    const modalElement: HTMLElement | null = document.getElementById("staticBackdrop");
    if (modalElement) {
        const myModal: any = bootstrap.Modal.getInstance(modalElement);
        myModal?.hide();
    }
}

// Delete QR Code
function deleteQR(qrId: string): void {
    const confirmation = confirm("Are you sure you want to delete this QR Code?");
    if (!confirmation) return;

    let qrList = loadFromLocalStorage();
    qrList = qrList.filter(qr => qr.id !== qrId);
    saveToLocalStorage(qrList);
    renderQRList();
}

// Download QR Code
function downloadQR(qrSrc: string, qrName: string): void {
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = qrSrc;
    link.download = `${qrName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Render QR Codes from localStorage
function renderQRList(): void {
    const savedQRs: HTMLElement | null = document.getElementById("savedQRs");
    if (!savedQRs) return;

    savedQRs.innerHTML = ""; // Clear previous content

    const qrList = loadFromLocalStorage();

    if (qrList.length === 0) {
        const emptyMessage: HTMLDivElement = document.createElement("div");
        emptyMessage.id = "emptyMessage";
        emptyMessage.className = "text-center custom-text-lightest mt-3";
        emptyMessage.textContent = "No QR codes saved yet.";
        savedQRs.appendChild(emptyMessage);
        return;
    }

    qrList.forEach(qr => {
        // Create QR card
        const colDiv: HTMLDivElement = document.createElement("div");
        colDiv.className = "col";
        colDiv.dataset.qrId = qr.id;

        const cardDiv: HTMLDivElement = document.createElement("div");
        cardDiv.className = "card custom-bg-lightest custom-border-dark";

        const imgElement: HTMLImageElement = document.createElement("img");
        imgElement.src = qr.src;
        imgElement.className = "card-img-top";

        const cardBody: HTMLDivElement = document.createElement("div");
        cardBody.className = "card-body custom-bg-dark custom-text-lightest d-flex justify-content-between align-items-center";

        const title: HTMLHeadingElement = document.createElement("h5");
        title.className = "card-title m-0";
        title.textContent = qr.name;

        // Create button container
        const buttonContainer: HTMLDivElement = document.createElement("div");

        // Delete button
        const deleteBtn: HTMLButtonElement = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm mx-1";
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
        deleteBtn.onclick = () => deleteQR(qr.id);

        // Download button
        const downloadBtn: HTMLButtonElement = document.createElement("button");
        downloadBtn.className = "btn btn-success btn-sm";
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>'; 
        downloadBtn.onclick = () => downloadQR(qr.src, qr.name);

        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(deleteBtn);
        cardBody.appendChild(title);
        cardBody.appendChild(buttonContainer);
        cardDiv.appendChild(imgElement);
        cardDiv.appendChild(cardBody);
        colDiv.appendChild(cardDiv);
        savedQRs.appendChild(colDiv);
    });
}

// Load saved QR codes on page load
document.addEventListener("DOMContentLoaded", renderQRList);