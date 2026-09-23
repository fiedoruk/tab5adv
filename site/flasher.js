// The dialog contract matches the pinned ESP Web Tools 10.4.0 install-button.
// Keep the upstream flasher unchanged; share our remembered-port selection.
import { chooseTab5Port } from "./usb-port.js";
export async function openFlasher(manifestPath) {
  await import("./vendor/esp-web-tools/install-dialog-im156JnI.js");
  const port=await chooseTab5Port();
  await port.open({baudRate:115200,bufferSize:8192});
  try {
    const dialog=document.createElement("ewt-install-dialog");
    dialog.port=port;dialog.manifestPath=manifestPath;
    dialog.addEventListener("closed",async()=>{try{await port.close();}catch{/* reboot may detach USB */}},{once:true});
    document.body.appendChild(dialog);
  } catch(error) {await port.close();throw error;}
}
