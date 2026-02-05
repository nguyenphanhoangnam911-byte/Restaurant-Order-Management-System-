from flask import Blueprint, jsonify, request
from app.models import db, Order, OrderItem, Food, Table

admin_bp = Blueprint('admin', __name__)

# --- 1. ĐĂNG NHẬP ---
@admin_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if data.get('username') == 'admin' and data.get('password') == '123456':
        return jsonify({'success': True, 'message': 'Login successful'})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# --- 2. LẤY DỮ LIỆU DASHBOARD ---
@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    try:
        foods = Food.query.all()
        tables = Table.query.all()
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
        print(e)
        return jsonify({'foods': [], 'tables': [], 'orders': []}), 500

# --- 3. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
@admin_bp.route('/order/update-status', methods=['POST'])
def update_order_status():
    data = request.json
    order = Order.query.get(data['order_id'])
    if order:
        order.status = data['status']
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 404

# --- 4. QUẢN LÝ MÓN ĂN (PHẦN BỊ THIẾU LÚC NÃY) ---
@admin_bp.route('/food/add', methods=['POST'])
def add_food():
    data = request.json
    new_food = Food(
        name=data['name'],
        price=data['price'],
        description=data.get('description', ''),
        image=data.get('image', ''),
        category_id=data['categoryId']
    )
    db.session.add(new_food)
    db.session.commit()
    return jsonify({'success': True})

@admin_bp.route('/food/update', methods=['POST'])
def update_food():
    data = request.json
    food = Food.query.get(data['id'])
    if food:
        food.name = data.get('name', food.name)
        food.price = data.get('price', food.price)
        food.description = data.get('description', food.description)
        food.image = data.get('image', food.image)
        food.category_id = data.get('categoryId', food.category_id)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 404

@admin_bp.route('/food/delete', methods=['POST'])
def delete_food():
    data = request.json
    food = Food.query.get(data['id'])
    if food:
        db.session.delete(food)
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 404

@admin_bp.route('/table/update-status', methods=['POST'])
def update_table_status():
    data = request.json
    table_id = data.get('id')
    status = data.get('status')
    
    table = Table.query.get(table_id)
    if table:
        table.status = status
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Table not found'}), 404

@admin_bp.route('/table/add', methods=['POST'])
def add_table():
    data = request.json
    
    # Kiểm tra xem số bàn đã tồn tại chưa để tránh lỗi
    existing_table = Table.query.filter_by(number=data['number']).first()
    if existing_table:
        return jsonify({'success': False, 'message': 'Bàn số này đã tồn tại'}), 400

    new_table = Table(
        id=str(data.get('id', data['number'])), # Dùng luôn ID gửi lên hoặc lấy số bàn làm ID
        number=data['number'],
        seats=data['seats'],
        status='available' # Mặc định bàn mới là trống
    )
    db.session.add(new_table)
    db.session.commit()
    return jsonify({'success': True})