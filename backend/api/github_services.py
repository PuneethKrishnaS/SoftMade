import os
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

def get_project_documents(repo_name, path="docs"):
    client = get_github_client()
    if not client or not repo_name:
        return []
    
    try:
        repo = client.get_repo(repo_name)
        contents = repo.get_contents(path)
        
        # If it's a single file, make it a list
        if not isinstance(contents, list):
            contents = [contents]
            
        return [
            {
                "name": c.name,
                "path": c.path,
                "download_url": c.download_url,
                "size": c.size
            }
            for c in contents if c.type == "file"
        ]
    except GithubException:
        # Folder might not exist yet
        return []
