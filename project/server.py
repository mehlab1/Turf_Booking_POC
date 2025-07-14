from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime, timedelta

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
grounds = [
    {"id": 1, "name": "Finova Stadium", "city": "Lahore", "sport": "Cricket", "image": "https://images.pexels.com/photos/163452/baseball-stadium-ballpark-green-163452.jpeg", "price": 2000, "rating": 4.8},
    {"id": 2, "name": "Champions Ground", "city": "Karachi", "sport": "Football", "image": "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg", "price": 1800, "rating": 4.6},
    {"id": 3, "name": "Victory Field", "city": "Islamabad", "sport": "Cricket", "image": "https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg", "price": 2200, "rating": 4.9},
    {"id": 4, "name": "Elite Sports Complex", "city": "Lahore", "sport": "Football", "image": "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg", "price": 1900, "rating": 4.7},
]

slots = [
    {"ground_id": 1, "date": "2025-01-21", "time": "08:00", "demand": "high", "available": True, "price": 2400},
    {"ground_id": 1, "date": "2025-01-21", "time": "10:00", "demand": "medium", "available": True, "price": 2000},
    {"ground_id": 1, "date": "2025-01-21", "time": "14:00", "demand": "low", "available": True, "price": 1800},
    {"ground_id": 1, "date": "2025-01-21", "time": "18:00", "demand": "high", "available": True, "price": 2600},
    {"ground_id": 2, "date": "2025-01-21", "time": "09:00", "demand": "medium", "available": True, "price": 1980},
    {"ground_id": 2, "date": "2025-01-21", "time": "16:00", "demand": "high", "available": True, "price": 2340},
]

bookings = []
weather_data = {
    "2025-01-21": [{"day": "Sunny", "high": 28, "low": 18, "icon": "sun"}],
    "2025-01-22": [{"day": "Partly Cloudy", "high": 25, "low": 16, "icon": "cloud"}],
    "2025-01-23": [{"day": "Rainy", "high": 22, "low": 15, "icon": "cloud-rain"}],
}

users = [
    {"id": 1, "email": "user@test.com", "password": "password", "name": "John Doe", "loyalty_points": 50, "role": "user"},
    {"id": 2, "email": "admin@test.com", "password": "admin", "name": "Admin User", "loyalty_points": 0, "role": "admin"},
]

teams = [
    {"id": 1, "name": "Thunder Strikers", "bookings": 15, "total_spent": 45000},
    {"id": 2, "name": "Lightning Bolts", "bookings": 12, "total_spent": 38000},
    {"id": 3, "name": "Fire Eagles", "bookings": 8, "total_spent": 24000},
]

# Request models
class LoginRequest(BaseModel):
    email: str
    password: str

class BookingRequest(BaseModel):
    ground_id: int
    date: str
    time: str
    duration: str
    loyalty_points_used: int = 0
    total_price: float

class AIQuery(BaseModel):
    query: str

# Auth endpoints
@app.post("/api/login")
def login(request: LoginRequest):
    user = next((u for u in users if u["email"] == request.email and u["password"] == request.password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "token": f"mock-jwt-{user['id']}",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "loyalty_points": user["loyalty_points"],
            "role": user["role"]
        }
    }

@app.post("/api/signup")
def signup(request: LoginRequest):
    if any(u["email"] == request.email for u in users):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    new_user = {
        "id": len(users) + 1,
        "email": request.email,
        "password": request.password,
        "name": request.email.split("@")[0],
        "loyalty_points": 0,
        "role": "user"
    }
    users.append(new_user)
    
    return {
        "token": f"mock-jwt-{new_user['id']}",
        "user": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "loyalty_points": new_user["loyalty_points"],
            "role": new_user["role"]
        }
    }

# Ground endpoints
@app.get("/api/grounds")
def list_grounds(city: Optional[str] = None, sport: Optional[str] = None):
    filtered_grounds = grounds
    if city:
        filtered_grounds = [g for g in filtered_grounds if g["city"].lower() == city.lower()]
    if sport:
        filtered_grounds = [g for g in filtered_grounds if g["sport"].lower() == sport.lower()]
    return filtered_grounds

@app.get("/api/slots/{ground_id}")
def list_slots(ground_id: int, date: Optional[str] = None):
    ground_slots = [s for s in slots if s["ground_id"] == ground_id]
    if date:
        ground_slots = [s for s in ground_slots if s["date"] == date]
    return ground_slots

@app.get("/api/forecast/{date}")
def get_weather(date: str):
    return weather_data.get(date, [{"day": "Sunny", "high": 25, "low": 18, "icon": "sun"}])

# Booking endpoints
@app.post("/api/book")
def book_slot(booking: BookingRequest):
    new_booking = {
        "id": len(bookings) + 1,
        "ground_id": booking.ground_id,
        "date": booking.date,
        "time": booking.time,
        "duration": booking.duration,
        "loyalty_points_used": booking.loyalty_points_used,
        "total_price": booking.total_price,
        "status": "Confirmed",
        "created_at": datetime.now().isoformat()
    }
    bookings.append(new_booking)
    return new_booking

@app.get("/api/bookings")
def get_bookings():
    return bookings

# AI Assistant
@app.post("/api/ai/assistant")
def ai_assistant(query: AIQuery):
    responses = {
        "best time": "Tomorrow at 5 PM looks clear and lightly booked — perfect for your team!",
        "weather": "The weather looks great for the next 3 days. Tuesday might have some rain, so Monday or Wednesday would be ideal.",
        "price": "Off-peak hours (10 AM - 2 PM) typically offer 20% lower rates. I'd recommend booking between 11 AM - 1 PM for the best value.",
        "demand": "Based on current trends, weekday mornings have low demand while weekend evenings are in high demand. Consider booking Tuesday-Thursday for better availability.",
        "default": "I can help you find the best time to play based on weather, demand, and pricing. What would you like to know?"
    }
    
    query_lower = query.query.lower()
    response = responses["default"]
    
    for key in responses:
        if key in query_lower:
            response = responses[key]
            break
    
    return {"reply": response}

# Admin endpoints
@app.get("/api/admin/analytics")
def get_analytics():
    return {
        "total_bookings": len(bookings),
        "total_revenue": sum(b["total_price"] for b in bookings),
        "occupancy_rate": 75.5,
        "popular_slots": ["18:00", "19:00", "20:00"],
        "revenue_by_day": [
            {"day": "Monday", "revenue": 25000},
            {"day": "Tuesday", "revenue": 18000},
            {"day": "Wednesday", "revenue": 22000},
            {"day": "Thursday", "revenue": 20000},
            {"day": "Friday", "revenue": 35000},
            {"day": "Saturday", "revenue": 45000},
            {"day": "Sunday", "revenue": 40000},
        ]
    }

@app.get("/api/admin/teams")
def get_teams():
    return teams

@app.get("/api/admin/pricing")
def get_pricing():
    return {
        "base_prices": {"cricket": 2000, "football": 1800},
        "multipliers": {
            "peak_hours": 1.3,
            "off_peak": 0.9,
            "weekend": 1.2,
            "high_demand": 1.4,
            "rain_forecast": 0.8
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)