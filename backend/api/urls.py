from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    StudentViewSet,
    StudentGroupViewSet,
    ProjectViewSet,
    TicketViewSet,
    PaymentViewSet,
    RegisterStudentLeaderView,
    CurrentUserView
)

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'groups', StudentGroupViewSet, basename='group')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'payments', PaymentViewSet, basename='payment')

urlpatterns = [
    # Auth Endpoints
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current_user'),
    
    # Custom Registration for Student Leaders
    path('students/register-leader/', RegisterStudentLeaderView.as_view(), name='register_leader'),
    
    # Model ViewSets
    path('', include(router.urls)),
]
