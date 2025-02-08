from flask import Blueprint, jsonify, request
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup
weather_bp = Blueprint('weather', __name__)

current_date = datetime.now().date()

@weather_bp.route("/api/weather/", methods=["GET"])
def coordinates():
   if not os.path.isfile(f"package/ml_models/predictions{current_date}.csv"):
      fetch_data()
   city = pd.read_csv(f"package/ml_models/predictions{current_date}.csv")
   city = city[["0", "position", "Yes", "RainToday"]].to_dict(orient="records")
   # print(city)
   return jsonify(city)

# @weather_bp.route("/api/current_weather/", methods=["GET"])
def get_details():
   city = pd.read_csv(f"package/ml_models/predictions{current_date}.csv")
   numeric_cols = ['MinTemp', 'MaxTemp', 'Rainfall', 'Evaporation', 'Sunshine',
'WindGustSpeed', 'WindSpeed9am', 'WindSpeed3pm', 'Humidity9am', 'Humidity3pm',
'Pressure9am', 'Pressure3pm', 'Cloud9am', 'Cloud3pm', 'Temp9am', 'Temp3pm',
'dayofweek', 'quarter', 'month', 'year', 'dayofyear', 'dayofmonth', 'weekofyear',
'Group', 'dayofweek_sin', 'dayofweek_cos', 'month_sin', 'month_cos', 'year_sin',
'year_cos', 'is_weekend', 'is_month_start', 'is_month_end']
   # city = city[numeric_cols]
   categorical_cols = ['Location', 'WindGustDir', 'WindDir9am', 'WindDir3pm', 'RainToday', 'Season']
   label_enc_cat = joblib.load("package/ml_models/label_encoders.pkl")
   for col in categorical_cols:
      city[col] = label_enc_cat[col].inverse_transform(city[col])
   scaler = joblib.load("package/ml_models/scaler.pkl")
   city[numeric_cols] = scaler.inverse_transform(city[numeric_cols])
   req_cols = ['MinTemp', 'MaxTemp', 'Rainfall', 'Evaporation', 'Sunshine',
'WindGustSpeed', 'WindSpeed9am','WindSpeed3pm', 'Humidity9am', 'Humidity3pm',
'Pressure9am', 'Pressure3pm', 'Cloud9am', 'Cloud3pm', 'Temp9am', 'Temp3pm', '0',
'RainToday', "Yes", "0", "WindGustDir", "WindDir9am","WindDir3pm", "dayofweek"]
   city = city[req_cols]
   city = city.to_dict(orient="records")
   return jsonify(city)



def find_values(url, date):

  # Define headers with a common User-Agent string
  headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }

  # Send a GET request to fetch the page content with the headers
  response = requests.get(url, headers=headers)

  # Check if the request was successful
  if response.status_code == 200:
      # Parse the HTML content using BeautifulSoup
      soup = BeautifulSoup(response.content, 'html.parser')
      table = soup.find('table')
      if table:
          # Find all rows in the table (each row is a <tr> element)
          rows = table.find_all('tr')

          # For example, extract the 3rd row (index 2)
          row_index = date+2  # Change this to the row index you need
          if len(rows) > row_index:
              row = rows[row_index]
              # print(row.prettify())  # Pretty print the row HTML
          else:
              print(f"Row {row_index} does not exist.")
      else:
          print("No table found on the page.")
  else:
      print(f"Failed to retrieve the webpage. Status code: {response.status_code}")



  row = f"{row}"
  row = row.replace("Calm", "</td><td>0")
  soup = BeautifulSoup(row, 'html.parser')

  # Find the <tr> tag
  row = soup.find('tr')

  # Initialize the dictionary
  data = {}

  # Column names for your data (you can modify this based on the meaning of each column)
  column_names = [
      "Date", "Day", "MinTemp", "MaxTemp", "Rainfall", "Evaporation", "Sunshine",
      "WindGustDir", "WindGustSpeed", "Time",
      "Temp9am", "Humidity9am", "Cloud9am", "WindDir9am", "WindSpeed9am", "Pressure9am",
      "Temp3pm", "Humidity3pm", "Cloud3pm", "WindDir3pm", "WindSpeed3pm", "Pressure3pm",
  ]

  # Extract all <td> and <th> elements
  columns = row.find_all(['th', 'td'])

  # Loop through the columns and assign values to the dictionary
  for i, col in enumerate(columns):
      # Get the text from each cell and remove extra spaces
      value = col.get_text(strip=True)

      # Map the value to the corresponding column name in the dictionary
      if i < len(column_names):
          data[column_names[i]] = value

  # Print the dictionary
  return data


def create_features(df, real=False):
    """
    Create time series features based on time series index.
    """
    # df['hour'] = df.date.hour
    df['dayofweek'] = df['Date'].dt.dayofweek
    df['quarter'] = df['Date'].dt.quarter
    df['month'] = df['Date'].dt.month
    df['year'] = df['Date'].dt.year
    df['dayofyear'] = df['Date'].dt.dayofyear
    df['dayofmonth'] = df['Date'].dt.day
    df['weekofyear'] = df['Date'].dt.isocalendar().week

    df['Group'] = ((df['year'] - 2008) * 48 + df['month'] * 4 + df['dayofmonth'] // 7).astype("float32")

    # Cyclic Features
    # Day of the week (0=Monday, 6=Sunday)
    df['dayofweek_sin'] = np.sin(2 * np.pi * df['dayofweek'] / 7).astype("float32")
    df['dayofweek_cos'] = np.cos(2 * np.pi * df['dayofweek'] / 7).astype("float32")

    # Month of the year (1=January, 12=December)
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12).astype("float32")
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12).astype("float32")

    # Cyclic encoding of Year (if this feature makes sense for your data)
    if real:
      df['year_sin'] = np.sin(2 * np.pi * df['year'] / (df['year'].max() -2008)).astype("float32")
      df['year_cos'] = np.cos(2 * np.pi * df['year'] / (df['year'].max() - 2008)).astype("float32")
    else:
      df['year_sin'] = np.sin(2 * np.pi * df['year'] / (df['year'].max() - df['year'].min())).astype("float32")
      df['year_cos'] = np.cos(2 * np.pi * df['year'] / (df['year'].max() - df['year'].min())).astype("float32")


    df['Season'] = df['month'].apply(lambda x:
                                      'Winter' if x in [12, 1, 2] else
                                      'Spring' if x in [3, 4, 5] else
                                      'Summer' if x in [6, 7, 8] else
                                      'Autumn')

    df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype("int32")
    df['is_month_start'] = df['Date'].dt.is_month_start.astype("int32")
    df['is_month_end'] = df['Date'].dt.is_month_end.astype("int32")

    return df



def fetch_data():
   df_c = pd.read_csv("package/ml_models/cities.csv")
   df_1 = pd.DataFrame()
   lst = list(df_c["Link_new"].values)
   for i in range(len(lst)):
      df_1 = pd.concat([df_1, pd.DataFrame(find_values(lst[i], date=current_date.day), index=[i])])

   df_1 = df_1.merge(df_c, left_index=True, right_index=True)
   df_1.drop("Link", axis=1, inplace=True)
   df_1.drop("Link_new", axis=1, inplace=True)
   df_1.rename(columns={"0": "Location"}, inplace=True)
   df_1["RainToday"] = df_1["Rainfall"].apply(lambda x: 1 if x!="" and float(x) > 1 else 0)

   cols = ["MinTemp", "MaxTemp", "Rainfall", "Evaporation", "Sunshine", "WindGustDir", "WindGustSpeed", "Temp9am", "Humidity9am", "Cloud9am", "WindSpeed9am", "Pressure9am", "Temp3pm", "Humidity3pm", "Cloud3pm", "WindSpeed3pm", "Pressure3pm", "RainToday"]
   df_1[cols] = df_1[cols].apply(pd.to_numeric, errors='coerce')
   df_1["Date"] = pd.to_datetime(current_date)
   df_1["RainToday"].replace(1, "Yes", inplace=True)
   df_1["RainToday"].replace(0, "No", inplace=True)
   df_1.to_csv("Current_values.csv", index=False)
   df_1 = create_features(df_1, real=True)
   input_cols = list(df_1.columns)
   target_col = "RainTomorrow"
   deploy_inp = df_1[input_cols].copy()
   numeric_cols = ['MinTemp',
 'MaxTemp', 'Rainfall', 'Evaporation', 'Sunshine', 'WindGustSpeed', 'WindSpeed9am',
 'WindSpeed3pm', 'Humidity9am', 'Humidity3pm', 'Pressure9am', 'Pressure3pm',
 'Cloud9am', 'Cloud3pm', 'Temp9am', 'Temp3pm', 'dayofweek', 'quarter',
 'month', 'year','dayofyear', 'dayofmonth', 'weekofyear', 'Group',
 'dayofweek_sin', 'dayofweek_cos', 'month_sin', 'month_cos',
 'year_sin', 'year_cos', 'is_weekend', 'is_month_start', 'is_month_end']
   categorical_cols = ['Location', 'WindGustDir', 'WindDir9am', 'WindDir3pm', 'RainToday', 'Season']

   imputer_num = joblib.load("package/ml_models/imputer_num.pkl")
   scaler = joblib.load("package/ml_models/scaler.pkl")
   deploy_inp[numeric_cols] = imputer_num.transform(deploy_inp[numeric_cols])
   deploy_inp[numeric_cols] = scaler.transform(deploy_inp[numeric_cols])

   deploy_inp.replace('', np.nan, inplace=True)
   imputer = joblib.load("package/ml_models/imputer.pkl")
   deploy_inp[categorical_cols] = imputer.transform(deploy_inp[categorical_cols])
   encoders = joblib.load('package/ml_models/label_encoders.pkl')
   for col in categorical_cols:
      le = encoders[col]
      deploy_inp[col] = le.transform(deploy_inp[col])

   X_deploy = deploy_inp[numeric_cols + categorical_cols]
   # print(f"------NA terms: {X_deploy.isna().sum()}")
   model_xgb = joblib.load("package/ml_models/model_xgb_rain.pkl")
   new_df = pd.DataFrame(model_xgb.predict_proba(X_deploy[numeric_cols + categorical_cols]), columns=["No", "Yes"])
   X_deploy["RainTomorrow"] = model_xgb.predict(X_deploy[numeric_cols + categorical_cols])
   X_deploy = X_deploy.merge(df_c, left_index=True, right_index=True)
   X_deploy = X_deploy.merge(new_df, left_index=True, right_index=True)
   X_deploy.to_csv(f"package/ml_models/predictions{current_date}.csv", index=False)



@weather_bp.route("/api/daily-data", methods=["GET"])
def scrape_and_store_data():
   if os.path.isfile(f"package/ml_models/predictions{current_date}.csv"):
      return get_details()
   else:
      fetch_data()
      return get_details()


@weather_bp.route("/api/location", methods=["POST"])
def get_location_from_name():
   name = request.get_json().get("name")
   print(name)
   try:
      city = pd.read_csv(f"package/ml_models/predictions{current_date}.csv")
      loc = city[city["0"]==name]["position"].values[0]
      idx = city[city["0"]==name]["position"].index[0]
      print(idx)
      print(loc)
      return jsonify({"loc":loc, "idx":str(idx)})
   except IndexError:
      return jsonify("Not in list"), 300