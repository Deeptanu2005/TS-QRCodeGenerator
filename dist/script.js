"use strict";
const qrUrl = document.getElementById("qrCodeURL");
const button = document.getElementById("genQR");
const image = document.getElementById("qrCode");
button.addEventListener("click", () => {
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
        .then((generatedUrl) => {
        image.src = generatedUrl;
    })
        .catch((err) => console.error("QR Code generation error:", err));
});
function downloadImage() {
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
function saveToLocalStorage(qrList) {
    localStorage.setItem("savedQRs", JSON.stringify(qrList));
}
function loadFromLocalStorage() {
    const data = localStorage.getItem("savedQRs");
    return data ? JSON.parse(data) : [];
}
function saveQR() {
    const image = document.getElementById("qrCode");
    if (!image || !image.src) {
        console.error("Image not found or invalid source.");
        return;
    }
    const qrName = prompt("Enter a name for this QR Code:");
    if (!qrName || qrName.trim().length < 2 || qrName.trim().length > 10) {
        alert("QR Code not saved! Name must be between 2 and 10 characters.");
        return;
    }
    const savedQRs = document.getElementById("savedQRs");
    if (!savedQRs) {
        console.error("Saved QR section not found.");
        return;
    }
    let qrList = loadFromLocalStorage();
    if (qrList.length >= 10) {
        alert("You can only save up to 10 QR codes. Please delete some before adding new ones.");
        return;
    }
    const newQR = {
        id: Date.now().toString(),
        name: qrName.trim(),
        src: image.src,
    };
    qrList.push(newQR);
    saveToLocalStorage(qrList);
    renderQRList();
    const modalElement = document.getElementById("staticBackdrop");
    if (modalElement) {
        const myModal = bootstrap.Modal.getInstance(modalElement);
        myModal === null || myModal === void 0 ? void 0 : myModal.hide();
    }
}
function deleteQR(qrId) {
    const confirmation = confirm("Are you sure you want to delete this QR Code?");
    if (!confirmation)
        return;
    let qrList = loadFromLocalStorage();
    qrList = qrList.filter(qr => qr.id !== qrId);
    saveToLocalStorage(qrList);
    renderQRList();
}
function downloadQR(qrSrc, qrName) {
    const link = document.createElement("a");
    link.href = qrSrc;
    link.download = `${qrName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function renderQRList() {
    const savedQRs = document.getElementById("savedQRs");
    if (!savedQRs)
        return;
    savedQRs.innerHTML = "";
    const qrList = loadFromLocalStorage();
    if (qrList.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.id = "emptyMessage";
        emptyMessage.className = "text-center custom-text-lightest mt-3";
        emptyMessage.textContent = "No QR codes saved yet.";
        savedQRs.appendChild(emptyMessage);
        return;
    }
    qrList.forEach(qr => {
        const colDiv = document.createElement("div");
        colDiv.className = "col";
        colDiv.dataset.qrId = qr.id;
        const cardDiv = document.createElement("div");
        cardDiv.className = "card custom-bg-lightest custom-border-dark";
        const imgElement = document.createElement("img");
        imgElement.src = qr.src;
        imgElement.className = "card-img-top";
        const cardBody = document.createElement("div");
        cardBody.className = "card-body custom-bg-dark custom-text-lightest d-flex justify-content-between align-items-center";
        const title = document.createElement("h5");
        title.className = "card-title m-0";
        title.textContent = qr.name;
        const buttonContainer = document.createElement("div");
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-sm mx-1";
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.onclick = () => deleteQR(qr.id);
        const downloadBtn = document.createElement("button");
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
document.addEventListener("DOMContentLoaded", renderQRList);
//# sourceMappingURL=script.js.map