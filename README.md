# Rainfall Prediction in Australia

## Project Overview

This project involves building a comprehensive weather forecasting platform that predicts daily rainfall probabilities in Australia. The solution integrates web scraping, data science techniques, and machine learning models, combined with a dynamic frontend and backend for user interaction.

## Features

Weather Data Scraping: Automated extraction of weather data from meteorological websites.

Data Preprocessing: Handling missing data, feature engineering, and cleaning for high-quality machine learning input.

Machine Learning: Hyperparameter-tuned models for rainfall prediction.

Frontend (React): User-friendly interface to display current weather data and forecasts for the next day.

Backend (Flask): API for serving weather predictions and managing backend logic.

## Tech Stack

Frontend: React, Tailwind CSS

Backend: Flask, Python

Machine Learning: Scikit-Learn, Pandas, NumPy

Web Scraping: BeautifulSoup, Requests

Deployment: Vercel for frontend, Render/Heroku for backend

## Machine Learning Pipeline

Data Collection: Scraped live weather data from the Australian Meteorological website using BeautifulSoup. Historical dataset obtained from Kaggle.

Data Preprocessing: Cleaning, handling missing values, and feature engineering data to improve the accuracy of the model.

Model Selection: Evaluated multiple models like XGBoost, Random Forest, Light GBM and various Deep Learning models and optimised the hyperparameters. Best model - 85 % accuracy

Prediction Service: Integrated the selected model into the Flask backend.

Displayed current weather data as well as tomorrow's forecast on the website.

## Installation

To set up the project locally:

## Prerequisites

Node.js

Python 3.8+

## Backend Setup

Clone the repository:
```
git clone https://github.com/your-username/rain-forecast.git
```
```
cd rain-forecast/backend
```
Create and activate a virtual environment:
```
python -m venv venv
```
```
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
```
Install dependencies:
```
pip install -r requirements.txt
```
Run the backend server:
```
python run.py
```
## Frontend Setup

Navigate to the frontend directory:
```
cd ../frontend
```
Install dependencies:
```
npm install
```
Start the development server:
```
npm run dev
```
Usage

Visit the frontend at http://localhost:5173.

Use the interface to view current weather data and rainfall forecasts.


## Deployment

Frontend: Deployed on Vercel

Backend: Deployed on Render (or any cloud hosting platform)

## Screenshots

Add screenshots here (optional).

# Future Enhancements

Detailed analytics for weather trends.



# Contributing

Feel free to fork the project and create pull requests. Contributions are welcome!



## Website
https://rain-forecast.vercel.app/
