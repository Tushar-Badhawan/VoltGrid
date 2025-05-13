import pymysql
import bcrypt

def get_db_connection():
    return pymysql.connect(
        host="localhost",
        user="root",
        password="admin@123",
        database="VoltGrid",
        cursorclass=pymysql.cursors.DictCursor
    )

def register_user(username, password):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            if cursor.fetchone():
                return False, "Username already exists"

            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            cursor.execute("INSERT INTO users (username, password) VALUES (%s, %s)", (username, hashed.decode('utf-8')))
            connection.commit()
            return True, "Registration successful"
    except Exception as e:
        print("❌ Register error:", e)
        return False, "Server error"
    finally:
        if 'connection' in locals():
            connection.close()

def login_user(username, password):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()

            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                return True, "Login successful"
            return False, "Incorrect username or password"
    except Exception as e:
        print("❌ Login error:", e)
        return False, "Server error"
    finally:
        if 'connection' in locals():
            connection.close()
