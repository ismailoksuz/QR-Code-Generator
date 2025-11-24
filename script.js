const dataInput = document.getElementById('qr-data');
const generateButton = document.getElementById('generate-button');
const downloadButton = document.getElementById('download-button');
const qrcodeContainer = document.getElementById('qrcode-container');
const messageBox = document.getElementById('message-box');
const placeholderText = document.getElementById('placeholder-text');

let qrCanvas = null;
const SCALE_SIZE = 6; 

function showMessage(message, type = 'error') {
    messageBox.textContent = message;
    
    if (type === 'error') {
        messageBox.classList.remove('hidden', 'text-green-400');
        messageBox.classList.add('text-red-400');
    } else {
        messageBox.classList.remove('hidden', 'text-red-400');
        messageBox.classList.add('text-green-400');
    }
    
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000);
}

function generateQRCode() {
    const data = dataInput.value.trim();

    if (!data) {
        showMessage('Error: Please enter data to generate the QR code.', 'error');
        downloadButton.disabled = true;
        placeholderText.classList.remove('hidden');
        qrcodeContainer.innerHTML = '';
        qrcodeContainer.appendChild(placeholderText);
        return;
    }

    qrcodeContainer.innerHTML = '';
    
    if (!qrCanvas) {
        qrCanvas = document.createElement('canvas');
    } else {
        qrCanvas.width = 0;
        qrCanvas.height = 0;
    }
    
    qrCanvas.classList.add('qr-canvas-fade');
    qrcodeContainer.appendChild(qrCanvas);

    const options = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        margin: 4, 
        scale: SCALE_SIZE,
        color: {
            dark: "#ffffff",
            light: "#1E293B"
        }
    };

    try {
        QRCode.toCanvas(qrCanvas, data, options, (error) => {
            if (error) {
                showMessage('Critical Error: Code could not be generated.', 'error');
                qrcodeContainer.innerHTML = '<p class="text-red-400 text-center">Error: Code could not be generated.</p>';
                downloadButton.disabled = true;
            } else {
                downloadButton.disabled = false;
                showMessage('QR Code successfully generated. Ready to download.', 'success');
            }
        });
    } catch (e) {
        showMessage('Fatal Error: Please check the browser console.', 'error');
        downloadButton.disabled = true;
        qrcodeContainer.innerHTML = '<p class="text-red-400 text-center">Error: Code could not be generated.</p>';
    }
}

function downloadQRCode() {
    if (qrCanvas && !downloadButton.disabled) {
        try {
            const imageURL = qrCanvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = imageURL;
            link.download = `QR-Code-Generator-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showMessage('Download started.', 'success');

        } catch (e) {
            showMessage('Download failed.', 'error');
        }
    } else {
        showMessage('Please generate a QR code first.', 'error');
    }
}

generateButton.addEventListener('click', generateQRCode);
downloadButton.addEventListener('click', downloadQRCode);

document.addEventListener('DOMContentLoaded', () => {
    qrcodeContainer.classList.add('qrcode-ready');
});