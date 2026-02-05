from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Cho phép Frontend gọi API
    CORS(app)
    
    db.init_app(app)
    
    # Import routes (Lưu ý: Phải để bên trong hàm này để tránh lỗi vòng lặp)
    from app.routes.auth_routes import auth_bp
    from app.routes.customer_routes import customer_bp
    from app.routes.admin_routes import admin_bp

    # Đăng ký routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(customer_bp, url_prefix='/api/customer')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Tạo bảng DB nếu chưa có
    with app.app_context():
        db.create_all()

    return app