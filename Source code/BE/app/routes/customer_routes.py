from flask import Blueprint, jsonify, request
from app.models import db, Food, Order, OrderItem, Customer,Table
from datetime import datetime

customer_bp = Blueprint('customer', __name__)

# 1. API LẤY MENU
@customer_bp.route('/menu', methods=['GET'])
def get_menu():
    foods = Food.query.all()
    return jsonify([{
        'id': str(f.id),
        'name': f.name,
        'price': f.price,
        'image': f.image,
        'categoryId': f.category_id,
        'description': f.description
    } for f in foods])

# 2. API ĐĂNG KÝ (Giữ nguyên)
@customer_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if Customer.query.filter_by(phone=data['phone']).first():
        return jsonify({'success': False, 'message': 'Phone already exists'})
    new_cus = Customer(name=data['name'], phone=data['phone'], password=data['password'])
    db.session.add(new_cus)
    db.session.commit()
    return jsonify({'success': True, 'name': new_cus.name})

# 3. API ĐĂNG NHẬP (Giữ nguyên)
@customer_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    cus = Customer.query.filter_by(phone=data['phone'], password=data['password']).first()
    if cus:
        return jsonify({'success': True, 'name': cus.name})
    return jsonify({'success': False, 'message': 'Invalid credentials'})

# 4. API ĐẶT MÓN 
@customer_bp.route('/orders', methods=['POST'])
def place_order():
    data = request.json
    print(" Dữ liệu nhận được:", data) 

    # 1. Lấy số bàn chuẩn
    t_num = data.get('tableNumber') or data.get('table_number') or data.get('table_id') or 0

    if t_num == 0:
        return jsonify({'success': False, 'message': 'Thiếu số bàn'}), 400

    # 2. Tạo đơn hàng mới
    new_order = Order(
        table_number=int(t_num),
        total=data['total'],
        status='pending',
        created_at=datetime.now()
    )
    db.session.add(new_order)
    
    current_table = Table.query.filter_by(number=int(t_num)).first()
    if current_table:
        current_table.status = 'occupied' # Đổi ngay sang trạng thái Có khách
        db.session.add(current_table)     # Đánh dấu để lưu

    # 4. Lưu chi tiết món ăn
    for item in data['items']:
        order_item = OrderItem(
            order_id=new_order.id,
            food_name=item.get('name', 'Món ăn'),
            quantity=item['quantity'],
            price=item.get('price', 0)
        )
        db.session.add(order_item)
    
    # 5. Lưu tất cả xuống Database
    db.session.commit()
    
    print(f" Đã lưu đơn hàng Bàn {t_num} và chuyển trạng thái sang Busy!")
    return jsonify({'success': True, 'order_id': new_order.id})