from rest_framework import serializers
from .models import User, StudentGroup, Student, Project, Ticket

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = ['id']

class StudentGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentGroup
        fields = '__all__'

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    group = StudentGroupSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    group = StudentGroupSerializer(read_only=True)
    assigned_developer = UserSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = '__all__'

# Custom Serializer for "Add Student Leader" which creates User, Group, and Student
class CreateStudentLeaderSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    contact_number = serializers.CharField(max_length=20)
    usn = serializers.CharField(max_length=50)
    college_name = serializers.CharField(max_length=255)
    branch = serializers.CharField(max_length=100, required=False, allow_blank=True)
    semester = serializers.IntegerField(required=False, default=1)
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        # 1. Create the User
        username = validated_data['usn'].lower()
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['full_name'],
            role='STUDENT'
        )

        # 2. Create the Group
        group = StudentGroup.objects.create(
            name=f"Group_{validated_data['usn']}",
            college_name=validated_data['college_name'],
            department=validated_data.get('branch', ''),
            semester=validated_data.get('semester', 1)
        )

        # 3. Create the Student Profile (Leader)
        student = Student.objects.create(
            user=user,
            usn=validated_data['usn'],
            group=group,
            phone=validated_data['contact_number']
        )
        return student

class CreateProjectSerializer(serializers.ModelSerializer):
    leader_usn = serializers.CharField(write_only=True)

    class Meta:
        model = Project
        fields = ['title', 'description', 'technology', 'category', 'status', 'leader_usn', 'start_date', 'deadline', 'github_repo']

    def validate_leader_usn(self, value):
        try:
            student = Student.objects.get(usn=value)
            if not student.group:
                raise serializers.ValidationError("Student does not belong to a group.")
            return value
        except Student.DoesNotExist:
            raise serializers.ValidationError("Student with this USN does not exist.")

    def create(self, validated_data):
        leader_usn = validated_data.pop('leader_usn')
        student = Student.objects.get(usn=leader_usn)
        validated_data['group'] = student.group
        return super().create(validated_data)
