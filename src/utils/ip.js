export function getLocalIP() {
    const os = require('os');
    const ifaces = os.networkInterfaces();
    let locatIp = '';
    console.log("ifaces:",ifaces)
    for (let dev in ifaces) {
        console.log("aa:",dev)
        if (dev === '本地连接') {
            for (let j = 0; j < ifaces[dev].length; j++) {
                if (ifaces[dev][j].family === 'IPv4') {
                    locatIp = ifaces[dev][j].address;
                    break;
                }
            }
        }
    }
    return locatIp;
}
