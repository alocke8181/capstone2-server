INSERT INTO users (username, pwd, email, isAdmin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'user@test.com',
        FALSE),
        ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'admin@admin.com',
        TRUE);

INSERT INTO characters (creatorID, charName, race, subrace, class, background, alignment, lvl, exp,
                        strength, dexterity, constitution, intelligence, wisdom, charisma,
                        skillProfs, savingProfs,
                        hpMax, hpCurr, hpTemp, hitDiceCurr, deathSaveSuccess, deathSaveFail, 
                        personality, 
                        ideals, 
                        bonds, 
                        flaws, 
                        traits, languages, equipProfs, 
                        equipment,
                        copper, silver, gold, 
                        attacks, spellAbility,
                        cantrips, levelOne, levelOneLeft, levelTwo, levelTwoLeft,
                        levelThree, levelThreeLeft, levelFour, levelFourLeft, levelFive, levelFiveLeft,
                        levelSix, levelSixLeft, levelSeven, levelSevenLeft, levelEight, levelEightLeft, levelNine, levelNineLeft
                        age, height, wght, eyes, skin, hair, 
                        backstory, 
                        appearance, 
                        allies)
VALUES (1, 'Gale Dekarios','human','', 'wizard','sage','Lawful Good',1,0,
        9,14,15,16,11,13,
        'arcana_history_insight_investigation','intelligence_wisdom'
        8,8,0,1,0,0,
        'Values intellect and magic',
        'Wisdom and respecting magic',
        'Mystra, Elminster',
        'Netherise Orb',
        'arcane-recovery_researcher','celestial_common_draconic_giant','crossbow_light-weapons_dagger_dart_quarterstaff_sling',
        '1*quaterstaff_1*robes_1*spellbook_1*bedroll_1*ink_1*ink-pen_1*lantern_1*mess-kit_10*rations_50*rope_1*tinderbox_1*waterskin',
        50,10,100,
        'quarterstaff_fire-bolt_ray-of-frost','intelligence',13,5,
        'fire-bolt_ray-of-frost_mage-hand','charm-person_feather-fall',2,'',0,'',0,'',0,'',0,'',0,'',0,'',0,'',0,
        38, '5 ft. 6 in.','medium','brown','peach','brown mullet',
        "Whats a god to a world-class wizard? Gale was once a formidable archmage in Waterdeep, 
        but pushed his relationship with the goddess Mystra too far. Not satisfied with being her lover, 
        Gale tried to impress her further and meddled with powers beyond even his abilities, 
        his attempt leaving him cursed with an orb of Netherese magic trapped inside his body. 
        The cataclysmic power of the orb has turned Gale into a weapon capable of annihilating an entire city, 
        should he fail to control himself.Wracked with shame for his hubris, G
        ale retreated to his tower, first out of self-pity, and then out of necessity. 
        His research led him to a means of keeping the orb's power contained, but only temporarily. 
        Now, with the threat of ceremorphosis looming large can Gale see off both of the grim fates lurking within him, 
        or is he doomed at every turn?",
        "Brown mullet and unshaven beard.",
        "Tara the tressym is far more than Gales pet; she has been his only advisor and friend since he was brought low by the orb. 
        Tease him though she might, Tara will do everything she can to keep Gale safe. Just don't say shes a cat."),
        (1, 'Karlach','tiefling','','barbarian','soldier','chaotic good',1,0,
        17,13,15,8,12,10,
        'animal-handling_athletics_intimidation_perception','constitution_strength'
        14,14,0,1,0,0,
        'Karlach is overwhelmed by her good fortune at every turn: she had given up on leaving Hell, but now finds old scars might heal after all.',
        'Karlach hasnt lived in a long time, and feels she has a lot of catching up to do. Any experience, any sensation, any connection she can have will mean everything to her.',
        'The Archdevil Zariel still values Karlach as one of her prize inventions, and the engine in her body is a miraculous feat of engineering to a collector with a fine eye.',
        'Her own mechanical heart is what allows Karlach to turn any battle into wraths inferno, but she burns herself up with no regard for her own life.',
        'rage_barbarian-unarmored-defence_darkvision_hellish-resistance_infernal-legacy_military-rank','common_infernal','light-armor_medium-armor_shields_martial-weapons_simple-weapons_dice-set_vehicles-land',
        '1*common-clothes_1*greataxe_2*javelin_1*studded-leather_1*bedroll_1*mess-kit_5*rations_50*rope_1*tinderbox_1*torch_1*waterskin',
        10,20,30,
        'greataxe_javelin','',
        '','',0,'',0,'',0,'',0,'',0,'',0,'',0,'',0,'',0,
        40,'6 ft. 2 in.','medium','orange','red','black with red highlights',
        'Fresh-escaped from Hell, Karlach is finally free of the Archdevil Zariel - but not from the infernal engine Zariel planted in her chest. 
        With her first taste of freedom in ten years, Karlach is eager to find a fix for the engine thats burning hotter and hotter before it burns her out completely. 
        But even more premiere in her mind? Exploring, finding like-minded travelers, falling in love (or lust)... and taking revenge on the man who sold her to Zariel all those years ago.',
        'l;kfgjdksjfhgjksadhfljkhsadlkufjsad;iflfjksjldhfujksadhfiukjshdjkjufjsadf',
        'Hell isnt done with Karlach yet. Ever since reaching the Material Plane, shes found the engine in her body is behaving strangely. 
        She wishes to make an ally of an infernal mechanic who can dial down the blaze.')