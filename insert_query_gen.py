import pandas as pd

trips_df = pd.read_csv('raw_data/trips.txt')
routes_df = pd.read_csv('raw_data/routes.txt')
stops_df = pd.read_csv('raw_data/stops.txt')
calendar_df = pd.read_csv('raw_data/calendar.txt')
fare_attributes_df = pd.read_csv('raw_data/fare_attributes.txt')
fare_rules_df = pd.read_csv('raw_data/fare_rules.txt')
stop_times_df = pd.read_csv('raw_data/stop_times.txt')
shapes_df = pd.read_csv('raw_data/shapes.txt')
freq_df = pd.read_csv('raw_data/frequencies.txt')
# for index, row in trips_df[:5].iterrows():
#     print(f'INSERT INTO Trips VALUES ("{row.trip_id}", "{row.route_id}", "{row.service_id}", "{row.trip_headsign}", {row.direction_id}, {row.shape_id});')

# for index, row in routes_df[:5].iterrows():
#     print(f'INSERT INTO Routes VALUES ("{row.route_id}", "{row.route_short_name}", "{row.route_long_name}", {row.route_type}, "{row.route_color}", "{row.route_text_color}");')

# for index, row in stops_df.iterrows():
#     print(f'INSERT INTO Stops VALUES ({row.stop_id}, "{row.stop_name}", "{row.stop_desc}", {row.stop_lon}, {row.stop_lat});')


f = open('insert_queries/frequencies_insert_queries.txt', 'w')

# for index, row in stops_df.iterrows():
#     print(f'INSERT INTO Stops VALUES ({row.stop_id}, "{row.stop_name}", "{row.stop_desc}", {row.stop_lon}, {row.stop_lat});')
#     f.write(f'INSERT INTO Stops VALUES ({row.stop_id}, "{row.stop_name}", "{row.stop_desc}", {row.stop_lon}, {row.stop_lat});\n')

# for index, row in calendar_df.iterrows():
#     print(f'INSERT INTO Calendar VALUES ("{row.service_id}", {row.monday}, {row.tuesday}, {row.wednesday}, {row.thursday}, {row.friday}, {row.saturday}, {row.sunday}, "{row.start_date}", "{row.end_date}");')
#     f.write(f'INSERT INTO Calendar VALUES ("{row.service_id}", {row.monday}, {row.tuesday}, {row.wednesday}, {row.thursday}, {row.friday}, {row.saturday}, {row.sunday}, "{row.start_date}", "{row.end_date}");\n')

# for index, row in fare_attributes_df.iterrows():
#     print(f'INSERT INTO FareAttributes VALUES ("{row.fare_id}", {row.price}, "{row.currency_type}", {row.payment_method}, {row.transfers}, {row.transfer_duration});')
#     f.write(f'INSERT INTO FareAttributes VALUES ("{row.fare_id}", {row.price}, "{row.currency_type}", {row.payment_method}, {row.transfers}, {row.transfer_duration});\n')

# for index, row in fare_rules_df.iterrows():
#     print(f'INSERT INTO FareRules VALUES ("{row.route_id}", "{row.fare_id}", "", "", "");')
#     f.write(f'INSERT INTO FareRules VALUES ("{row.route_id}", "{row.fare_id}", "", "", "");\n')

# for index, row in stop_times_df.iterrows():
#     print(f'INSERT INTO StopTimes VALUES ("{row.stop_id}", "{row.trip_id}", "{row.arrival_time}", "{row.departure_time}", {row.stop_sequence});')
#     f.write(f'INSERT INTO StopTimes VALUES ("{row.stop_id}", "{row.trip_id}", "{row.arrival_time}", "{row.departure_time}", {row.stop_sequence});\n')

# for index, row in shapes_df.iterrows():
#     print(f'INSERT INTO Shapes VALUES ({row.shape_id}, {row.shape_pt_lat}, {row.shape_pt_lon}, {row.shape_pt_sequence}, {row.shape_dist_traveled});')
#     f.write(f'INSERT INTO Shapes VALUES ({row.shape_id}, {row.shape_pt_lat}, {row.shape_pt_lon}, {row.shape_pt_sequence}, {row.shape_dist_traveled});\n')

# count = 1
# for index, row in freq_df.iterrows():
#     print(f'INSERT INTO Frequencies VALUES ({count}, "{row.trip_id}", "{row.start_time}", "{row.end_time}", {row.headway_secs});')
#     f.write(f'INSERT INTO Frequencies VALUES ({count},"{row.trip_id}", "{row.start_time}", "{row.end_time}", {row.headway_secs});\n')
#     count+=1