const {convertAltResourcesOut, convertTraitsOut, convertFeaturesOut, convertEquipmentOut, convertSpellsOut, convertAttacksOut,
    convertAltResourcesIn, convertTraitsIn, convertFeaturesIn, convertEquipmentIn, convertSpellsIn, convertAttacksIn} = require('./characters');

//Tests for both outwards and inwards character conversions

describe('convertAltResources tests',()=>{
    test('Returns null on empty string',()=>{
        const output = convertAltResourcesOut([]);
        expect(output).toBeNull();

        const input = convertAltResourcesIn(output);
        expect(input).toBeNull();
    });
    test('Works on singular input', ()=>{
        const output = convertAltResourcesOut('1*1*bardic-inspiration');
        expect(output.length).toEqual(1);
        const resource = output[0];
        expect(resource.max).toEqual(1);
        expect(resource.curr).toEqual(1);
        expect(resource.name).toEqual('bardic inspiration');

        const input = convertAltResourcesIn(output);
        expect(input).toEqual('1*1*bardic-inspiration')
    })
    test('Works on multiple inputs',()=>{
        const output = convertAltResourcesOut('1*1*test-one_2*1*test-two');
        expect(output.length).toEqual(2);
        const res1 = output[0];
        const res2 = output[1];
        expect(res1.max).toEqual(1);
        expect(res1.curr).toEqual(1);
        expect(res1.name).toEqual('test one');
        expect(res2.max).toEqual(2);
        expect(res2.curr).toEqual(1);
        expect(res2.name).toEqual('test two');

        const input = convertAltResourcesIn(output);
        expect(input).toEqual('1*1*test-one_2*1*test-two');
    })
});

describe('convertTraits tests', ()=>{
    test('Works on empty string', async ()=>{
        const output = await convertTraitsOut([]);
        expect(output).toEqual(null);

        const input = convertTraitsIn(output);
        expect(input).toBeNull();
    });
    test('Works on custom trait', async ()=>{
        const output = await convertTraitsOut('custom-1');
        expect(output.length).toEqual(1);
        const trait = output[0];
        expect(trait.charID).toEqual(1);
        expect(trait.name).toEqual('Custome Trait 1'); //Yeah i did a typo in the seed file
        expect(trait.source).toEqual('Class');
        expect(trait.description).toEqual('This is the first custom trait!');

        const input = convertTraitsIn(output);
        expect(input).toEqual('custom-1');
    });
    test('Works on a pre-existing trait', async ()=>{
        const output = await convertTraitsOut('brave');
        expect(output.length).toEqual(1);
        const trait = output[0];
        expect(trait.index).toEqual('brave');
        expect(trait.name).toEqual('Brave');
        expect(trait.description).toEqual('You have advantage on saving throw against being frightened.')

        const input = convertTraitsIn(output);
        expect(input).toEqual('brave');
    });
    test('Works on multiple custom traits', async ()=>{
        const output = await convertTraitsOut('custom-1_custom-2');
        expect(output.length).toEqual(2);
        const trait1 = output[0];
        expect(trait1.charID).toEqual(1);
        expect(trait1.name).toEqual('Custome Trait 1'); //Yeah i did a typo in the seed file
        expect(trait1.source).toEqual('Class');
        expect(trait1.description).toEqual('This is the first custom trait!');
        const trait2 = output[1];
        expect(trait2.charID).toEqual(2);
        expect(trait2.name).toEqual('Custom Trait 2');
        expect(trait2.source).toEqual('Race');
        expect(trait2.description).toEqual('This is the second custom trait!');

        const input = convertTraitsIn(output);
        expect(input).toEqual('custom-1_custom-2');
    });
    test('Works on multiple pre-existing traits', async ()=>{
        const output = await convertTraitsOut('brave_darkvision');
        expect(output.length).toEqual(2);
        const trait1 = output[0];
        expect(trait1.index).toEqual('brave');
        expect(trait1.name).toEqual('Brave');
        expect(trait1.description).toEqual('You have advantage on saving throw against being frightened.');
        const trait2 = output[1];
        expect(trait2.index).toEqual('darkvision');
        expect(trait2.name).toEqual('Darkvision');
        expect(trait2.description).toContain('You have superior vision in dark and dim conditions.');

        const input = convertTraitsIn(output);
        expect(input).toEqual('brave_darkvision');
    });
    test('works on custom and pre-existing traits', async ()=>{
        const output = await convertTraitsOut('custom-1_brave');
        expect(output.length).toEqual(2);
        const trait1 = output[0];
        expect(trait1.charID).toEqual(1);
        expect(trait1.name).toEqual('Custome Trait 1'); //Yeah i did a typo in the seed file
        expect(trait1.source).toEqual('Class');
        expect(trait1.description).toEqual('This is the first custom trait!');
        const trait2 = output[1];
        expect(trait2.index).toEqual('brave');
        expect(trait2.name).toEqual('Brave');
        expect(trait2.description).toEqual('You have advantage on saving throw against being frightened.');

        const input = convertTraitsIn(output);
        expect(input).toEqual('custom-1_brave');
    });
    test('Fails correctly on 404 custom', async ()=>{
        const output = await convertTraitsOut('custom-404');
        expect(output.length).toEqual(1);
        const trait = output[0];
        expect(trait.name).toEqual('Custom Trait Not Found');
        expect(trait.description).toEqual('Error: No trait id: 404');
    });
    test('Fails correctly on 404 not custom', async ()=>{
        const output = await convertTraitsOut('asdf');
        expect(output.length).toEqual(1);
        const trait = output[0];
        expect(trait.name).toEqual('Trait Not Found');
        expect(trait.description).toEqual('No Path /api/traits/asdf');
    });
});

describe('convertFeatures tests',()=>{
    test('Returns null on empty string',async ()=>{
        const out = await convertFeaturesOut([]);
        expect(out).toEqual(null);

        const input = convertFeaturesIn(out);
        expect(input).toBeNull();
    });
    test('Works on one feature', async ()=>{
        const out = await convertFeaturesOut('archdruid');
        expect(out.length).toEqual(1);
        const feat = out[0];
        expect(feat.index).toEqual('archdruid');
        expect(feat.name).toEqual('Archdruid');
        expect(feat.description).toContain('At 20th level, you can use your Wild Shape an unlimited number of times.');

        const input = convertFeaturesIn(out);
        expect(input).toEqual('archdruid');
    });
    test('works on multiple features', async ()=>{
        const out = await convertFeaturesOut('archdruid_danger-sense');
        expect(out.length).toEqual(2);
        const feat1 = out[0];
        expect(feat1.index).toEqual('archdruid');
        expect(feat1.name).toEqual('Archdruid');
        expect(feat1.description).toContain('At 20th level, you can use your Wild Shape an unlimited number of times.');
        const feat2 = out[1];
        expect(feat2.index).toEqual('danger-sense');
        expect(feat2.name).toEqual('Danger Sense');
        expect(feat2.description).toContain("you gain an uncanny sense of when things nearby aren't as they should be");

        const input = convertFeaturesIn(out);
        expect(input).toEqual('archdruid_danger-sense');
    });
    test('Fails correctly on 404', async ()=>{
        const output = await convertFeaturesOut('asdf');
        expect(output.length).toEqual(1);
        const feat = output[0];
        expect(feat.name).toEqual('Feature Not Found');
        expect(feat.description).toEqual('No Path /api/features/asdf');
    });
});

describe('convertEquipment tests',()=>{
    test('Returns null on empty equipment', ()=>{
        const out = convertEquipmentOut([]);
        expect(out).toEqual(null);

        const input = convertEquipmentIn(out);
        expect(input).toBeNull()
    });
    test('Works', ()=>{
        const out = convertEquipmentOut('1*bedroll_50*feet-of-rope');
        expect(out.length).toEqual(2);
        const equip1 = out[0];
        expect(equip1.name).toEqual('bedroll');
        expect(equip1.amount).toEqual(1);
        const equip2 = out[1];
        expect(equip2.name).toEqual('feet of rope');
        expect(equip2.amount).toEqual(50);

        const input = convertEquipmentIn(out);
        expect(input).toEqual('1*bedroll_50*feet-of-rope');
    });
});

describe('convertSpells tests', ()=>{
    test('Returns null on empty string',async ()=>{
        const out = await convertSpellsOut([]);
        expect(out).toEqual(null);

        const input = convertSpellsIn(out);
        expect(input).toBeNull();
    });
    test('Works with one spell', async ()=>{
        const out = await convertSpellsOut('fire-bolt');
        expect(out.length).toEqual(1);
        const spell = out[0];
        expect(spell.index).toEqual('fire-bolt');
        expect(spell.name).toEqual('Fire Bolt');
        expect(spell.description).toContain("This spell's damage increases by 1d10 when you reach 5th level");

        const input = convertSpellsIn(out);
        expect(input).toEqual('fire-bolt');
    });
    test('Works with multiple spells', async()=>{
        const out = await convertSpellsOut('fire-bolt_fireball');
        expect(out.length).toEqual(2);
        const spell1 = out[0];
        expect(spell1.index).toEqual('fire-bolt');
        expect(spell1.name).toEqual('Fire Bolt');
        expect(spell1.description).toContain("This spell's damage increases by 1d10 when you reach 5th level");
        const spell2 = out[1];
        expect(spell2.index).toEqual('fireball');
        expect(spell2.name).toEqual('Fireball');
        expect(spell2.description).toContain("The fire spreads around corners.");

        const input = convertSpellsIn(out);
        expect(input).toEqual('fire-bolt_fireball');
    });
});

describe('convertAttacks tests', ()=>{
    test('Returns null on empty string', async ()=>{
        const out = await convertAttacksOut([]);
        expect(out).toEqual(null);

        const input = convertAttacksIn(out);
        expect(input).toBeNull();
    });
    test('Works for custom attack', async ()=>{
        const out = await convertAttacksOut('custom-1');
        expect(out.length).toEqual(1);
        const atk = out[0];
        expect(atk.name).toEqual('Atk 1');
        expect(atk.isProf).toEqual(true);
        expect(atk.description).toEqual('Custom attack 1 for Gale');

        const input = convertAttacksIn(out);
        expect(input).toEqual('custom-1');
    });
    test('Works on standard attack',async ()=>{
        const out = await convertAttacksOut('longsword');
        expect(out.length).toEqual(1);
        const atk = out[0];
        expect(atk.index).toEqual('longsword');
        expect(atk.two_handed_damage).not.toBeNull();

        const input = convertAttacksIn(out);
        expect(input).toEqual('longsword');
    });
    test('Works with custom + standard attacks', async ()=>{
        const out = await convertAttacksOut('longsword_custom-1');
        expect(out.length).toEqual(2);
        const atk1 = out[1];
        expect(atk1.index).toEqual('longsword');
        expect(atk1.two_handed_damage).not.toBeNull();
        const atk2 = out[0];
        expect(atk2.name).toEqual('Atk 1');
        expect(atk2.isProf).toEqual(true);
        expect(atk2.description).toEqual('Custom attack 1 for Gale');

        const input = convertAttacksIn(out);
        expect(input).toEqual('custom-1_longsword');
    });
    test('Fails correctly with custom attacks', async ()=>{
        const out = await convertAttacksOut('custom-404');
        expect(out.length).toEqual(1);
        const atk = out[0]
        expect(atk.name).toEqual('Custom Attack Not Found');
        expect(atk.description).toEqual('Error: No attack id: 404');
    })
    test('Fails correctly with standard attacks', async ()=>{
        const out = await convertAttacksOut('asdf');
        expect(out.length).toEqual(1);
        const atk = out[0]
        expect(atk.name).toEqual('Attack Not Found');
        expect(atk.description).toEqual('No Path /api/equipment/asdf');
    })
})