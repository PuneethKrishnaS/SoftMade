from rest_framework import serializers
from .models import User, Student, Project, Ticket, Payment, TicketMessage

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']
        read_only_fields = ['id']

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Student
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    students = StudentSerializer(many=True, read_only=True)
    leader = StudentSerializer(read_only=True)
    assigned_developer = UserSerializer(read_only=True)
    tickets = serializers.SerializerMethodField()
    payments = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = '__all__'
        
    def get_tickets(self, obj):
        return [
            {
                "id": t.id,
                "title": t.title,
                "status": t.status,
                "priority": t.priority,
                "created_at": t.created_at
            }
            for t in obj.tickets.all()
        ]
        
    def get_payments(self, obj):
        return [
            {
                "id": p.id,
                "amount": p.amount,
                "description": p.description,
                "status": p.status,
                "due_date": p.due_date,
                "paid_date": p.paid_date,
                "transaction_id": p.transaction_id
            }
            for p in obj.payments.all()
        ]

class TicketMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_role = serializers.CharField(source='sender.role', read_only=True)

    class Meta:
        model = TicketMessage
        fields = ['id', 'ticket', 'sender', 'sender_name', 'sender_role', 'message', 'is_read', 'created_at']

    def get_sender_name(self, obj):
        return obj.sender.get_full_name() or obj.sender.username

class TicketSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    messages = TicketMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Ticket
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    
    class Meta:
        model = Payment
        fields = '__all__'

# Custom Serializer for "Add Student" which creates User, Group, and Student
class CreateStudentSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    contact_number = serializers.CharField(max_length=20)
    usn = serializers.CharField(max_length=50)
    college_name = serializers.CharField(max_length=255)
    branch = serializers.CharField(max_length=100, required=False, allow_blank=True)
    semester = serializers.IntegerField(required=False, default=1)
    password = serializers.CharField(write_only=True)

    def validate_usn(self, value):
        username = value.lower()
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError(f"A student with USN '{value}' is already registered.")
        return value

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

        # 2. Create the Student Profile (Leader)
        student = Student.objects.create(
            user=user,
            usn=validated_data['usn'],
            college_name=validated_data['college_name'],
            department=validated_data.get('branch', ''),
            semester=validated_data.get('semester', 1),
            phone=validated_data['contact_number']
        )
        return student

class CreateProjectSerializer(serializers.ModelSerializer):
    leader_usn = serializers.CharField(write_only=True)

    class Meta:
        model = Project
        fields = ['title', 'description', 'technology', 'category', 'status', 'leader_usn', 'assigned_developer', 'start_date', 'deadline', 'github_repo', 'total_price', 'advance_payment']

    def validate_leader_usn(self, value):
        try:
            student = Student.objects.get(usn=value)
            return value
        except Student.DoesNotExist:
            raise serializers.ValidationError("Student with this USN does not exist.")

    def create(self, validated_data):
        leader_usn = validated_data.pop('leader_usn')
        student = Student.objects.get(usn=leader_usn)
        project = super().create(validated_data)
        project.leader = student
        project.students.add(student)
        project.save()
        return project
