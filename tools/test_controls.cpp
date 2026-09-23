#include <cassert>
#include <cstdio>
#include "../firmware/backends/platform/esp32/main/tab5-controls.h"
#include "../firmware/backends/platform/esp32/main/tab5-hud.h"
#include "../firmware/backends/platform/esp32/main/tab5-pixels.h"
using namespace Tab5;
static void sample(Input &i,int n,int x,int y,bool gui=false){ i.sample(n,y,1279-x,gui); }
static Event take(Input &i,Action a){ Event e; assert(i.next(e)); assert(e.action==a); return e; }
static void empty(Input &i){ Event e; assert(!i.next(e)); }
int main(){
 // Padded, unaligned RGBA rows and dirty rectangles leave surrounding pixels intact.
 const uint8_t rgba[]={99,255,0,0,255,255,0,255,0,88,77,66,55,0,0,255,255,0,0,0,255,44};
 uint16_t converted[4]={0x1234,0x1234,0x1234,0x1234};
 copyRGB565(rgba+1,12,converted,2,0,0,2,2,{4,0,0,0,24,16,8},nullptr);
 assert(converted[0]==0xf800&&converted[1]==0x07e0&&converted[2]==0xffe0&&converted[3]==0xf800);
 const uint8_t rgb565[]={0x1f,0,0,0xf8,0xaa,0xbb};
 copyRGB565(rgb565,6,converted,2,1,0,2,1,{2,3,2,3,11,5,0},nullptr);
 assert(converted[0]==0xf800&&converted[1]==0xf800);
 const uint16_t palette[]={0x001f,0x07e0}; const uint8_t clut[]={0,1,99,1,0,99};
 copyRGB565(clut,3,converted,2,0,0,2,2,{1,0,0,0,0,0,0},palette);
 assert(converted[0]==0x001f&&converted[1]==0x07e0&&converted[2]==0x07e0&&converted[3]==0x001f);
 Input high;high.setGameSize(640,480);sample(high,1,640,360);auto hp=take(high,Action::Move);
 assert(hp.x==320&&hp.y==240);take(high,Action::LeftDown);
 puts("PASS: actual CLUT8/RGB565/RGBA conversion, unaligned/padded rows, dirty region and 640x480 pointer.");
 Input i;
 const int corners[4][4]={{160,4,0,0},{1119,4,319,0},{160,715,0,199},{1119,715,319,199}};
 for(const auto &c:corners){Input t;sample(t,1,c[0],c[1]);auto e=take(t,Action::Move);assert(e.x==c[2]&&e.y==c[3]);take(t,Action::LeftDown);sample(t,0,0,0);take(t,Action::LeftUp);empty(t);}
 sample(i,1,640,360); auto p=take(i,Action::Move); assert(p.x==160&&p.y==100); take(i,Action::LeftDown); empty(i);
 sample(i,1,80,198); take(i,Action::LeftUp); empty(i); // dragging into LEFT never clicks
 sample(i,0,0,0); empty(i);
 sample(i,1,80,320); take(i,Action::Move); take(i,Action::RightDown);empty(i);
 sample(i,1,80,320);empty(i); // state-based engines must observe a held button
 sample(i,0,0,0);take(i,Action::RightUp);empty(i);
 sample(i,1,80,198);take(i,Action::Move);take(i,Action::LeftDown);empty(i);
 sample(i,1,80,198);empty(i);
 sample(i,0,0,0);take(i,Action::LeftUp);empty(i);
 sample(i,1,80,442); assert(i.hoverOnly);empty(i);
 sample(i,0,0,0);sample(i,1,160,4);p=take(i,Action::Move);assert(p.x==0&&p.y==0);empty(i);
 sample(i,1,1119,715);p=take(i,Action::Move);assert(p.x==319&&p.y==199);empty(i);
 sample(i,0,0,0);sample(i,1,1200,198);take(i,Action::Menu);empty(i);
 sample(i,0,0,0);sample(i,1,1200,320);take(i,Action::EscapeDown);take(i,Action::EscapeUp);empty(i);
 sample(i,0,0,0);sample(i,1,80,198,true);p=take(i,Action::Move);assert(p.x==80&&p.y==198);take(i,Action::LeftDown);
 sample(i,2,80,198,true);take(i,Action::LeftUp);take(i,Action::Keyboard);empty(i);
 sample(i,1,640,360,true);empty(i); sample(i,0,0,0);empty(i);
 for(const auto &b:buttons){assert(b.x+b.w<=160||b.x>=1120);assert(b.w>=96&&b.h>=96);}
 static uint16_t frame[1280*720]; hud(frame,i,"BENEATH","STEEL SKY");
 FILE *f=fopen("build/hud-layout.ppm","wb");assert(f);fprintf(f,"P6\n1280 720\n255\n");
 for(int y=0;y<720;y++)for(int x=0;x<1280;x++){
  uint16_t c=frame[(1279-x)*720+y];unsigned char rgb[3]={(unsigned char)(((c>>11)&31)*255/31),(unsigned char)(((c>>5)&63)*255/63),(unsigned char)((c&31)*255/31)};fwrite(rgb,1,3,f);
 }fclose(f);
 // Native cursor: transparency, padded rows, hotspot and clipped edges.
 uint16_t pal[256]={};pal[1]=0xF800;pal[2]=0x07E0;
 uint8_t cur[]={1,0,99,0,2,99};
 for(auto &px:frame)px=0;
 cursor(frame,cur,2,2,3,0,0,0,0,0,pal);
 assert(frame[(1279-160)*720+4]==0xF800);
 assert(frame[(1279-163)*720+4]==0);
 assert(frame[(1279-163)*720+7]==0x07E0);
 cursor(frame,cur,2,2,3,1,1,0,0,0,pal);
 assert(frame[(1279-160)*720+4]==0x07E0);
 cursor(frame,cur,2,2,3,0,0,319,199,0,pal);
 assert(frame[(1279-1117)*720+712]==0xF800);
 assert(frame[(1279-1120)*720+719]==0);
 Input sf;sf.setGameSize(320,240);
 assert(sf.viewport.x==160&&sf.viewport.y==0&&sf.viewport.w==960&&sf.viewport.h==720);
 const int sfCorners[4][4]={{160,0,0,0},{1119,0,319,0},{160,719,0,239},{1119,719,319,239}};
 for(const auto &c:sfCorners){sample(sf,0,0,0);sample(sf,1,c[0],c[1]);auto e=take(sf,Action::Move);assert(e.x==c[2]&&e.y==c[3]);take(sf,Action::LeftDown);}
 sample(sf,0,0,0);sample(sf,1,640,360);p=take(sf,Action::Move);assert(p.x==160&&p.y==120);take(sf,Action::LeftDown);
 for(auto &px:frame)px=0;
 cursor(frame,cur,2,2,3,0,0,319,239,0,pal,sf.viewport);
 assert(frame[(1279-1117)*720+719]==0xF800);
 AudioState audio;audio.muted=true;audio.changeVolume(1000);assert(audio.volume==100&&audio.muted);
 audio.changeVolume(-1000);assert(audio.volume==0&&audio.muted);
 audio.changeVolume(10);assert(audio.volume==10&&audio.muted);
 audio.toggleMute();assert(!audio.muted);audio.toggleMute();assert(audio.muted);
 Input volumeInput;
 sample(volumeInput,1,80,558);take(volumeInput,Action::VolumeDown);empty(volumeInput);
 sample(volumeInput,0,0,0);sample(volumeInput,1,80,660);take(volumeInput,Action::VolumeUp);empty(volumeInput);
 sample(volumeInput,0,0,0);sample(volumeInput,1,1200,590);take(volumeInput,Action::Mute);empty(volumeInput);
 puts("PASS: volume clamp, +/- stays muted, mute toggle and all audio touch zones.");
 puts("PASS: Sfinx 320x240 corners/center, full-height viewport and clipped cursor.");
 puts("PASS: cursor palette, transparency, pitch, hotspot and all-edge clipping.");
 puts("PASS: actual shared input router — 4 corners/center, pointer mode, L/R click, drag cancellation, menu, escape pair, multitouch, overlay, 96px rails.");
}
