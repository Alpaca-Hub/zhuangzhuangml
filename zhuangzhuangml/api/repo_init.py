from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import IPythonHandler
import os, json, git, urllib, requests
from git import Repo, GitCommandError
from subprocess import check_output
import subprocess
from zhuangzhuangml.api import state

class RepoInitHandler(IPythonHandler):
    def put(self):
        print('handling /repo/init')
        # with open('conf.json', 'r') as json_file:
        #     config = json.load(json_file)
        config = state.config
        # prep data
        print('!!! request is')
        print(self.request.body)
        print(self.request.body.decode('utf-8'))
        data = json.loads(self.request.body.decode('utf-8'))
        git_repo_name = jupyter_uuid = data['jupyter_uuid']
        git_parent_dir = config['GIT_PARENT_DIR']
        git_dir = "{}/{}".format(git_parent_dir, git_repo_name)
        git_user = config['GIT_USER']
        git_branch = git_remote = config['GIT_BRANCH_NAME']
        git_dir_parent = os.path.dirname(git_dir)

        # get current directory (to return later)
        cwd = os.getcwd()

        if not os.path.isdir(git_parent_dir):
            os.mkdir(git_parent_dir)
            print('made git parent dir:',git_parent_dir)

        if not os.path.isdir(git_dir):
            os.mkdir(git_dir)
            print('making git repo dir:',git_dir)

        os.chdir(git_dir)

        try:
            dir_repo = check_output(['git','rev-parse','--show-toplevel']).strip()
            repo = state.repo = Repo(dir_repo.decode('utf8'))
            success = False
            msg = 'repo already intialized'
        except: # new
            repo = state.repo = Repo.init(git_dir)
            success = True
            msg = f'repo initialized at {git_dir}'
        
        self.write({
            'status': success,
            'msg': msg
        })
        
        
            