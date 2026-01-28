from flask import Blueprint, jsonify, request
from app.models import db, Order, OrderItem, Food, Table
import datetime

admin_bp = Blueprint('admin', __name__)

# 1. API ĐĂNG NHẬP (QUAN TRỌNG ĐỂ KHÔNG BỊ LỖI KẾT NỐI)
@admin_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    # Tài khoản Admin mặc định
    if username == 'admin' and password == '123456':
        return jsonify({'success': True, 'message': 'Login successful'})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# 2. API LẤY DỮ LIỆU DASHBOARD
@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    try:
        foods = Food.query.all()
        tables = Table.query.all()
        # Lấy đơn hàng mới nhất
        orders_db = Order.query.order_by(Order.created_at.desc()).all()
        
        orders_data = []
        for o in orders_db:
            items = OrderItem.query.filter_by(order_id=o.id).all()
            orders_data.append({
                'id': str(o.id),
                'tableNumber': o.table_number,
                'status': o.status,
                'total': o.total,
                'createdAt': o.created_at,
                'items': [{'name': i.food_name, 'quantity': i.quantity, 'price': i.price} for i in items]
            })

        return jsonify({
            'foods': [{'id': str(f.id), 'name': f.name, 'price': f.price, 'image': f.image, 'categoryId': f.category_id, 'description': f.description} for f in foods],
            'tables': [{'id': t.id, 'number': t.number, 'seats': t.seats, 'status': t.status} for t in tables],
            'orders': orders_data
        })
    except Exception as e:
        print("Error:", e)
        return jsonify({'foods': [], 'tables': [], 'orders': []}), 500

# 3. API CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
@admin_bp.route('/order/update-status', methods=['POST'])
def update_order_status():
    data = request.json
    order = Order.query.get(data['order_id'])
    if order:
        order.status = data['status']
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Order not found'}), 404