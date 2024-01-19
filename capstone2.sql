\echo 'Delete and recreate capstone2 db?'
\prompt 'Yes or ctr-c to canx > ' foo

DROP DATABASE capstone2;
CREATE DATABASE capstone2;
\connect capstone2;

\i capstone2-schema.sql;
\i capstone2-seed.sql;

\echo 'same for test db?'
\prompt 'yes or ctr-c to canx > ' foo

DROP DATABASE capstone2_test;
CREATE DATABASE capstone2_test;
\connect capstone2_test

\i capstone2-schema.sql