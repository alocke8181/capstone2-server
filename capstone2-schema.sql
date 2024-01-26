CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE characters(
    id SERIAL PRIMARY KEY,
    creatorID INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    charName VARCHAR(100) NOT NULL,
    race TEXT,
    subrace TEXT,
    className TEXT,
    background TEXT,
    alignment TEXT,
    level INTEGER,
    exp INTEGER CHECK (exp >= 0),

    strength INTEGER CHECK (strength >= 0),
    dexterity INTEGER CHECK (dexterity >= 0),
    constitution INTEGER CHECK (constitution >= 0),
    intelligence INTEGER CHECK (intelligence >= 0),
    wisdom INTEGER CHECK (wisdom >= 0),
    charisma INTEGER CHECK (charisma >= 0),

    skillProfs TEXT,
    savingProfs TEXT,
    jackOfAllTrades BOOLEAN DEFAULT FALSE,

    armorClass INTEGER,
    hpMax INTEGER CHECK (hpMax >= 0),
    hpCurr INTEGER CHECK (hpCurr >= 0),
    hpTemp INTEGER CHECK (hpTemp >= 0),
    hitDiceCurr INTEGER CHECK (hitDiceCurr >= 0),
    deathSaveSuccess INTEGER CHECK (deathSaveSuccess >= 0),
    deathSaveFail INTEGER CHECK (deathSaveFail >= 0),

    personality VARCHAR(300),
    ideals VARCHAR(300),
    bonds VARCHAR(300),
    flaws VARCHAR(300),

    traits TEXT,
    features TEXT,
    languages TEXT,
    equipProfs TEXT,

    equipment TEXT,
    altResources TEXT,
    copper INTEGER CHECK (copper >= 0),
    silver INTEGER CHECK (silver >= 0),
    gold INTEGER CHECK (gold >= 0),

    attacks TEXT,

    spellAbility TEXT,
    spellSaveDC INTEGER,
    spellAtkBonus INTEGER,

    cantrips TEXT,
    levelOne TEXT,
    levelOneLeft INTEGER,
    levelTwo TEXT,
    levelTwoLeft INTEGER,
    levelThree TEXT,
    levelThreeLeft INTEGER,
    levelFour TEXT,
    levelFourLeft INTEGER,
    levelFive TEXT,
    levelFiveLeft INTEGER,
    levelSix TEXT,
    levelSixLeft INTEGER,
    levelSeven TEXT,
    levelSevenLeft INTEGER,
    levelEight TEXT,
    levelEightLeft INTEGER,
    levelNine TEXT,
    levelNineLeft INTEGER,

    age INTEGER,
    height VARCHAR(20),
    weight VARCHAR(10),
    backstory TEXT,
    appearance TEXT,
    allies TEXT
);

CREATE TABLE users_chars (
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    char_id INTEGER
        REFERENCES characters ON DELETE CASCADE,
    PRIMARY KEY (user_id, char_id)
);

CREATE TABLE custom_traits(
    id SERIAL PRIMARY KEY,
    charID INTEGER NOT NULL
        REFERENCES characters ON DELETE CASCADE,
    name TEXT,
    source TEXT,
    description TEXT
);

CREATE TABLE chars_custom_traits(
    char_id INTEGER
        REFERENCES characters ON DELETE CASCADE,
    trait_id INTEGER
        REFERENCES custom_traits ON DELETE CASCADE,
    PRIMARY KEY (char_id, trait_id)
);

CREATE TABLE custom_attacks(
    id SERIAL PRIMARY KEY,
    charID INTEGER NOT NULL
        REFERENCES characters ON DELETE CASCADE,
    name TEXT,
    attackSkill TEXT,
    attackMod INTEGER,
    isProf BOOLEAN,
    dmgDice INTEGER,
    numDice INTEGER,
    dmgSkill TEXT,
    dmgMod INTEGER,
    dmgType TEXT,
    altDmgDice INTEGER,
    altNumDice INTEGER,
    altDmgSkill TEXT,
    altDmgMod INTEGER,
    altDmgType TEXT,
    description TEXT,
    savingSkill TEXT,
    savingEffect TEXT
);

CREATE TABLE chars_custom_attacks(
    char_id INTEGER
        REFERENCES characters ON DELETE CASCADE,
    attack_id INTEGER
        REFERENCES custom_attacks ON DELETE CASCADE,
    PRIMARY KEY (char_id, attack_id)
);