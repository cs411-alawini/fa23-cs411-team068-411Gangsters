import os
from google.cloud.sql.connector import Connector, IPTypes
import pymysql
import sqlalchemy
import json
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask import request, session
from flask_session import Session


app = Flask(__name__)
load_dotenv()
app.secret_key = os.getenv("APP_SECRET_KEY")


CORS(app)

def connect_with_connector() -> sqlalchemy.engine.base.Engine:
    """
    Initializes a connection pool for a Cloud SQL instance of MySQL.

    Uses the Cloud SQL Python Connector package.
    """



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




@app.route('/register', methods =['POST'])
def register():
    
    return "not implemented", 500

@app.route('/login', methods =['POST'])
def login() :
    pool = connect_with_connector()
    # with pool.connect() as db:
    #     statement=sqlalchemy.text("SELECT StopName FROM Stops WHERE StopName LIKE :stop_name")
    #     db.execute()
    with pool.connect() as db_conn:
        username = request.args.get('username')
        password = request.args.get('password')
        row = db_conn.execute(
            statement=sqlalchemy.text("SELECT UserId, UserName FROM Users WHERE UserName = :username AND Password = :password"), 
            parameters=dict(username=f"{username}", password = f"{password}")
        ).fetchone()
        print(row)
        if row != None:
            # print(" Here now ")
            session['user_id'] = row[0]
            session['user_name'] = row[1]
            # print(" Login Successful ")
            pool.dispose()
            return "Login Successful", 200
        else:
            print(" Not Registered, please register using the link below ")
            pool.dispose()
            return "Not Registered, please register using the link below", 200




@app.route("/logout", methods=["POST"])
def logout_user():
    if 'user_id' in session and 'user_name' in session:
        session.pop("user_id")
        session.pop("user_name")
    return "Logout successful", 200

@app.route("/get_curr_user", methods=["POST"])
def get_curr_user():
    if 'user_id' in session and 'user_name' in session:
        return (session.get('user_id'), session.get('user_name')), 200
    return "No user logged in ", 200

