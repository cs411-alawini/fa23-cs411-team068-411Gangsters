import pandas as pd

trips_df = pd.read_csv('raw_data/trips.txt')
routes_df = pd.read_csv('raw_data/routes.txt')
stops_df = pd.read_csv('raw_data/stops.txt')

f = open('trips_insert_queries.txt', 'w')

for index, row in trips_df.iterrows():
    f.write(f'INSERT INTO Trips VALUES ("{row.trip_id}", "{row.route_id}", "{row.service_id}", "{row.trip_headsign}", {row.direction_id}, {row.shape_id});\n')

f.close()

f = open('routes_insert_queries.txt', 'w')

for index, row in routes_df.iterrows():
    f.write(f'INSERT INTO Routes VALUES ("{row.route_id}", "{row.route_short_name}", "{row.route_long_name}", {row.route_type}, "{row.route_color}", "{row.route_text_color}");\n')

f.close()

f = open('stops_insert_queries.txt', 'w')

for index, row in stops_df.iterrows():
    f.write(f'INSERT INTO Stops VALUES ({row.stop_id}, "{row.stop_name}", "{row.stop_desc}", {row.stop_lon}, {row.stop_lat});\n')

f.close()