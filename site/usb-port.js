// Reuse an already authorized Tab5-class port; never grant permission in code.
export async function chooseTab5Port(log = () => {}) {
  if (!("serial" in navigator)) throw new Error("web-serial-unsupported");
  const filters=[{usbVendorId:0x303a,usbProductId:0x1001}];
  const granted=(await navigator.serial.getPorts()).filter(port=>{
    const info=port.getInfo();return info.usbVendorId===0x303a && info.usbProductId===0x1001;
  });
  const port=granted.length===1 ? granted[0] : await navigator.serial.requestPort({filters});
  log(granted.length===1 ? "USB: previously authorized port" : "USB: selected port");
  return port;
}
