from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from .models import StudentGroup, Student, Project, Ticket
from .serializers import (
    UserSerializer,
    StudentGroupSerializer,
    StudentSerializer,
    ProjectSerializer,
    TicketSerializer,
    CreateStudentLeaderSerializer,
    CreateProjectSerializer
)

User = get_user_model()

class RegisterStudentLeaderView(generics.CreateAPIView):
    """
    Endpoint for Admin to register a new Student Leader.
    This creates the User, StudentGroup, and Student models all at once.
    """
    serializer_class = CreateStudentLeaderSerializer
    permission_classes = [AllowAny] # In production, this should be IsAuthenticated & IsAdminUser

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        response_serializer = StudentSerializer(student)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().select_related('user', 'group')
    serializer_class = StudentSerializer
    permission_classes = [AllowAny]

class StudentGroupViewSet(viewsets.ModelViewSet):
    queryset = StudentGroup.objects.all()
    serializer_class = StudentGroupSerializer
    permission_classes = [AllowAny]

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny] # Ideally IsAuthenticated

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'STUDENT':
            try:
                group_id = user.student_profile.group_id
                return Project.objects.filter(group_id=group_id).select_related('group', 'assigned_developer')
            except Student.DoesNotExist:
                return Project.objects.none()
        return Project.objects.all().select_related('group', 'assigned_developer')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateProjectSerializer
        return ProjectSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().select_related('student', 'project')
    serializer_class = TicketSerializer
    permission_classes = [AllowAny]

class CurrentUserView(APIView):
    """
    Returns the currently authenticated user and their associated student profile (if any).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = UserSerializer(user).data
        if user.role == 'STUDENT':
            try:
                student = user.student_profile
                data['student_profile'] = StudentSerializer(student).data
            except Student.DoesNotExist:
                pass
        return Response(data)
