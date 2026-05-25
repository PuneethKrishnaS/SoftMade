import os
import base64
from github import Github, GithubException

def get_github_client():
    token = os.environ.get('GITHUB_TOKEN')
    if not token:
        return None
    return Github(token)

def get_project_releases(repo_name):
    client = get_github_client()
    if not client or not repo_name:
        return []
    
    try:
        repo = client.get_repo(repo_name)
        releases = repo.get_releases()
        return [
            {
                "id": r.id,
                "name": r.title,
                "tag_name": r.tag_name,
                "published_at": r.published_at.isoformat() if r.published_at else None,
                "assets": [{"name": a.name, "download_url": a.browser_download_url} for a in r.get_assets()]
            }
            for r in releases
        ]
    except GithubException:
        return []

def get_project_documents(repo_name, path=""):
    client = get_github_client()
    if not client or not repo_name:
        return []
    
    try:
        repo = client.get_repo(repo_name)
        documents = []
        
        # Get all contents
        try:
            root_contents = repo.get_contents(path)
            if not isinstance(root_contents, list): root_contents = [root_contents]
            documents.extend(root_contents)
        except GithubException:
            pass

        return [
            {
                "name": c.name,
                "path": c.path,
                "type": c.type, # "dir" or "file"
                "download_url": c.download_url,
                "size": c.size
            }
            for c in documents
        ]
    except GithubException:
        return []

def get_project_readme(repo_name):
    client = get_github_client()
    if not client or not repo_name:
        return None
        
    try:
        repo = client.get_repo(repo_name)
        readme = repo.get_readme()
        # Decode the base64 content
        return base64.b64decode(readme.content).decode('utf-8')
    except GithubException:
        return None

def upload_file_to_github(repo_name, file_name, content_bytes, commit_message="Upload attachment"):
    client = get_github_client()
    if not client or not repo_name:
        return None, "GitHub client not configured."
        
    try:
        repo = client.get_repo(repo_name)
        path = f"uploads/tickets/{file_name}"
        # Create file in GitHub
        res = repo.create_file(path, commit_message, content_bytes, branch="main")
        # return the raw download url
        return res['content'].download_url, None
    except GithubException as e:
        print("GitHub Upload Error:", e.data)
        return None, e.data.get('message', str(e))
