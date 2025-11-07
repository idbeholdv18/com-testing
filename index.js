const BAUD_RATE = 115200;
const USB_VENDOR_ID = 0x303A;

let port, reader;

async function requestPorts() {
    port = await navigator.serial.requestPort({
        filters: [{usbVendorId: USB_VENDOR_ID}]
    });

    const info = await port.getInfo();
    console.log("Выбран порт:", info);
    return port;
}

async function openPortIfClosed() {
    if (!port.readable && !port.writable) {
        await port.open({baudRate: BAUD_RATE});
        console.log("Порт открыт");
    }
}

async function readLoop() {
    const decoder = new TextDecoder();
    reader = port.readable.getReader();

    while (port.readable) {
        try {
            const {value, done} = await reader.read();
            if (done) break;
            document.getElementById("output").textContent = decoder.decode(value);
        } catch (err) {
            console.error("Ошибка чтения:", err);
            break;
        }
    }

    reader.releaseLock();
}

async function autoReconnect() {
    const ports = await navigator.serial.getPorts();

    if (ports.length > 0) {
        console.log("Найден ранее разрешённый порт:", ports);
        port = ports.find(p => p.getInfo().usbVendorId === USB_VENDOR_ID) || ports[0];
        await openPortIfClosed();
        await readLoop();
    } else {
        console.log("Нет сохранённых портов, нужно выбрать вручную.");
    }
}

document.getElementById("serial_connect").addEventListener("click", async () => {
    try {
        await requestPorts();
        await openPortIfClosed();
        await readLoop();
    } catch (err) {
        console.error(err);
    }
});

window.addEventListener("DOMContentLoaded", autoReconnect);