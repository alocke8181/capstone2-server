CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    admin BOOLEAN NOT NULL DEFAULT FALSE
)

CREATE TABLE characters(
    id SERIAL PRIMARY KEY,
    creatorID INTEGER NOT NULL
        REFERENCES users ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    race TEXT,
    subrace TEXT,
    class TEXT,
    alignment TEXT,
    level INTEGER,
    exp INTEGER CHECK (exp >= 0),

    strength INTEGER CHECK (strength >= 0),
    dexterity INTEGER CHECK (dexterity >= 0),
    constitution INTEGER CHECK (constitution >= 0),
    intelligence INTEGER CHECK (intelligence >= 0),
    wisdom INTEGER CHECK (wisdom >= 0),
    charisma INTEGER CHECK (charisma >= 0),

    profBonus INTEGER,
    savingProfs TEXT,
    skillProfs TEXT,
    jackOfAllTrades BOOLEAN DEFAULT FALSE,

    hpMax INTEGER CHECK (hpMax >= 0),
    hpCurr INTEGER CHECK (hpCurr >= 0),
    hpTemp INTEGER CHECK (hpTemp >= 0),
    hitDice INTEGER,
    hitDiceMax INTEGER CHECK (hitDiceMax >= 0),
    hitDiceCurr INTEGER CHECK (hitDiceCurr >= 0),
    deathSaveSuccess INTEGER CHECK (deathSaveSuccess >= 0),
    deathSaveFail INTEGER CHECK (deathSaveFail >= 0),

    personality VARCHAR(300),
    ideals VARCHAR(300),
    bonds VARCHAR(300),
    flaws VARCHAR(300),

    traits TEXT,
    languages TEXT,
    equipProfs TEXT,

    equipment TEXT,
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
    height VARCHAR(10),
    wght VARCHAR(10),
    eyes VARCHAR(10),
    skin VARCHAR(10),
    hair VARCHAR(10),
    backstory VARCHAR(1000),
    appearance VARCHAR(1000),
    allies VARCHAR(300)
)

CREATE TABLE users_chars (
    user_id INTEGER
        REFERENCES users ON DELETE CASCADE,
    char_id INTEGER
        REFERENCES characters ON DELETE CASCADE
    PRIMARY KEY (user_id, char_id)
)