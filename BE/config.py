import os
from dotenv import load_dotenv
from urllib.parse import quote_plus # Thư viện giúp xử lý ký tự đặc biệt

load_dotenv()

class Config:
    # Lấy thông tin từ .env
    user = os.getenv('DB_USERNAME', 'root')
    password = os.getenv('DB_PASSWORD', '')
    host = os.getenv('DB_HOST', 'localhost')
    dbname = os.getenv('DB_NAME', 'restaurant_db')

    # Xử lý mật khẩu để tránh lỗi nếu có ký tự lạ (@, #, /...)
    encoded_password = quote_plus(password)

    # Tạo chuỗi kết nối chuẩn
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{user}:{encoded_password}@{host}/{dbname}"
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-key')