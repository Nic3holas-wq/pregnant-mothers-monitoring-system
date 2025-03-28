from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from datetime import datetime
import os
from flask_jwt_extended import create_access_token, JWTManager
from bson.objectid import ObjectId
import pytz
# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)

# Secret Key
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", os.urandom(24).hex())
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", os.urandom(24).hex())
jwt = JWTManager(app)  # Initialize JWT

# Initialize Flask-SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://nicholas:Nicko22462@cluster0.vqj30.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(MONGO_URI)
db = client["pregnancy"]
messages_collection = db["messages"]
users_collection = db["users"]  # Store both mothers and users
doctors_collection = db["doctors"]
appointments_collection = db["appointments"]

@app.route("/api/doctors", methods=["GET"])
def get_doctors():
    doctors = list(doctors_collection.find({}, {"_id": 0}))  # Fetch all fields except `_id`

    if not doctors:
        return jsonify({"message": "No doctors found"}), 404  # Return 404 if no doctors exist

    return jsonify(doctors)




# 📌 Save Appointment
@app.route("/api/appointments", methods=["POST"])
def save_appointment():
    data = request.json
    appointment = {
        "from": data["from"],
        "doctor": data["doctor"],
        "date": data["date"],
        "time": data["time"],
        "reason": data["reason"],
        "status": "Pending"
    }
    appointments_collection.insert_one(appointment)
    return jsonify({"message": "✅ Appointment booked successfully!"}), 201

@app.route("/api/getappointments", methods=["GET"])
def get_appointments():
    user_email = request.args.get("from")  # Get email from query parameters

    if not user_email:
        return jsonify({"error": "User email is required"}), 400

    # Find appointments where "from" matches user_email
    appointments = list(appointments_collection.find({"from": user_email}, {"_id": 0}))

    if not appointments:
        return jsonify({"message": "No appointments found"}), 404  # Return 404 if no appointments exist

    return jsonify(appointments)

# Get appointments for a specific doctor
@app.route("/api/getdocappointments", methods=["GET"])
def get_doc_appointments():
    doctor_email = request.args.get("doctor")
    if not doctor_email:
        return jsonify({"error": "Doctor email is required"}), 400

    appointments = list(appointments_collection.find({"doctor": doctor_email}))
    
    # Convert ObjectId to string
    for app in appointments:
        app["_id"] = str(app["_id"])
    
    return jsonify(appointments)



# Update appointment status
@app.route("/api/updateappointment", methods=["POST"])
def update_appointment():
    data = request.json
    appointment_id = data.get("id")
    print(data)
    print(f"ID:", appointment_id)
    new_status = data.get("status")

    if not appointment_id or not new_status:
        return jsonify({"error": "Appointment ID and new status are required"}), 400

    try:
        object_id = ObjectId(appointment_id)  # Convert to ObjectId
    except:
        return jsonify({"error": "Invalid appointment ID"}), 400

    result = appointments_collection.update_one(
        {"_id": object_id},  # Use ObjectId
        {"$set": {"status": new_status}}
    )

    if result.modified_count == 0:
        return jsonify({"error": "No appointment found or status unchanged"}), 404

    return jsonify({"message": "Appointment status updated successfully"})

@app.route("/api/doctor-dashboard-stats", methods=["GET"])
def doctor_dashboard_stats():
    doctor_email = request.args.get("doctor")
    if not doctor_email:
        return jsonify({"error": "Doctor email is required"}), 400

    total_patients = users_collection.count_documents({"role": "mother"})
    total_appointments = appointments_collection.count_documents({"doctor": doctor_email})
    pending_requests = appointments_collection.count_documents({"doctor": doctor_email, "status": "Pending"})
    total_messages = messages_collection.count_documents({"receiver": doctor_email})

    return jsonify({
        "totalPatients": total_patients,
        "totalAppointments": total_appointments,
        "pendingRequests": pending_requests,
        "totalMessages": total_messages
    })

@app.route("/api/recent-patients", methods=["GET"])
def recent_patients():
    doctor_email = request.args.get("doctor")
    if not doctor_email:
        return jsonify({"error": "Doctor email is required"}), 400

    patients = list(users_collection.find({"role": "mother"}).sort("_id", -1).limit(5))
    for patient in patients:
        patient["_id"] = str(patient["_id"])  # Convert ObjectId to string

    return jsonify(patients)


@app.route('/api/getmedicalrecords', methods=['GET'])
def get_medical_records():
    email = request.args.get('email')  # Get email from query params
    records = [
        {"date": "2025-02-20", "doctor": "Dr. Smith", "diagnosis": "Flu", "prescription": "Rest & Flu medicine"},
        {"date": "2025-03-15", "doctor": "Dr. Johnson", "diagnosis": "High Blood Pressure", "prescription": "Hypertension meds"}
    ]
    return jsonify(records)

@app.route('/api/deleteappointment/<string:appointment_reason>', methods=['DELETE'])
def delete_appointment(appointment_reason):
    try:
        result = appointments_collection.delete_one({"reason": appointment_reason})
        
        if result.deleted_count == 1:
            return jsonify({"message": "Appointment deleted successfully"}), 200
        else:
            return jsonify({"error": "Appointment not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Set your local timezone (Example: East Africa Time (EAT) for Kenya)
local_tz = pytz.timezone("Africa/Nairobi")

def format_datetime():
    """Format timestamp as 'Wed, 26th Mar 2025 8:08AM' with correct ordinal suffix."""
    utc_dt = datetime.utcnow().replace(tzinfo=pytz.utc)  # Get current UTC time
    local_dt = utc_dt.astimezone(local_tz)  # Convert to local timezone

    day = local_dt.day
    suffix = "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")

    formatted_date = local_dt.strftime(f"%a, {day}{suffix} %b %Y %I:%M%p").lstrip("0")
    
    return formatted_date


@app.route('/api/health-metrics', methods=['POST', 'GET'])
def health_metrics():
    if request.method == 'POST':
        """Save health metrics and symptoms"""
        data = request.json
        email = data.get("email")
        blood_pressure = data.get("bloodPressure")  
        heart_rate = data.get("heartRate")
        weight = data.get("weight")
        temperature = data.get("temperature")
        glucose_level = data.get("glucoseLevel")

        if not email:
            return jsonify({"error": "User email is required"}), 400

        health_data = {
            "email": email,
            "Blood Pressure": blood_pressure,
            "Heart Rate": heart_rate,
            "Weight": weight,
            "Temperature": temperature,
            "Glucose Level": glucose_level,
            "Last Update": format_datetime()  # Formatted timestamp
        }

        db.health_metrics.insert_one(health_data)

        return jsonify({"message": "✅ Health metrics saved successfully!"}), 201

    elif request.method == 'GET':
        """Fetch health metrics for a specific user"""
        email = request.args.get("email")
        if not email:
            return jsonify({"error": "User email is required"}), 400
        
        user_metrics = db.health_metrics.find_one({"email": email}, {"_id": 0})

        if not user_metrics:
            return jsonify({"error": "No health metrics found for this user"}), 404

        return jsonify(user_metrics), 200






@app.route('/api/symptoms', methods=['GET'])
def get_symptoms():
    """Fetch all symptoms logged by a user"""
    email = request.args.get("email")
    
    if not email:
        return jsonify({"error": "User email is required"}), 400

    symptoms = list(db.health_metrics.find({"email": email}, {"_id": 0, "timestamp": 1, "symptoms": 1}))

    if not symptoms:
        return jsonify({"message": "No symptoms found"}), 404

    return jsonify(symptoms)


def determine_health_status(health_record):
    """Determine health status based on vital signs"""
    try:
        blood_pressure = health_record.get("blood_pressure", "0/0")
        systolic, diastolic = map(int, blood_pressure.split("/"))
        heart_rate = int(health_record.get("heart_rate", 0))
        temperature = float(health_record.get("temperature", 0))
        glucose_level = float(health_record.get("glucose_level", 0))
        
        # Default is green ✅
        status = "green"

        # 🚨 Red (Immediate attention needed)
        if systolic > 180 or diastolic > 120:
            status = "red"
        elif heart_rate < 50 or heart_rate > 120:
            status = "red"
        elif temperature < 35 or temperature > 39:
            status = "red"
        elif glucose_level > 180 or glucose_level < 70:
            status = "red"

        # ⚠️ Yellow (Warning, needs monitoring)
        elif 140 <= systolic <= 180 or 90 <= diastolic <= 120:
            status = "yellow"
        elif 50 <= heart_rate < 60 or 100 < heart_rate <= 120:
            status = "yellow"
        elif 37.5 <= temperature <= 39:
            status = "yellow"
        elif 140 <= glucose_level <= 180:
            status = "yellow"

        return status

    except Exception as e:
        print(f"Error determining health status: {e}")
        return "unknown"


# Handle user connection
@socketio.on('join_room')
def handle_connect(data):
    user_email = data.get("email")  # Extract email from received data
    if user_email:
        join_room(user_email)  # Join the user to a room with their email
        print(f"User {user_email} connected and joined room {user_email}")


# Handle incoming messages
@socketio.on('message')
def handle_message(data):
    sender = data.get('sender')
    receiver = data.get('receiver')
    message = data.get('message', "").strip()

    if not sender or not receiver or not message:
        return  # Ignore empty messages

    # Fetch sender's role from either users or doctors collection
    sender_info = users_collection.find_one({"email": sender}) or doctors_collection.find_one({"email": sender})
    sender_role = sender_info.get("role", "unknown") if sender_info else "unknown"

    new_message = {
        "sender": sender,
        "receiver": receiver,
        "message": message,
        "timestamp": format_datetime(),
        "sender_role": sender_role,
        "seen": False
    }

    messages_collection.insert_one(new_message)  # Save to MongoDB

    emit('message', {
        'sender': sender,
        'receiver': receiver,
        'message': message,
        'timestamp': new_message["timestamp"],
        'sender_role': sender_role  
    }, room=receiver)  # Send only to the intended receiver


@app.route('/messages', methods=['GET'])
def get_messages():
    messages = messages_collection.find().sort("timestamp", 1)
    message_list = []
    
    for msg in messages:
        # Fetch role from users or doctors in a single query
        sender_info = users_collection.find_one({"email": msg['sender']}) or doctors_collection.find_one({"email": msg['sender']})
        sender_role = sender_info.get("role", "unknown") if sender_info else "unknown"

        message_list.append({
            'sender': msg['sender'],
            'receiver': msg['receiver'],
            'message': msg['message'],
            'timestamp': msg['timestamp'],
            'sender_role': sender_role  
        })

    return jsonify(message_list)


@app.route('/messages/seen', methods=['POST'])
def mark_messages_as_seen():
    data = request.json
    receiver = data.get('receiver')
    sender = data.get('sender')

    if not receiver or not sender:
        return jsonify({"success": False, "message": "Sender and receiver are required"}), 400

    result = messages_collection.update_many(
        {"sender": sender, "receiver": receiver, "$or": [{"seen": False}, {"seen": {"$exists": False}}]},
        {"$set": {"seen": True}}
    )

    if result.modified_count > 0:
        # Emit an event to notify the receiver
        socketio.emit('messages_seen', {'sender': sender, 'receiver': receiver}, room=receiver)

    return jsonify({"success": True, "message": f"{result.modified_count} messages marked as seen"}), 200


# 🔹 Signup (Mother or General User)
@app.route('/api/signup', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    role = data.get("role", "mother")

    if not email or not password or not phone or not username:
        return jsonify({"error": "All fields are required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user_data = {"username": username,"email": email, "password": hashed_password, "phone": phone, "role": role, "created_at": format_datetime()}
    users_collection.insert_one(user_data)

    return jsonify({"message": "User registered successfully"}), 201


# 🔹 Login
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user["password"].encode('utf-8')):
        return jsonify({"message": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user["_id"]))
    
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "role": user.get("role", "mother")
        }
    })

@app.route("/api/getuserdata", methods=["GET"])
def get_user_data():
    email = request.args.get("email")  # Get email from request params
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = users_collection.find_one({"email": email}, {"_id": 0})  # Exclude `_id`
    
    if user:
        return jsonify(user)
    else:
        return jsonify({"error": "User not found"}), 404

# 🔹 Doctor Signup
@app.route('/doctor/signup', methods=['POST'])
def doctor_signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone')
    specialization = data.get('specialization')
    license_number = data.get('licenseNumber')

    if not email or not password or not phone or not specialization or not license_number:
        return jsonify({"error": "All fields are required"}), 400

    if doctors_collection.find_one({"email": email}):
        return jsonify({"error": "Doctor already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    doctor_data = {
        "email": email,
        "password": hashed_password,
        "phone": phone,
        "specialization": specialization,
        "licenseNumber": license_number,
        "role": "doctor",
        "created_at": datetime.datetime.utcnow()
    }

    doctors_collection.insert_one(doctor_data)

    return jsonify({"message": "Doctor registered successfully"}), 201


# 🔹 Doctor Login
@app.route('/doctor/login', methods=['POST'])
def doctor_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    doctor = doctors_collection.find_one({"email": email, "role": "doctor"})

    if not doctor or not bcrypt.checkpw(password.encode('utf-8'), doctor["password"].encode('utf-8')):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(doctor["_id"]))

    return jsonify({
        "message": "Login successful",
        "token": token,
        "doctor": {
            "id": str(doctor["_id"]),
            "email": doctor["email"],
            "specialization": doctor["specialization"],
            "role": "doctor"
        }
    }), 200

# Route to update doctor status (Login)
@app.route('/update_status', methods=['POST'])
def update_status():
    data = request.json
    doctor_email = data.get("doctor_email")
    status = data.get("status")  # Should be either "online" or "offline"

    if not doctor_email or status not in ["online", "offline"]:
        return jsonify({"error": "Invalid request"}), 400

    # Update the doctor's status in the database
    result = doctors_collection.update_one(
        {"email": doctor_email}, 
        {"$set": {"status": status}}
    )

    if result.modified_count > 0:
        return jsonify({"message": f"Status updated to {status}"}), 200
    else:
        return jsonify({"error": "Doctor not found or status unchanged"}), 404

# Run the Flask app
if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
