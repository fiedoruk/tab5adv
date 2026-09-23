#!/usr/bin/env python3
"""Build a pinned native ScummVM Tab5 skin; never touch the device."""
from pathlib import Path
import hashlib
import re
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'theme/vendor/scummremastered.zip'
PALETTE = {
    'background': '244,240,230', 'dialog_background': '244,240,230',
    'button_idle': '24,49,95', 'button_hover': '43,89,162',
    'button_pressed': '33,65,120', 'button_disabled': '126,135,148',
    'griditem_highlight_color': '225,229,237', 'highlight': '224,154,39',
    'blandyellow': '230,223,208', 'paleyellow': '246,241,227',
    'black': '27,36,48', 'white': '255,253,247',
    'shadowcolor': '193,190,181', 'thumb_color': '24,49,95',
    'darkgray': '195,204,218', 'darkgray2': '208,213,220',
    'lightgray': '234,231,220', 'lightgray2': '242,239,230',
}

DARK = {
 'highlight':'110,69,11',
 'background':'16,28,43','dialog_background':'20,34,52',
 'button_idle':'35,56,81','button_hover':'55,90,124','button_pressed':'70,106,141','button_disabled':'48,57,70',
 'griditem_highlight_color':'39,57,79','blandyellow':'43,57,77','paleyellow':'28,43,63',
 'black':'232,237,244','white':'248,250,253','shadowcolor':'10,18,28','thumb_color':'105,147,194',
 'darkgray':'84,98,118','darkgray2':'103,116,135','lightgray':'28,41,59','lightgray2':'39,52,72'
}
BLACK = {
 'highlight':'104,70,16',
 'background':'12,13,16','dialog_background':'19,21,25',
 'button_idle':'35,39,47','button_hover':'57,63,76','button_pressed':'76,84,100','button_disabled':'42,45,51',
 'griditem_highlight_color':'36,40,48','blandyellow':'49,51,58','paleyellow':'30,32,39',
 'black':'240,242,246','white':'255,253,247','shadowcolor':'6,7,9','thumb_color':'166,173,188',
 'darkgray':'91,97,108','darkgray2':'112,119,132','lightgray':'28,31,37','lightgray2':'42,46,54'
}

def build(variant, title, overrides):
    palette={**PALETTE,**overrides}
    out=ROOT/'theme'/(variant+'.zip')
    expected='fb3d5338821763995985239012af516b2c4baff96c164524d5596dac217cf3c8'
    assert hashlib.sha256(BASE.read_bytes()).hexdigest() == expected, 'base theme drift'
    with zipfile.ZipFile(BASE) as source:
        files={i.filename.lstrip('./'):source.read(i) for i in source.infolist()}
    gfx=files['remastered_gfx.stx'].decode()
    for name,color in palette.items():
        pattern=rf"(<color\s+name\s*=\s*'{name}'\s+rgb\s*=\s*')[^']+"
        gfx,count=re.subn(pattern,lambda m:m[1]+color,gfx)
        assert count==1,name
    # Upstream has one missing XML whitespace tolerated by its parser.
    gfx=gfx.replace("'width", "' width")
    gfx=gfx.replace("width = '287' height = '80'", "width = '108' height = '30'")
    gfx=re.sub(r"shadow\s*=\s*'\d+'", "shadow = '0'", gfx)
    gfx=gfx.replace("248, 232, 168", palette["background"])
    if overrides:
        # Device QC: upstream yellow tabs and dark arrows lost contrast.
        gfx=gfx.replace('239, 202, 109',palette['button_idle']).replace('232, 180, 80',palette['shadowcolor'])
        gfx=re.sub(r"(<drawstep\s+func = 'triangle'[\s\S]*?/>)",lambda m:m[0].replace("bg_color = 'shadowcolor'","bg_color = 'thumb_color'"),gfx)
    files['remastered_gfx.stx']=gfx.encode()
    layout=files['lowres_layout.stx'].decode()
    layout=layout.replace('<globals>',"<globals>\n<def var='Tab5Home' value='1'/>",1)
    for name,value in [('ShowLauncherLogo','1'),('GridSupported','1'),('Grid.ShowTitles','1'),('Grid.XSpacing','6'),('Grid.YSpacing','6')]:
        pattern=rf"(<def\s+var\s*=\s*'{re.escape(name)}'\s+value\s*=\s*')[^']+"
        layout,count=re.subn(pattern,lambda m:m[1]+value,layout)
        assert count==1,name
    # With ShowLauncherLogo enabled, both launcher modes instantiate a Logo.
    # The upstream lowres List layout has no position for it and aborts on L.
    list_start=layout.index("<dialog name = 'Launcher' overlays = 'screen'>")
    list_end=layout.index('</dialog>',list_start)+len('</dialog>')
    list_layout=layout[list_start:list_end]
    header="\t\t\t<layout type = 'horizontal'  spacing = '5' padding = '0, 0, 0, 0'>"
    assert list_layout.count(header)==1 and "name = 'Logo'" not in list_layout
    list_layout=list_layout.replace(header,header+"\n\t\t\t\t<widget name = 'Logo' width = '108' height = '30'/>",1)
    assert list_layout.count("name = 'Logo'")==1
    layout=layout[:list_start]+list_layout+layout[list_end:]
    start=layout.index("\t<dialog name = 'LauncherGrid'")
    end=layout.index('</dialog>',start)+len('</dialog>')
    layout=layout[:start]+(ROOT/'theme/launcher-grid.stx').read_text()+layout[end:]
    grid_layout=layout[start:layout.index('</dialog>',start)]
    assert grid_layout.count("name='Logo'")==1
    files['lowres_layout.stx']=layout.encode()
    logo=(ROOT/'theme/logo.svg').read_text()
    if overrides:
        logo=logo.replace('#18315f','#e8edf4').replace('#f4f0e6','#142234')
    files['logo.svg']=logo.encode()
    files['THEMERC']=f'[SCUMMVM_STX0.9.19:{title}:Tab5Adv / ScummVM contributors]\n'.encode()
    # Upstream STX permits syntax rejected by a strict XML parser. Check our
    # own layout here; the native ScummVM preview validates the full archive.
    ET.fromstring((ROOT/'theme/launcher-grid.stx').read_text())
    with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as dest:
        for name,data in sorted(files.items()):
            item=zipfile.ZipInfo(name,date_time=(2026,9,22,0,0,0))
            item.compress_type=zipfile.ZIP_DEFLATED
            dest.writestr(item,data)
    print('THEME XML/ZIP PASS',out.name,out.stat().st_size,hashlib.sha256(out.read_bytes()).hexdigest())

if __name__=='__main__':
    build('tab5adv','Tab5 Light',{})
    build('tab5adv-dark','Tab5 Dark',DARK)
    build('tab5adv-black','Tab5 Black',BLACK)
