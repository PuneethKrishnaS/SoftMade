import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
if not User.objects.filter(username='admin').exists():
    user = User.objects.create_superuser('admin', 'admin@softmade.com', 'admin123')
    user.role = 'SUPERADMIN'
    user.save()
    print("✅ Admin user created successfully! Username: admin, Password: admin123")
else:
    user = User.objects.get(username='admin')
    user.set_password('admin123')
    user.role = 'SUPERADMIN'
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print("✅ Admin user already existed, password reset to: admin123")
