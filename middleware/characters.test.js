const {convertAltResources, convertTraits, convertFeatures, convertEquipment, convertSpells, convertAttacks} = require('./characters');

describe('convertAltResources tests',()=>{
    test('Returns null on empty string',()=>{
        const output = convertAltResources([]);
        expect(output).toEqual(null);
    });
    test('Works on singular input', ()=>{
        const output = convertAltResources(['1*1*bardic-inspiration']);
        expect(output.length).toEqual(1);
        const resource = output[0];
        expect(resource.max).toEqual(1);
        expect(resource.curr).toEqual(1);
        expect(resource.name).toEqual('bardic inspiration');
    })
    test('Works on multiple inputs',()=>{
        const output = convertAltResources(['1*1*test-one','2*1*test-two']);
        expect(output.length).toEqual(2);
        const res1 = output[0];
        const res2 = output[1];
        expect(res1.max).toEqual(1);
        expect(res1.curr).toEqual(1);
        expect(res1.name).toEqual('test one');
        expect(res2.max).toEqual(2);
        expect(res2.curr).toEqual(1);
        expect(res2.name).toEqual('test two');
    })
});

describe('convertTraits tests', ()=>{
    test('Works on empty list', async ()=>{
        const output = await convertTraits([]);
        expect(output).toEqual(null);
    });
    test('Works on custom trait', async ()=>{
        const output = await convertTraits(['custom-1']);
        expect(output.length).toEqual(1);
        const trait = output[0];
        expect(trait.charID).toEqual(1);
        expect(trait.name).toEqual('Custome Trait 1'); //Yeah i did a typo in the seed file
        expect(trait.source).toEqual('Class');
        expect(trait.description).toEqual('This is the first custom trait!');
    });
    test('Works on a pre-existing trait', async ()=>{
        const output = await convertTraits(['brave']);
        expect(output.length).toEqual(1);
        const trait = output[0];
        expect(trait.index).toEqual('brave');
        expect(trait.name).toEqual('Brave');
        expect(trait.description).toEqual('You have advantage on saving throw against being frightened.')
    });
    test('Works on multiple custom traits', async ()=>{
        const output = await convertTraits(['custom-1','custom-2']);
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
    });
    test('Works on multiple pre-existing traits', async ()=>{
        const output = await convertTraits(['brave','darkvision']);
        expect(output.length).toEqual(2);
        const trait1 = output[0];
        expect(trait1.index).toEqual('brave');
        expect(trait1.name).toEqual('Brave');
        expect(trait1.description).toEqual('You have advantage on saving throw against being frightened.');
        const trait2 = output[1];
        expect(trait2.index).toEqual('darkvision');
        expect(trait2.name).toEqual('Darkvision');
        expect(trait2.description).toContain('You have superior vision in dark and dim conditions.');
    });
    test('works on custom and pre-existing traits', async ()=>{
        const output = await convertTraits(['custom-1','brave']);
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
    });
    test('Fails correctly on 404 custom', async ()=>{
        const output = await convertTraits(['custom-404']);
        expect(output.length).toEqual(1);
        const trait = output[0];
        expect(trait.name).toEqual('Custom Trait Not Found');
        expect(trait.description).toEqual('Error: No trait id: 404');
    });
    test('Fails correctly on 404 not custom', async ()=>{
        const output = await convertTraits(['asdf']);
        expect(output.length).toEqual(1);
        const trait = output[0];
        expect(trait.name).toEqual('Trait Not Found');
        expect(trait.description).toEqual('No Path /api/traits/asdf');
    });
});

describe('convertFeatures tests',()=>{
    test('Returns null on empty list',async ()=>{
        const out = await convertFeatures([]);
        expect(out).toEqual(null);
    });
    test('Works on one feature', async ()=>{
        const out = await convertFeatures(['archdruid']);
        expect(out.length).toEqual(1);
        const feat = out[0];
        expect(feat.index).toEqual('archdruid');
        expect(feat.name).toEqual('Archdruid');
        expect(feat.description).toContain('At 20th level, you can use your Wild Shape an unlimited number of times.');
    });
    test('works on multiple features', async ()=>{
        const out = await convertFeatures(['archdruid','danger-sense']);
        expect(out.length).toEqual(2);
        const feat1 = out[0];
        expect(feat1.index).toEqual('archdruid');
        expect(feat1.name).toEqual('Archdruid');
        expect(feat1.description).toContain('At 20th level, you can use your Wild Shape an unlimited number of times.');
        const feat2 = out[1];
        expect(feat2.index).toEqual('danger-sense');
        expect(feat2.name).toEqual('Danger Sense');
        expect(feat2.description).toContain("you gain an uncanny sense of when things nearby aren't as they should be");
    });
    test('Fails correctly on 404', async ()=>{
        const output = await convertFeatures(['asdf']);
        expect(output.length).toEqual(1);
        const feat = output[0];
        expect(feat.name).toEqual('Feature Not Found');
        expect(feat.description).toEqual('No Path /api/features/asdf');
    });
});

describe('convertEquipment tests',()=>{
    test('Returns null on empty equipment', ()=>{
        const out = convertEquipment([]);
        expect(out).toEqual(null);
    });
    test('Works', ()=>{
        const out = convertEquipment(['1*bedroll','50*feet-of-rope']);
        expect(out.length).toEqual(2);
        const equip1 = out[0];
        expect(equip1.name).toEqual('bedroll');
        expect(equip1.amount).toEqual(1);
        const equip2 = out[1];
        expect(equip2.name).toEqual('feet of rope');
        expect(equip2.amount).toEqual(50);
    })
})