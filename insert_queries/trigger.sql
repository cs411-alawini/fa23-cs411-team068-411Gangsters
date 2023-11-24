DELIMITER //

CREATE TRIGGER check_username
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    DECLARE username_check INT;

    -- Create a temporary table to store inappropriate words
    CREATE TEMPORARY TABLE IF NOT EXISTS InappropriateWords (
        word VARCHAR(100)
    );

    -- Insert inappropriate words into the temporary table
    -- You should add your list of inappropriate words here
    INSERT INTO InappropriateWords (word) VALUES ('bitch'), ('fuck'), ('cunt');  -- Add your inappropriate words

    -- Check if the new username contains any inappropriate words
    SELECT COUNT(*) INTO username_check
    FROM InappropriateWords
    WHERE INSTR(LOWER(NEW.UserName), InappropriateWords.word) > 0;

    -- If the username contains inappropriate words, prevent insertion
    IF username_check > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Username contains inappropriate words. Please choose another username.';
    END IF;

    -- Drop the temporary table after use
    DROP TEMPORARY TABLE IF EXISTS InappropriateWords;
END//

DELIMITER ;