from flask import Blueprint, request, jsonify
from app.models import Food, Order, OrderItem, db

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/menu', methods=['GET'])
def get_menu():
    foods = Food.query.all()
    # Chuyển đổi sang JSON khớp với Frontend
    return jsonify([{
        'id': str(f.id),
        'name': f.name,
        'description': f.description,
        'price': f.price,
        'image': f.image,
        'categoryId': f.category_id
    } for f in foods])

@customer_bp.route('/orders', methods=['POST'])
def place_order():
    data = request.json
    # Tạo đơn hàng
    new_order = Order(
        table_number=1, # Tạm thời fix cứng bàn số 1
        customer_phone=data.get('member_phone'),
        status='pending'
    )
    db.session.add(new_order)
    db.session.commit()

    total = 0
    items = data.get('items', [])
    for item in items:
        food = Food.query.get(int(item['item_id']))
        if food:
            detail = OrderItem(
                order_id=new_order.id,
                food_name=food.name,
                quantity=item['quantity'],
                price=food.price
            )
            total += food.price * item['quantity']
            db.session.add(detail)
    
    # Nếu là thành viên giảm 5%
    if data.get('member_phone'):
        total = total * 0.95

    new_order.total = total
    db.session.commit()
    
    return jsonify({'success': True, 'order_id': new_order.id})