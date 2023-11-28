import os
from google.cloud.sql.connector import Connector, IPTypes
import pymysql
import sqlalchemy
import simplejson as json
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask import request, session
from flask_session import Session

app = Flask(__name__)
SESSION_TYPE = 'filesystem'
app.config.from_object(__name__)
app.secret_key = os.getenv("APP_SECRET_KEY")
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
Session(app)
CORS(app, supports_credentials=True)
load_dotenv()


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

@app.route('/get_routes', methods=['GET'])
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

@app.route('/get_stops', methods=['GET'])
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

@app.route('/get_closest_departure_time', methods=['GET'])
def get_closest_departure_time():
    pool = connect_with_connector()
    ans = []
    with pool.connect() as db_conn:
        rows = db_conn.execute(
            statement=sqlalchemy.text(f"""select RouteLongName, StopId, n.StopName,
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
{'Having n.StopName like :stop_name' if request.args.get('stop_name') != '' else ''}
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


@app.route('/get_review_summary', methods=['GET'])
def get_review_summary():
    pool = connect_with_connector()
    ans = []
    with pool.connect() as db_conn:
        row = db_conn.execute(
            statement=sqlalchemy.text(f"""SELECT 
    r.RouteId,
    SUM(CASE WHEN rv.starRating = 5 THEN 1 ELSE 0 END) AS FiveStarRatings,
    SUM(CASE WHEN rv.starRating = 4 THEN 1 ELSE 0 END) AS FourStarRatings,
    SUM(CASE WHEN rv.starRating = 3 THEN 1 ELSE 0 END) AS ThreeStarRatings,
    SUM(CASE WHEN rv.starRating = 2 THEN 1 ELSE 0 END) AS TwoStarRatings,
    SUM(CASE WHEN rv.starRating = 1 THEN 1 ELSE 0 END) AS OneStarRatings
FROM Routes r
LEFT JOIN Reviews rv ON r.RouteId = rv.RouteId
WHERE r.RouteLongName = :route_name
GROUP BY r.RouteId;"""), 
            parameters=dict(
                route_name=f"{request.args.get('route_name')}"
            )
        ).fetchone()
        ans = row
    pool.dispose()
    return json.dumps(ans, use_decimal=True)

@app.route('/get_reviews', methods=['GET'])
def get_reviews():
    pool = connect_with_connector()
    ans = []
    with pool.connect() as db_conn:
        row = db_conn.execute(
            statement=sqlalchemy.text(f"""SELECT UserName, Comments, StarRating 
FROM Users NATURAL JOIN Reviews NATURAL JOIN Routes 
WHERE RouteLongName = :route_name;"""), 
            parameters=dict(
                route_name=f"{request.args.get('route_name')}"
            )
        ).fetchall()
        ans = row
    pool.dispose()
    return json.dumps(ans, use_decimal=True)

@app.route('/add_review', methods=['POST'])
def add_review():

    
    data = request.get_json()['data']

    pool = connect_with_connector()
    with pool.connect() as db_conn:
        db_conn.execute(
            statement=sqlalchemy.text(f"""INSERT INTO Reviews (RouteId, UserId, Comments, StarRating)
VALUES (:route_id, :user_id, :comments, :star_rating);"""),
            parameters=dict(
                user_id=session.get('user_id'),
                route_id=data['route_id'],
                comments=data['comments'],
                star_rating=data['star_rating']
            )
        )
        db_conn.commit()
    pool.dispose()
    return "Review Added", 200

@app.route('/update_review', methods=['POST'])
def update_review():

    
    data = request.get_json()['data']

    pool = connect_with_connector()
    with pool.connect() as db_conn:
        db_conn.execute(
            statement=sqlalchemy.text(f"""UPDATE Reviews 
SET Comments = :comments, StarRating = :star_rating
WHERE UserId = :user_id AND RouteId = :route_id;"""),
            parameters=dict(
                user_id=session.get('user_id'),
                route_id=data['route_id'],
                comments=data['comments'],
                star_rating=data['star_rating']
            )
        )
        db_conn.commit()
    pool.dispose()
    return "Review Updated", 200

@app.route('/delete_review', methods=['GET'])
def delete_review():
    pool = connect_with_connector()
    with pool.connect() as db_conn:
        db_conn.execute(
            statement=sqlalchemy.text(f"""DELETE FROM Reviews
WHERE RouteId = :route_id AND UserId = :user_id;"""),
            parameters=dict(
                user_id=session.get('user_id'),
                route_id=request.args.get('route_id')
            )
        )
        db_conn.commit()
    pool.dispose()
    return "Review Deleted", 200

@app.route('/register', methods =['POST'])
def register():
    pool = connect_with_connector()
    with pool.connect() as db_conn:
        username = request.args.get('username')
        password = request.args.get('password')

        row = db_conn.execute(
            statement=sqlalchemy.text("SELECT UserId, UserName FROM Users WHERE UserName = :username AND Password = :password"), 
            parameters=dict(username=f"{username}", password = f"{password}")
        ).fetchone()
        if row == None:
            current_user_count = db_conn.execute(
                statement=sqlalchemy.text("SELECT UserId FROM Users ORDER BY UserId DESC LIMIT 1")).fetchone()
            try :
                r = db_conn.execute(
                    statement=sqlalchemy.text("INSERT INTO Users VALUES(:userid, :username, :password)"), 
                    parameters=dict(userid = f"{current_user_count[0] + 1}", username=f"{username}", password=f"{password}")
                )
                db_conn.commit()
                return "You are now registered, please head to the login page", 200
            except Exception as e:
                print(e)
                print("Your username contains inappropriate words")
                return "Your username contains inappropriate words", 202

        else :
            return "You are already registered ", 201
    

@app.route('/login', methods =['POST'])
def login() :
    pool = connect_with_connector()
    with pool.connect() as db_conn:
        username = request.args.get('username')
        password = request.args.get('password')
        row = db_conn.execute(
            statement=sqlalchemy.text("SELECT UserId, UserName FROM Users WHERE UserName = :username AND Password = :password"), 
            parameters=dict(username=f"{username}", password = f"{password}")
        ).fetchone()
        print(row)
        if row != None:
            session['user_id'] = row[0]
            session['user_name'] = row[1]
            pool.dispose()
            print("login successful")
            return "Login Successful", 200
        else:
            print(" Not Registered, please register using the link below ")
            pool.dispose()
            return "Not Registered, please register using the link below", 401

@app.route("/logout", methods=["POST"])
def logout_user():
    if 'user_id' in session and 'user_name' in session:
        session.pop("user_id")
        session.pop("user_name")
    return "Logout successful", 200

@app.route("/get_curr_user", methods=["GET"])
def get_curr_user():
    if 'user_id' in session and 'user_name' in session:
        return [session.get('user_id'), session.get('user_name')], 200
    return "No user logged in", 200

if __name__ == "__main__":
    app.run(debug=True, threaded=True)