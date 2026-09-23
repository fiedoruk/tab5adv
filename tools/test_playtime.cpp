// SPDX-License-Identifier: GPL-3.0-or-later
#include "../firmware/common/tab5-playtime.h"
#include <assert.h>
#include <stdio.h>

using Tab5::Playtime;
static void seconds(Playtime &p,uint64_t start,unsigned n,bool active=true) {
    for(unsigned i=1;i<=n;++i)p.tick(start+i*1000,active);
}
int main() {
    Playtime p;
    p.start("sky",0);p.tick(0,true);seconds(p,0,30);
    assert(p.totalSeconds()==0); // Loading/intro without a first action.
    p.activity(30000);seconds(p,30000,60);
    assert(p.find("sky")->seconds==60 && p.find("sky")->sessions==1 && p.points()==10);
    p.tick(91000,false);seconds(p,91000,20,false);p.tick(112000,true);
    assert(p.totalSeconds()==60);p.tick(113000,true);assert(p.totalSeconds()==61);
    p.tick(130000,true);assert(p.totalSeconds()==61); // Blocked load/snapshot excluded.
    p.stop(130000);p.start("queen",130000);p.activity(130000);p.tick(130000,true);
    seconds(p,130000,10);assert(p.find("sky")->seconds==61 && p.find("queen")->seconds==10);

    Playtime idle;idle.start("sky",0);idle.activity(0);idle.tick(0,true);seconds(idle,0,400);
    assert(idle.totalSeconds()==300); // Exactly the five-minute inactivity allowance.
    idle.activity(400000);seconds(idle,400000,2);assert(idle.totalSeconds()==302);
    idle.stop(402000);idle.start("sky",500000);idle.activity(500000);idle.tick(500000,true);
    seconds(idle,500000,60);assert(idle.find("sky")->sessions==2 && idle.points()==10);

    auto a=p.snapshot();assert(Playtime::valid(a));p.persisted(a.sequence);
    p.activity(140000);seconds(p,140000,3);auto b=p.snapshot();
    Playtime restored;assert(restored.restore(a));assert(restored.restore(b));assert(!restored.restore(a));
    assert(restored.totalSeconds()==p.totalSeconds());
    b.records[0].seconds^=1;assert(!restored.restore(b)); // Torn/corrupt newest slot.
    Playtime fallback;assert(!fallback.restore(b));assert(fallback.restore(a));
    assert(fallback.totalSeconds()==71);
    auto duplicate=a;duplicate.records[1]=duplicate.records[0];duplicate.checksum=Playtime::checksum(duplicate);
    assert(!Playtime::valid(duplicate));
    assert(!Playtime::validId("../game/name") && !Playtime::validId(""));
    Playtime bounded;char name[32];
    for(unsigned i=0;i<70;++i) { snprintf(name,sizeof(name),"game%u",i);bounded.start(name,i*1000);bounded.activity(i*1000); }
    assert(bounded.snapshot().count==Playtime::kCapacity);
    puts("PLAYTIME PASS: first action, pause, idle, long loads, per-game sessions, once-only points, persistence, corrupt fallback, bounded IDs.");
}
