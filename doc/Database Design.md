# Database Implementation and Indexing

## Database DDL Commands

This database is heavily based off of the General Transit Specification Data format: https://gtfs.org/schedule/examples/routes-stops-trips/

```MySQL
CREATE database navigator;

USE navigator;

CREATE TABLE Users(
	UserId INT AUTO_INCREMENT,  
	UserName VARCHAR(100), 
	Password VARCHAR(255),
	PRIMARY KEY(UserId)
);

CREATE TABLE Routes(
	RouteId VARCHAR(10),
	RouteShortName VARCHAR(10),
	RouteLongName VARCHAR(255),
	RouteType INT,
	RouteColor VARCHAR(6),
	RouteTextColor VARCHAR(6),
        PRIMARY KEY(RouteId)
);

CREATE TABLE Trips(
	TripId VARCHAR(10),
	RouteId VARCHAR(10),
	ServiceId VARCHAR(3),
	TripHeadsign VARCHAR(255),
	DirectionId INT,
	ShapeId INT,
        PRIMARY KEY(TripId, ShapeId),
        FOREIGN KEY(RouteId) REFERENCES Routes(RouteId) ON DELETE CASCADE 
);

CREATE TABLE Calendar( ServiceId VARCHAR(3), Monday INT, Tuesday INT,  Wednesday INT, Thursday INT, Friday INT, Saturday INT, Sunday INT, StartDate VARCHAR(10), EndDate VARCHAR(10), PRIMARY KEY(ServiceId));

CREATE TABLE Shapes(
	ShapeId INT, 
	ShapePtLat REAL, 
	ShapePtLon REAL, 
	ShapePtSequence INT, 
	ShapeDistTraveled REAL,
        PRIMARY KEY(ShapeId, ShapePtSequence)
);

CREATE TABLE Frequencies (
	FrequencyId INT,
	TripId VARCHAR(10),
	StartTime VARCHAR(8),
	EndTime VARCHAR(8),
	HeadwaySecs INT,
        PRIMARY KEY(FrequencyId),
        FOREIGN KEY (TripId) REFERENCES Trips(TripId) ON DELETE CASCADE
);

CREATE TABLE Stops ( StopId INT,
	StopName VARCHAR(255),
	StopDesc VARCHAR(255),
	StopLon REAL,
	StopLat REAL,
	PRIMARY KEY(StopId)
);

CREATE TABLE StopTimes (StopId INT,
	TripId VARCHAR(10),
	ArrivalTime VARCHAR(8),
	DepartureTime VARCHAR(8),
	StopSequence INT,
       PRIMARY KEY(TripId, StopSequence),
       FOREIGN KEY (StopId) REFERENCES Stops(StopId) ON DELETE CASCADE,
       FOREIGN KEY (TripId) REFERENCES Trips(TripId) ON DELETE CASCADE
);

CREATE TABLE FareAttributes(
	FareId VARCHAR(255),
	Price DEC,
	CurrencyType VARCHAR(3),
	PaymentMethod INT,
	Transfers VARCHAR(255),
	TransferDuration INT,
        PRIMARY KEY(FareId)
);

CREATE TABLE FareRules(  RouteId VARCHAR(10), 
      	FareId VARCHAR(255),
	OriginId VARCHAR(255),
	DestinationId VARCHAR(255),
	ContainsId VARCHAR(255),
        PRIMARY KEY(RouteId, FareId),
        FOREIGN KEY(RouteId) REFERENCES Routes(RouteId) ON DELETE CASCADE,
        FOREIGN KEY(FareId) REFERENCES FareAttributes(FareId) ON DELETE CASCADE

);

CREATE TABLE Reviews (
	RouteId VARCHAR(10),
	UserId INT,
	Comments VARCHAR(1000),
	starRating INT,
        PRIMARY KEY(RouteId, UserId),
        FOREIGN KEY(RouteId) REFERENCES Routes(RouteId) ON DELETE CASCADE,
        FOREIGN KEY(UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

```
Using the above implementation in the GCP SQL Database, we get the following image:
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/73099341/090f2e34-c902-44f7-b33a-a0e6656480ea)

For proof of implementation take the following COUNTs of the following four tables:
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/73099341/1baa54c6-2751-43bf-adfd-d174c5f4e5be)


# Advanced SQL Queries

## First Query

The following are the Advanced SQL Queries that we implemented for this project:

Review Pull Query that returns the top 15 routes and the number of each Ratings they got for each starRating from 1 to 5:
```mysql
SELECT 
    r.RouteId,
    SUM(CASE WHEN rv.starRating = 5 THEN 1 ELSE 0 END) AS FiveStarRatings,
    SUM(CASE WHEN rv.starRating = 4 THEN 1 ELSE 0 END) AS FourStarRatings,
    SUM(CASE WHEN rv.starRating = 3 THEN 1 ELSE 0 END) AS ThreeStarRatings,
    SUM(CASE WHEN rv.starRating = 2 THEN 1 ELSE 0 END) AS TwoStarRatings,
    SUM(CASE WHEN rv.starRating = 1 THEN 1 ELSE 0 END) AS OneStarRatings
FROM Routes r
LEFT JOIN Reviews rv ON r.RouteId = rv.RouteId
GROUP BY r.RouteId
LIMIT 15;
```

Running the above query will yield the following results:

![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/73099341/965edfce-18bf-4394-8469-282d61f637b5)

Here we simply organize the number of each rating value per route. By doing so, we can easily get the values for any route and display it onto the screen.
Values will be updated per any additional input review on that specific route. 

## Second Query

This query is used to find a List of all Stops and the next closest departure from each Stop on/for a certain Trip based on the StopTimes Table
```mysql
select RouteLongName, StopId, n.StopName,
CASE
WHEN MIN(TIMEDIFF(STR_TO_DATE(DepartureTime, "%T"), DATE_ADD(CURRENT_TIME, INTERVAL -3 HOUR))) < 0 THEN 'Next Closest Departure is Tomorrow'
ELSE TIME_FORMAT(MIN(TIMEDIFF(STR_TO_DATE(DepartureTime, "%T"), DATE_ADD(CURRENT_TIME, INTERVAL -3 HOUR))), '%H hours %i minutes %i seconds')
END AS Time_To_Departure 
from Trips 
left join Routes using (RouteId) 
left join StopTimes using (TripId) 
left join (select StopName, StopId from Stops) n using(StopId) 
where RouteLongName like '%Jd. Fontális - Metrô Santana%'
group by StopId, n.StopName, RouteLongName
Order by Time_To_Departure
Limit 15;
```

Running the above query on a route of Jd. Fontális - Metrô Santana returns the following results.
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/51918698/b8aa4df0-2d79-480a-90a3-723307200d2d)

The query can be modified very slightly by adding an additional condition to take into account when a user enters a stop Name. For example when the user enters a particular stop (R. Augusto Rodrigues, 873) we can run this query

```mysql
select RouteLongName, StopId, n.StopName,
CASE
WHEN MIN(TIMEDIFF(STR_TO_DATE(DepartureTime, "%T"), DATE_ADD(CURRENT_TIME, INTERVAL -3 HOUR))) < 0 THEN 'Next Closest Departure is Tomorrow'
ELSE TIME_FORMAT(MIN(TIMEDIFF(STR_TO_DATE(DepartureTime, "%T"), DATE_ADD(CURRENT_TIME, INTERVAL -3 HOUR))), '%H hours %i minutes %i seconds')
END AS Time_To_Departure 
from Trips 
left join Routes using (RouteId) 
left join StopTimes using (TripId) 
left join (select StopName, StopId from Stops) n using(StopId) 
where RouteLongName like '%Jd. Fontális - Metrô Santana%'
group by StopId, n.StopName, RouteLongName
Having n.StopName like '%R. Augusto Rodrigues, 873%'
Order by Time_To_Departure
Limit 15;
```

Running the query using stop R. Augusto Rodrigues, 873 return the following output
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/51918698/59405e08-7052-4018-a76a-01d647d4f0f1)



# Indexing

## First Query

For the first advanced query, below is the output on running `EXPLAIN ANALYZE`.

![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/34684132/699ea56f-c1af-4c87-8d57-6c3fc7a82000)

Below are indexing designs we tried for first advanced query:

1. Created index on `Reviews.starRating` because it was in the `CASE WHEN` clause. This reduced time taken by 0.01 seconds.
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/34684132/762a77c3-9e2f-4aa0-b1d4-3c1ea83cbafd)



We don’t need to create an index on `Routes.RouteId` because it is a primary key and MySQL appears to automatically create an index for it.

<b>NOTE: We only have one attribute on which we can create an index, which did not already exist, and therefore, we have only one indexing design for this query that we have to choose from and that will be the one we will use. </b>


## Second Query

For the second advanced query, below is the output on running `EXPLAIN ANALYZE`.

![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/34684132/85e8d766-5edc-480d-bd82-83f4daea0a86)

Below are the indexing designs we tried for the second advanced query:

1. Created index on `Stops.StopName` because it is present in the `GROUP BY` clause. This reduced time taken by 0.02 seconds.
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/34684132/98e7c681-06eb-419e-b0e2-71b2f0a768a3)


2. Created index on `Routes.RouteLongName` because it is present in the `WHERE` and `GROUP BY` clauses. This reduced time taken by 0.02 seconds.
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/34684132/10b84e42-ef46-43ae-ae1e-35d137ba52dc)


3. Created index on both `Routes.RouteLongName` and `Stops.StopName` since since they are present in the `WHERE` and `GROUP BY` clauses. This reduced time taken by 0.02 seconds.
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/34684132/b4e39847-02b6-405f-ad76-9cba4668b778)


We didn’t need to create an index for `StopTimes.StopId` because it is a foreign key and MySQL appears to automatically create an index for it.

As we can see, the indexing analysis for the second advanced query shows that all three indexing design yield similar results in terms of the time taken for execution. This is probably because making either one of `Routes.RouteLongName` or `Stops.StopName` an index is enough for the query to run efficiently. The rest of the time contribution is probably due to other parts of the query. Since we can choose any of these three indexing designs due to their similar effects execution time, we randomly choose the third design.




