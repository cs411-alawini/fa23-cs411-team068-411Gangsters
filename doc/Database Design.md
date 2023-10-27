# Database Implementation and Indexing

## Database DDL Commands

```mysql
CREATE database navigator;

USE navigator;


CREATE TABLE Users(	UserId INT,  
UserName VARCHAR(100), 
Password VARCHAR(255),
PRIMARY KEY(UserId)
);
CREATE TABLE Routes(RouteId VARCHAR(10),
	RouteShortName VARCHAR(10),
	RouteLongName VARCHAR(255),
	RouteType INT,
	RouteColor VARCHAR(6),
	RouteTextColor VARCHAR(6),
  PRIMARY KEY(RouteId)
);
CREATE TABLE Trips(	TripId VARCHAR(10),
	RouteId VARCHAR(10),
	ServiceId VARCHAR(3),
	TripHeadsign VARCHAR(255),
	DirectionId INT,
	ShapeId INT,
  PRIMARY KEY(TripId, ShapeId),
  FOREIGN KEY(RouteId) REFERENCES Routes(RouteId) ON DELETE CASCADE 
);
CREATE TABLE Calendar( ServiceId VARCHAR(3), Monday INT, Tuesday INT,  Wednesday INT, Thursday INT, Friday INT, Saturday INT, Sunday INT, StartDate VARCHAR(10), EndDate VARCHAR(10), PRIMARY KEY(ServiceId));
CREATE TABLE Shapes( ShapeId INT, 
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
	FOREIGN KEY (StopId) REFERENCES Stops(StopId) ON DELETE CASCADE,
	FOREIGN KEY (TripId) REFERENCES Trips(TripId) ON DELETE CASCADE
);

CREATE TABLE FareAttributes( FareId VARCHAR(255),
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
	FOREIGN KEY(RouteId) REFERENCES Routes(RouteId) ON DELETE CASCADE,
	FOREIGN KEY(FareId) REFERENCES FareAttributes(FareId) ON DELETE CASCADE

);

CREATE TABLE Reviews ( RouteId VARCHAR(10),
	    UserId INT,
            Comments VARCHAR(1000),
	    starRating INT,
	    FOREIGN KEY(RouteId) REFERENCES Routes(RouteId) ON DELETE CASCADE,
	    FOREIGN KEY(UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

```
Using the above implementation in the GCP SQL Database, we get the following image:
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/73099341/090f2e34-c902-44f7-b33a-a0e6656480ea)

For proof of implementation take the following COUNTs of the following four tables:
![image](https://github.com/cs411-alawini/fa23-cs411-team068-411Gangsters/assets/73099341/1baa54c6-2751-43bf-adfd-d174c5f4e5be)


The following are the Advanced SQL Queries that we implemented for this project:
Fare Calculation Query once we have the wanted routes:
```mysql

```
User Route Input
```
```
