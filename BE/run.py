from app import create_app
from app.models import db, Food, Table

app = create_app()

# Hàm này để tạo dữ liệu mẫu nếu DB trống
def seed_data():
    with app.app_context():
        # Kiểm tra xem có món nào chưa, nếu chưa thì tạo mẫu
        if not Food.query.first():
            print("Dang tao du lieu mau...")
            f1 = Food(name='Beef Pho', description='Ngon', price=45000, category_id='soups', image='https://images.unsplash.com/photo-1631709497146-a239ef373cf1')
            f2 = Food(name='Banh Mi', description='Gion', price=25000, category_id='main-dishes', image='https://images.unsplash.com/photo-1599719455360-ff0be7c4dd06')
            
            # Tạo bàn mẫu
            t1 = Table(id='1', number=1, seats=4, status='available')
            t2 = Table(id='2', number=2, seats=2, status='occupied')
            
            db.session.add_all([f1, f2, t1, t2])
            db.session.commit()
            print("Da tao xong du lieu mau!")

if __name__ == '__main__':
    seed_data()
    app.run(debug=True, port=5000)