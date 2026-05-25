from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .github_services import get_project_releases, get_project_documents, get_project_readme

from .models import Student, Project, Ticket, Payment
from .serializers import (
    UserSerializer,
    StudentSerializer,
    ProjectSerializer,
    TicketSerializer,
    CreateStudentSerializer,
    CreateProjectSerializer,
    PaymentSerializer
)

User = get_user_model()

class RegisterStudentView(generics.CreateAPIView):
    """
    Endpoint for Admin to register a new Student.
    This creates the User, StudentGroup, and Student models all at once.
    """
    serializer_class = CreateStudentSerializer
    permission_classes = [AllowAny] # In production, this should be IsAuthenticated & IsAdminUser

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        response_serializer = StudentSerializer(student)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().select_related('user')
    serializer_class = StudentSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['get'])
    def get_by_usn(self, request):
        usn = request.query_params.get('usn')
        if not usn:
            return Response({"error": "USN parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            student = Student.objects.get(usn__iexact=usn)
            return Response(StudentSerializer(student).data)
        except Student.DoesNotExist:
            return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny] # Ideally IsAuthenticated

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'STUDENT':
            try:
                student = user.student_profile
                return Project.objects.filter(students=student).select_related('assigned_developer').prefetch_related('students')
            except Student.DoesNotExist:
                return Project.objects.none()
        return Project.objects.all().select_related('assigned_developer').prefetch_related('students')

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateProjectSerializer
        return ProjectSerializer
        
    @action(detail=True, methods=['get'])
    def github_releases(self, request, pk=None):
        project = self.get_object()
        if not project.github_repo:
            return Response({"error": "No GitHub repository linked to this project."}, status=status.HTTP_400_BAD_REQUEST)
        
        releases = get_project_releases(project.github_repo)
        return Response(releases)
        
    @action(detail=True, methods=['get'])
    def github_documents(self, request, pk=None):
        project = self.get_object()
        path = request.query_params.get('path', '')
        if not project.github_repo:
            return Response({"error": "No GitHub repository linked to this project."}, status=status.HTTP_400_BAD_REQUEST)
        
        docs = get_project_documents(project.github_repo, path)
        return Response(docs)

    @action(detail=True, methods=['get'])
    def github_readme(self, request, pk=None):
        project = self.get_object()
        if not project.github_repo:
            return Response({"error": "No GitHub repository linked to this project."}, status=status.HTTP_400_BAD_REQUEST)
        
        readme = get_project_readme(project.github_repo)
        if readme is None:
            return Response({"error": "README not found."}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({"content": readme})

    @action(detail=True, methods=['post'])
    def add_student(self, request, pk=None):
        project = self.get_object()
        usn = request.data.get('usn')
        if not usn:
            return Response({"error": "USN is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if project.students.count() >= 5:
            return Response({"error": "Project already has the maximum of 5 students."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = Student.objects.get(usn__iexact=usn)
            if project.students.filter(id=student.id).exists():
                return Response({"error": "Student is already in this project."}, status=status.HTTP_400_BAD_REQUEST)
                
            project.students.add(student)
            return Response({"status": "Student added successfully", "student": StudentSerializer(student).data})
        except Student.DoesNotExist:
            return Response({"error": f"Student with USN {usn} not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def remove_student(self, request, pk=None):
        project = self.get_object()
        usn = request.data.get('usn')
        if not usn:
            return Response({"error": "USN is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            student = Student.objects.get(usn__iexact=usn)
            if not project.students.filter(id=student.id).exists():
                return Response({"error": "Student is not in this project."}, status=status.HTTP_400_BAD_REQUEST)
                
            project.students.remove(student)
            if project.leader == student:
                project.leader = None
                project.save()
            return Response({"status": "Student removed successfully"})
        except Student.DoesNotExist:
            return Response({"error": f"Student with USN {usn} not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def set_leader(self, request, pk=None):
        project = self.get_object()
        usn = request.data.get('usn')
        if not usn:
            return Response({"error": "USN is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            student = Student.objects.get(usn=usn)
            if student not in project.students.all():
                return Response({"error": f"Student {usn} must be part of the project to be a leader"}, status=status.HTTP_400_BAD_REQUEST)
            project.leader = student
            project.save()
            return Response({"status": "Team leader updated successfully", "leader": StudentSerializer(student).data})
        except Student.DoesNotExist:
            return Response({"error": f"Student with USN {usn} not found"}, status=status.HTTP_404_NOT_FOUND)

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == 'STUDENT':
            try:
                student = user.student_profile
                from django.db.models import Q
                return Ticket.objects.filter(
                    Q(student=student) | Q(project__students=student) | Q(project__leader=student)
                ).distinct().select_related('student', 'project').order_by('-created_at')
            except Student.DoesNotExist:
                return Ticket.objects.none()
        return Ticket.objects.all().select_related('student', 'project').order_by('-created_at')

    def perform_create(self, serializer):
        project_id = self.request.data.get('project')
        student_id = self.request.data.get('student')
        project = get_object_or_404(Project, id=project_id) if project_id else None
        
        user = self.request.user
        if user.role == 'STUDENT':
            student = user.student_profile
        else:
            student = get_object_or_404(Student, id=student_id) if student_id else None
            
        serializer.save(student=student, project=project)

    def perform_update(self, serializer):
        old_status = serializer.instance.status
        instance = serializer.save()
        if old_status != instance.status:
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'ticket_{instance.id}',
                {
                    'type': 'status_update',
                    'status': instance.status
                }
            )

    @action(detail=True, methods=['post'])
    def upload_attachment(self, request, pk=None):
        from .github_services import upload_file_to_github
        import time
        ticket = self.get_object()
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)
            
        if not ticket.project or not ticket.project.github_repo:
            return Response({"error": "No GitHub repository linked to this project."}, status=status.HTTP_400_BAD_REQUEST)
            
        file_bytes = file_obj.read()
        safe_name = f"{int(time.time())}_{file_obj.name.replace(' ', '_')}"
        
        download_url, error_msg = upload_file_to_github(ticket.project.github_repo, safe_name, file_bytes)
        if not download_url:
            return Response({
                "error": "Failed to upload file to GitHub.",
                "details": error_msg or "Check if your GITHUB_TOKEN has write ('repo') permissions."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        # Return the safe name to construct the proxy URL on the frontend
        return Response({"safe_name": safe_name, "file_name": file_obj.name})

    @action(detail=True, methods=['get'])
    def attachment(self, request, pk=None):
        from .github_services import get_github_client
        import mimetypes
        from django.http import HttpResponse
        
        ticket = self.get_object()
        name = request.query_params.get('name')
        if not name or not ticket.project or not ticket.project.github_repo:
            return Response({"error": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
            
        client = get_github_client()
        if not client:
            return Response({"error": "GitHub client not configured."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        try:
            repo = client.get_repo(ticket.project.github_repo)
            content_file = repo.get_contents(f"uploads/tickets/{name}")
            file_bytes = content_file.decoded_content
            
            content_type, _ = mimetypes.guess_type(name)
            response = HttpResponse(file_bytes, content_type=content_type or 'application/octet-stream')
            response['Content-Disposition'] = f'inline; filename="{name}"'
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

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

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [AllowAny]

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
