\echo 'Creating trazi_db database and schema...'
DROP DATABASE trazi_db;
CREATE DATABASE trazi_db;
\connect trazi_db

-- create CITY table
CREATE TABLE city ( 
	id 			SERIAL 		    PRIMARY KEY,
	city 	    VARCHAR(100)    NOT NULL,
	state 	    VARCHAR(50)     NOT NULL,
	population 	INTEGER 	    NOT NULL DEFAULT 0
);
\echo 'trazi_db database and schema created...'
\q