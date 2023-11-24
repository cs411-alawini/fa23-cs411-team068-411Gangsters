import os
from google.cloud.sql.connector import Connector, IPTypes
import pymysql
import sqlalchemy
import json
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask import request

app = Flask(__name__)
CORS(app)

def connect_with_connector() -> sqlalchemy.engine.base.Engine:
    """
    Initializes a connection pool for a Cloud SQL instance of MySQL.

    Uses the Cloud SQL Python Connector package.
    """

    load_dotenv()

    instance_connection_name = os.getenv("INSTANCE_CONNECTION_NAME")  # e.g. 'project:region:instance'
    db_user = os.getenv("DB_USER")  # e.g. 'my-db-user'
    db_pass = os.getenv("DB_PASS")  # e.g. 'my-db-password'
    db_name = os.getenv("DB_NAME")  # e.g. 'my-database'

    ip_type = IPTypes.PUBLIC

    connector = Connector(
        ip_type=ip_type,
    )

    def getconn() -> pymysql.connections.Connection:
        conn: pymysql.connections.Connection = connector.connect(
            instance_connection_name,
            "pymysql",
            user=db_user,
            password=db_pass,
            db=db_name,
        )
        return conn

    pool = sqlalchemy.create_engine(
        "mysql+pymysql://",
        creator=getconn,
    )
    return pool

@app.route('/get_routes')
def get_routes():
    pool = connect_with_connector()
    ans = []
    with pool.connect() as db_conn:
        rows = db_conn.execute(
            statement=sqlalchemy.text("SELECT RouteLongName FROM Routes WHERE RouteLongName LIKE :route_name"), 
            parameters=dict(route_name=f"%{request.args.get('search_query')}%")
        ).fetchall()
        for row in rows:
            ans.append(tuple(row))
    pool.dispose()
    return json.dumps(ans)

@app.route('/get_stops')
def get_stops():
    pool = connect_with_connector()
    ans = []
    with pool.connect() as db_conn:
        rows = db_conn.execute(
            statement=sqlalchemy.text("SELECT StopName FROM Stops WHERE StopName LIKE :stop_name"), 
            parameters=dict(stop_name=f"%{request.args.get('search_query')}%")
        ).fetchall()
        for row in rows:
            ans.append(tuple(row))
    pool.dispose()
    return json.dumps(ans)

@app.route('/get_closest_departure_time')
def get_closest_departure_time():
    pool = connect_with_connector()
    ans = []
    with pool.connect() as db_conn:
        if request.args.get('stop_name') == "":
            rows = db_conn.execute(
                statement=sqlalchemy.text("""select RouteLongName, StopId, n.StopName,
CASE
WHEN MIN(TIMEDIFF(STR_TO_DATE(DepartureTime, "%T"), DATE_ADD(CURRENT_TIME, INTERVAL -3 HOUR))) < 0 THEN 'Next Closest Departure is Tomorrow'
ELSE TIME_FORMAT(MIN(TIMEDIFF(STR_TO_DATE(DepartureTime, "%T"), DATE_ADD(CURRENT_TIME, INTERVAL -3 HOUR))), '%H hours %i minutes %i seconds')
END AS Time_To_Departure 
from Trips 
left join Routes using (RouteId) 
left join StopTimes using (TripId) 
left join (select StopName, StopId from Stops) n using(StopId) 
where RouteLongName like :route_name
group by StopId, n.StopName, RouteLongName
Order by Time_To_Departure
Limit 15;"""), 
                parameters=dict(
                    route_name=f"%{request.args.get('route_name')}%"
                )
            ).fetchall()
        else:
            rows = db_conn.execute(
                statement=sqlalchemy.text("""select RouteLongName, StopId, n.StopName,
CASE
WHEN MIN(TIMEDIFF(STR_TO_DATE(DepartureTime, "%T"), DATE_ADD(CURRENT_TIME, INTERVAL -3 HOUR))) < 0 THEN 'Next Closest Departure is Tomorrow'
ELSE TIME_FORMAT(MIN(TIMEDIFF(STR_TO_DATE(DepartureTime, "%T"), DATE_ADD(CURRENT_TIME, INTERVAL -3 HOUR))), '%H hours %i minutes %i seconds')
END AS Time_To_Departure 
from Trips 
left join Routes using (RouteId) 
left join StopTimes using (TripId) 
left join (select StopName, StopId from Stops) n using(StopId) 
where RouteLongName like :route_name
group by StopId, n.StopName, RouteLongName
Having n.StopName like :stop_name
Order by Time_To_Departure
Limit 15;"""), 
                parameters=dict(
                    stop_name=f"%{request.args.get('stop_name')}%",
                    route_name=f"%{request.args.get('route_name')}%"
                )
            ).fetchall()

        for row in rows:
            ans.append(tuple(row))
    pool.dispose()
    return json.dumps(ans)
