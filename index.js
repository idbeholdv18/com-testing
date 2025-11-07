const BAUD_RATE = 115200;

let port, reader;

const requestPorts = async () => {
    port = await navigator.serial.requestPort();
}

async function readLoop() {
    const decoder = new TextDecoder();
    while (port.readable) {
        try {
            const { value, done } = await reader.read();
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
        await port.open({ baudRate: BAUD_RATE });
        reader = port.readable.getReader();

        readLoop()
    } catch (err) {
        console.error(err);
    }
})

