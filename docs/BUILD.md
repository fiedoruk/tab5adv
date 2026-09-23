# Build and reproduce

The firmware is based on
[`espressif/esp32-scummvm@52b4c6f5`](https://github.com/espressif/esp32-scummvm/tree/52b4c6f5da2f030157026bc1c2ceb5aa9acf145e).
The matching source revision and binary hashes are recorded beside each candidate.
Use the [matched source archive](https://github.com/fiedoruk/tab5adv/releases/download/v0.3.0-rc2/tab5adv-source.tar.gz), not the moving upstream default branch. Its
`SOURCE.md` documents the omitted external runtime `kyra.dat` and pinned retrieval.

Validated toolchain: ESP-IDF 5.5.5, RISC-V GCC 14.2.0+20260121,
`espressif/m5stack_tab5` 1.3.1; dependencies are pinned by the firmware lockfile.
Use an isolated environment with Python dependencies required by that IDF.
Do not replace unrelated global SDK installations.

In a fresh wrapper checkout, unpack the matching release source first:

```sh
mkdir firmware
tar -xzf /path/to/tab5adv-source.tar.gz --strip-components=1 -C firmware
cd firmware
```

The desktop/null preview and ESP32 build must use separate source directories:
the port's ExternalProject runs ScummVM configure in the source tree.

```sh
# In the matching firmware source root. Substitute your own SDK/Python locations.
export IDF_PATH=/path/to/esp-idf
# Put the matching RISC-V compiler, CMake and Ninja on PATH.
cmake -S backends/platform/esp32 -B backends/platform/esp32/build-idf \
  -G Ninja -DIDF_TARGET=esp32p4 \
  -DSDKCONFIG="$PWD/backends/platform/esp32/sdkconfig.tab5adv" \
  -DPYTHON=/path/to/idf-python -DPYTHON_DEPS_CHECKED=1
nice -n 10 ninja -C backends/platform/esp32/build-idf -j2
```

The pinned 0.3 build enables the engines needed for the selected library,
including SCUMM v0–v8 and Kyra in the local source tree. HE remains disabled.
The browser catalog exposes only the 13 device-pilot profiles; Kyra and other
pending candidates remain outside the public picker. Do not infer release
acceptance from an engine being compiled.

After editing ScummVM core/GUI files, explicitly rebuild the static libraries
before Ninja because ExternalProject does not watch every upstream source file:

```sh
nice -n 10 make -j2 libs
nice -n 10 ninja -C backends/platform/esp32/build-idf -j2
```

The app is `backends/platform/esp32/build-idf/scummvm.bin`. Flashing it alone
requires the matching partition table/bootloader already present; the app offset
in this profile is 0x10000. First-time users should use the matched merged image
and web manifest. Keep a device backup before replacing an existing installation.

## Catalog, theme and host checks

From the wrapper project root, with its `firmware/` source directory present:

```sh
python3 tools/build_catalog.py
python3 tools/build_theme.py
python3 tools/qc_geometry.py
node tools/test_installer.mjs /path/to/the/eight/ZIPs
c++ -std=c++17 tools/test_playtime.cpp -o /tmp/tab5adv-playtime-check
/tmp/tab5adv-playtime-check
```

The eight ZIP archives (seven games plus Dráscula music) are user-provided fixtures and are not in the source package.
The public catalog generator uses the 13 published game manifests plus Dráscula
music. Running it after unpacking the source changes firmware registration to
that public set; skip regeneration when reproducing the original packaged image. The theme generator verifies its pinned ScummVM base and emits a
reproducible ZIP. The geometry check runs the real shared touch/cursor code with
AddressSanitizer and UndefinedBehaviorSanitizer; it is not a physical touch test.

Serve the installer locally:

```sh
python3 -m http.server 8175 --bind 127.0.0.1 --directory site
```

This local server opens the EN installer. The production PL entry lives at
`/pl/tab5adv/` and loads shared assets from `/tab5adv/`; it requires that path
layout in a local preview. Do not open installer HTML through `file://`.

Production requires HTTPS. Game data goes directly from the browser to the USB
device; the static website has no upload endpoint. `tools/tab5adv_usb.py` is an
advanced maintenance alternative requiring Python and pyserial, not a second
cloud service.

## MPEG audio

Dragon History's Polish speech uses MP3. The Tab5 component `tab5_mad` vendors
libmad from the exact commit in its TAB5-PROVENANCE.md, with GPL-2.0-or-later
notices. It uses portable fixed-point arithmetic on RISC-V; no architecture
assembly or decoder subprocesses. The ScummVM ESP32 configure case enables
USE_MAD and adds its include path. CMake links the IDF component.
