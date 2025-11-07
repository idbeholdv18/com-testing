const BAUD_RATE = 115200;

let ports;

// const openSerialPort = async () => {
//     await port.open({baudRate: BAUD_RATE /* pick your baud rate */});
// }

document.getElementById("serial_connect").addEventListener("click", async () => {
    try {
        ports = await navigator.serial.requestPort();
        console.log(ports);
    } catch (err) {
        console.error(err);
    }
})