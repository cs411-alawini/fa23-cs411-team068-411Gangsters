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
CREATE TABLE FareRules(  RouteId VARCHAR(255), 
      FareId VARCHAR(255),
	     OriginId VARCHAR(255),
	      DestinationId VARCHAR(255),
	      ContainsId VARCHAR(255),
	PRIMARY KEY(RouteId),
	FOREIGN KEY(FareId) REFERENCES FareAttributes(FareId) ON DELETE CASCADE
);
CREATE TABLE Reviews ( RouteId VARCHAR(7),
	    UserId INT,
            Comments VARCHAR(1000),
	    starRating INT,
	    FOREIGN KEY(RouteId) REFERENCES Routes(RouteId) ON DELETE CASCADE,
	    FOREIGN KEY(UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

```
