import QRCode from 'qrcode';

// 1. Select the elements from the HTML
const urlInput = document.getElementById('urlInput') as HTMLInputElement;
const hwidInput = document.getElementById('hwidInput') as HTMLInputElement;
const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
const printBtn = document.getElementById('printBtn') as HTMLButtonElement;
const canvas = document.getElementById('qrcode') as HTMLCanvasElement;

// 2. Logic to Generate the QR Code
generateBtn.addEventListener('click', async () => {
  // Concatenate URL and Hardware ID
  const combinedText = urlInput.value + hwidInput.value;

  if (combinedText.trim() === "") {
    alert("Please enter values in the fields first.");
    return;
  }

  try {
    // Generate QR code onto the canvas
    // Width 160 keeps it small enough to fit on screen without scrolling
    await QRCode.toCanvas(canvas, combinedText, {
      width: 160,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    // Show the Print button once the QR is ready
    printBtn.style.display = 'block';
  } catch (err) {
    console.error("QR Generation Error:", err);
  }
});

// 3. Logic to Print the QR Code
printBtn.addEventListener('click', () => {
  const dataUrl = canvas.toDataURL("image/png");

  // Create a hidden iframe. This bypasses 'Pop-up blocked' errors 
  // and works better with Antivirus real-time scanning.
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (doc) {
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
            img { width: 300px; height: auto; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print();">
        </body>
      </html>
    `);
    doc.close();

    // Clean up: Remove the invisible iframe after the print dialog closes
    iframe.contentWindow?.addEventListener('afterprint', () => {
      document.body.removeChild(iframe);
    });
  }
});