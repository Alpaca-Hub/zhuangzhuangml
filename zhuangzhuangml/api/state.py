from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import IPythonHandler
import os, json, git, urllib, requests
from git import Repo, GitCommandError
from subprocess import check_output
import subprocess

repo = None
htable = []

# def delete_cell():
#     if cell in htable:
#         del htable[cell]
#         return True
#     return False

# def register_cell(cell, content):
#     filename = str(config['GIT_PARENT_DIR'] + "/" + os.environ.get('GIT_REPO_NAME') + str(cell) + filename.replace('ipynb', 'txt'))
#     subprocess.run(['cat', content, '>', filename])
#     print(repo.git.add(filename))
#     print(repo.git.commit( a=False, m="\nUpdated {}".format(filename) ))
    
