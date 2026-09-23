// Run: node tools/test_installer.mjs /path/to/the/freeware/ZIPs
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { GAME_PROFILES, extractGame, verifyPackage } from '../site/pkg.js';
import { gameInstallPlan, inventory, completeSelection } from '../site/install-plan.js';
async function testInfoGate() {
 const { Tab5Serial } = await import('../site/serial-installer.js');
 const protocol = new Tab5Serial(); protocol.line = async () => {};
 for(const version of [2,3,4,5,6,7]) {
  protocol.protocolLine = async () => `T5A1 INFO ${version}`;
  assert.equal(await protocol.info(version),version);
  for(let minimum=version+1;minimum<=7;minimum++)
   await assert.rejects(() => protocol.info(minimum), /firmware-update-required/);
 }
 protocol.protocolLine = async () => 'T5A1 ERROR unknown-command';
 await assert.rejects(() => protocol.info(7), /firmware-update-required/);
 console.log('PASS firmware profile gate: INFO2-6 retained, INFO7 Curse, malformed reply rejected');
}
await testInfoGate();
if(process.argv[2]==='--info-only')process.exit(0);
const folder=process.argv[2];
if(!folder)throw new Error('Provide the directory with the twelve unchanged ZIP archives.');
for(const id of Object.keys(GAME_PROFILES).filter(id=>GAME_PROFILES[id].packageFormat==='zip')) {
 const profile=GAME_PROFILES[id], blob=new Blob([fs.readFileSync(path.join(folder,profile.packageName))]);
 await verifyPackage(blob,profile);
 const files=await extractGame(blob,profile);
 assert.equal(files.length,profile.files.length);
 console.log('PASS archive and every file SHA:',id,files.length);
}
await assert.rejects(()=>extractGame(new Blob(['bad']),GAME_PROFILES.soltys),/unknown-package/);
const profile=GAME_PROFILES.soltys;
assert.equal(gameInstallPlan(inventory([]),profile).mode,'new');
assert.equal(gameInstallPlan(inventory(['T5A1 ITEM F 1 games/soltys/.tab5adv-installing']),profile).mode,'recovery');
assert.throws(()=>gameInstallPlan(inventory(['T5A1 ITEM F 50176 games/soltys/vol.cat']),profile),/existing-files/);
assert.throws(()=>gameInstallPlan(inventory(['T5A1 ITEM F 1 games/soltys/game.json']),profile),/incomplete/);
const complete=['T5A1 ITEM F 1 games/soltys/game.json',...profile.files.map(f=>`T5A1 ITEM F ${f.size} games/soltys/${f.name}`)];
assert.equal(gameInstallPlan(inventory(complete),profile).mode,'installed');
const withSaves=inventory([...complete,'T5A1 ITEM F 99 scummvm/saves/SKY-VM.001']);
assert.equal(gameInstallPlan(withSaves,GAME_PROFILES.sfinx).mode,'new');
assert.equal(withSaves.get('scummvm/saves/SKY-VM.001').size,99);
console.log('PASS invalid archive, new/recovery/collision/incomplete/installed/additional-game plans');

const music=GAME_PROFILES.drascula_music;
assert.throws(()=>completeSelection(['drascula'],inventory([])),/music-required/);
assert.throws(()=>completeSelection(['drascula_music'],inventory([])),/music-requires-game/);
assert.deepEqual(completeSelection(['drascula','drascula_music'],inventory([])),['drascula_music','drascula']);
const base=GAME_PROFILES.drascula;
const baseCard=inventory(['T5A1 ITEM F 1 games/drascula/game.json',...base.files.map(f=>`T5A1 ITEM F ${f.size} games/drascula/${f.name}`)]);
assert.deepEqual(completeSelection(['drascula_music'],baseCard),['drascula_music','drascula']);
const musicPlan=gameInstallPlan(baseCard,music);
assert.equal(musicPlan.root,'games/drascula/');assert.equal(musicPlan.receipt,'games/drascula/music.json');assert.equal(musicPlan.mode,'new');
assert.equal(gameInstallPlan(baseCard,base).mode,'installed');
console.log('PASS Drascula pair: missing dependency, existing base, separate receipt, music before new game publication');
