from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('SUPERADMIN', 'Super Admin'),
        ('ADMIN', 'Admin'),
        ('STUDENT', 'Student'),
        ('DEVELOPER', 'Developer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='STUDENT')
    
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='api_user_set',
        blank=True,
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='api_user_set',
        blank=True,
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.username

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    usn = models.CharField(max_length=50, unique=True)
    college_name = models.CharField(max_length=255, default='')
    department = models.CharField(max_length=255, default='')
    semester = models.IntegerField(default=1)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self.user.get_full_name() or self.user.username

class Project(models.Model):
    STAGE_CHOICES = (
        ('REQUIREMENT', 'Requirement Collection'),
        ('TOPIC', 'Topic Finalization'),
        ('SYNOPSIS', 'Synopsis Preparation'),
        ('DESIGN', 'UI/UX Design'),
        ('FRONTEND', 'Frontend Development'),
        ('BACKEND', 'Backend Development'),
        ('DATABASE', 'Database Integration'),
        ('TESTING', 'Testing Phase'),
        ('REPORT', 'Report Preparation'),
        ('DEPLOYMENT', 'Deployment'),
        ('DELIVERED', 'Final Delivery'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    technology = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    github_repo = models.CharField(max_length=255, blank=True, null=True, help_text="Format: owner/repo (e.g. PuneethKrishnaS/SoftMade)")
    leader = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_projects')
    students = models.ManyToManyField(Student, related_name='projects', blank=True)
    assigned_developer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_projects')
    start_date = models.DateField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STAGE_CHOICES, default='REQUIREMENT')
    progress_percentage = models.IntegerField(default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    advance_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return self.title

class Ticket(models.Model):
    STATUS_CHOICES = (
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('REJECTED', 'Rejected'),
    )
    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='tickets')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tickets')
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title

class Payment(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('OVERDUE', 'Overdue'),
        ('FAILED', 'Failed'),
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, blank=True, null=True, default='Payment')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    due_date = models.DateField(null=True, blank=True)
    paid_date = models.DateField(null=True, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title} - {self.amount} ({self.status})"
