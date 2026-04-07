from django.contrib.auth import get_user_model

try:
    User = get_user_model()
    # Check if user already exists
    if User.objects.filter(username='analyst_demo').exists():
        user = User.objects.get(username='analyst_demo')
        print("User already exists, updating role and password...")
    else:
        user = User.objects.create_user(username='analyst_demo', email='analyst@gmail.com')
        print("Created new analyst_demo user...")
        
    user.set_password('qwerty')
    user.role = 'ANALYST'
    user.save()
    print("SUCCESS: analyst_demo account configured!")
except Exception as e:
    print(f"ERROR: {str(e)}")
