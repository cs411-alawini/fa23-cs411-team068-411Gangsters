DELIMITER //

CREATE PROCEDURE StoreAverageRatings()
BEGIN
    DECLARE avgRating REAL;
    DECLARE routeId VARCHAR(10);
    DECLARE done INT DEFAULT 0;
    DECLARE route_qualifier VARCHAR(55);
    DECLARE curRoute CURSOR FOR SELECT r.RouteId, AVG(re.starRating) FROM Routes r NATURAL JOIN Reviews re GROUP BY r.RouteId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    DROP TABLE IF EXISTS NewTable;

    CREATE TABLE NewTable (
        routeID VARCHAR(10) PRIMARY KEY,
        avgRating REAL,
        route_qualifier VARCHAR(55)
    );

    OPEN curRoute;

    REPEAT 
        FETCH curRoute INTO routeId, avgRating;
        
        IF avgRating > 4 THEN
            SET route_qualifier = 'Great Route!';
        ELSEIF avgRating > 3 THEN
            SET route_qualifier = 'Mid Route';
        ELSEIF avgRating > 2 THEN 
            SET route_qualifier = 'Bad Route';
        ELSE 
            SET route_qualifier = 'Avoid Whenever Possible';
        END IF;
        
        INSERT IGNORE INTO NewTable
        VALUES (routeId, avgRating, route_qualifier);
        
    UNTIL done
    END REPEAT;
    
    CLOSE curRoute;

    SELECT ANY_VALUE(n.route_qualifier) as qualifier, r.RouteLongName
    from NewTable n
    left join Routes r on r.RouteId =  n.routeID
    group by route_qualifier, r.RouteLongName, n.avgRating
    order by avgRating DESC
    limit 100;


END //

DELIMITER ;
