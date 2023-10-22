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
CREATE TABLE Routes(RouteId VARCHAR(7),
	RouteShortName VARCHAR(7),
	RouteLongName VARCHAR(255),
	RouteType INT,
	RouteColor VARCHAR(6),
	RouteTextColor VARCHAR(6),
  PRIMARY KEY(RouteId)
);
CREATE TABLE Trips(	TripId VARCHAR(10),
	RouteId VARCHAR(7),
	ServiceId VARCHAR(3),
	TripHeadsign VARCHAR(255),
	DirectionId INT,
	ShapeId INT,
  PRIMARY KEY(TripId, ShapeId),
  FOREIGN KEY(RouteId) REFERENCES Routes(RouteId) ON DELETE CASCADE 
);
Calendar( ServiceId VARCHAR(3) [PK], Monday INT, Tuesday INT,  Wednesday INT, Thursday INT, Friday INT, Saturday INT, Sunday INT, StartDate VARCHAR(10), EndDate VARCHAR(10))
Shapes( ShapeId INT [PK], 
ShapePtLat REAL, 
ShapePtLon REAL, 
ShapePtSequence INT [PK], 
ShapeDistTraveled REAL)
Frequencies (
	FrequencyId INT [PK]
	TripId VARCHAR(10) [FK to Trips.tripId],
	StartTime VARCHAR(8),
	EndTime VARCHAR(8),
	HeadwaySecs INT
)
Stops ( StopId INT [PK],
	StopName VARCHAR(255),
	StopDescVARCHAR(255),
	StopLon REAL,
	StopLat REAL
)	
StopTimes (	StopId INT [FK to Stops.StopId],
	TripId INT VARCHAR(10) [FK to Trips.TripId],
	ArrivalTime VARCHAR(8),
	DepartureTime VARCHAR(8),
	StopSequence INT
)
FareRules(  RouteId VARCHAR(255) [PK], 
      FareId VARCHAR(255) [FK to FareAttributes.FareId],
	     OriginId VARCHAR(255),
	      DestinationId VARCHAR(255),
	      ContainsId VARCHAR(255)
)
FareAttributes	( FareId VARCHAR(255) [PK],
		  Price REAL,
	  	  CurrencyType VARCHAR(3),
		  PaymentMethod INT,
		  Transfers VARCHAR(255),
	    	  TransferDuration INT
)
Reviews ( RouteId VARCHAR(7) [FK to Route.RouteId],
	    UserId INT [FK to Users.UserId],
    Comments VARCHAR(1000),
	    starRating INT
)

```
