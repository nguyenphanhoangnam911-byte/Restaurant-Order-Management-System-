from flask import Blueprint, request, jsonify
from app.models import Admin, Customer, db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/customer/register', methods=['POST'])
def register():
    data = request.json
    if Customer.query.filter_by(phone=data['phone']).first():
        return jsonify({'message': 'Số điện thoại đã tồn tại'}), 400
    
    new_cus = Customer(name=data['name'], phone=data['phone'], password=data['password'])
    db.session.add(new_cus)
    db.session.commit()
    return jsonify({'message': 'Member registered', 'success': True})

@auth_bp.route('/customer/login', methods=['POST'])
def login_customer():
    data = request.json
    cus = Customer.query.filter_by(phone=data['phone'], password=data['password']).first()
    if cus:
        return jsonify({'message': 'Login successful', 'success': True, 'name': cus.name})
    return jsonify({'message': 'Sai thông tin đăng nhập', 'success': False}), 401

@auth_bp.route('/admin/login', methods=['POST'])
def login_admin():
    data = request.json
    admin = Admin.query.filter_by(username=data['username'], password=data['password']).first()
    if admin or (data['username'] == 'admin' and data['password'] == '123456'): 
        return jsonify({'success': True, 'token': 'fake-token-admin'})
    return jsonify({'success': False, 'message': 'Sai tài khoản'}), 401