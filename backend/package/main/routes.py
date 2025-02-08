from flask import Blueprint, jsonify
from datetime import datetime, timedelta
main_bp = Blueprint('main', __name__)


def get_day_suffix(day):
    if 10 <= day % 100 <= 20:
        suffix = 'th'
    else:
        suffix = {1: 'st', 2: 'nd', 3: 'rd'}.get(day % 10, 'th')
    return suffix

@main_bp.route("/api/home/", methods=["GET"])
def home():
    tomorrow = (datetime.today()+timedelta(days=1)).date()
    day = tomorrow.day
    month = tomorrow.strftime('%b')  # Abbreviated month name (Jan, Feb, etc.)
    year = tomorrow.year

    # Get the day suffix (e.g., 'st', 'nd', 'rd', 'th')
    day_suffix = get_day_suffix(day)

    # Format tomorrow's date
    formatted_tomorrow = f"{day}{day_suffix} {month}, {year}"
    return jsonify({"message": formatted_tomorrow})

