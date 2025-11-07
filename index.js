const BAUD_RATE = 115200;
const USB_VENDOR_ID = 0x303A;

let port, reader;

const requestPorts = async () => {
    port = await navigator.serial.requestPort({filters: [{usbVendorId: USB_VENDOR_ID}]});
    const info = await port.getInfo();
    console.log(info);

    return port;

    // if (info.usbVendorId === 0x303A) {
    //     console.log('correct device');
    //     return port;
    // } else {
    //     alert('invalid device');
    //     return null;
    // }
}

async function readLoop() {
    const decoder = new TextDecoder();
    while (port.readable) {
        try {
            const {value, done} = await reader.read();
            if (done) break;
            document.getElementById("output").textContent = decoder.decode(value);
        } catch (err) {
            console.error("read err:", err);
            break;
        }
    }
}

document.getElementById("serial_connect").addEventListener("click", async () => {
    try {
        await requestPorts();
        await port.open({baudRate: BAUD_RATE});
        reader = port.readable.getReader();

        readLoop()
    } catch (err) {
        console.error(err);
    }
})

