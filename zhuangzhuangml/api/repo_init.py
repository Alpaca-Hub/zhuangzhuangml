from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import IPythonHandler
import os, json, git, urllib, requests
from git import Repo, GitCommandError
from subprocess import check_output
import subprocess
import state

class RepoInitHandler(IPythonHandler):
    def put(self):
        # prep data
        data = json.loads(self.request.body.decode('utf-8'))
        git_repo_name = jupyter_uuid = data['jupyter_uuid']
        git_dir = "{}/{}".format(os.path.expandvars(os.environ.get('GIT_PARENT_DIR')), os.path.expandvars(git_repo_name))
        git_user = os.path.expandvars(os.environ.get('GIT_USER'))
        git_branch = git_remote = os.path.expandvars(os.environ.get('GIT_BRANCH_NAME'))
        git_dir_parent = os.path.dirname(git_dir)

        # get current directory (to return later)
        cwd = os.getcwd()

        try:
            os.chdir(git_dir)
            dir_repo = check_output(['git','rev-parse','--show-toplevel']).strip()
            repo = state.repo = Repo(dir_repo.decode('utf8'))
            success = False
            msg = 'repo already intialized'
        except GitCommandError as e: # new
            repo = state.repo = Repo.init(git_dir)
            success = True
            msg = f'repo initialized at {git_dir}'
        
        self.write({
            status: success,
            msg: msg
        })
        
        
            