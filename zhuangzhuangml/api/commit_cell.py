from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import IPythonHandler
import os, json, git, urllib, requests
from git import Repo, GitCommandError
from subprocess import check_output
import subprocess
import state
import json 

class CommitCellHandler(IPythonHandler):
    def put(self):
        # prep data
        with open('conf.json', 'r') as json_file:
            config = json.load(json_file)
        data = json.loads(self.request.body.decode('utf-8'))
        git_repo_name = jupyter_uuid = data['jupyter_uuid']
        git_dir = "{}/{}".format(os.path.expandvars(config['GIT_PARENT_DIR']), os.path.expandvars(git_repo_name))
        git_user = os.path.expandvars(config['GIT_USER'])
        git_branch = git_remote = os.path.expandvars(config['GIT_BRANCH_NAME'])
        git_dir_parent = os.path.dirname(git_dir)

        cell_id = data['cell_id']
        cell_content = data['cell_content']
        output = data['output']
        git_parent = data['git_parent']

        # git_file_path = f'{git_dir}/{cell_id}'

        # get current directory (to return later)
        cwd = os.getcwd()
        if not state.repo:
            # error
            print('state.repo is None')
        repo = state.repo

        try:
            os.chdir(git_dir)
            code_path = f'{cell_id}_code'
            out_path = f'{cell_id}_out'
            with open(code_path, 'w') as f:
                f.write(cell_content)
            with open(out_path,'w') as f:
                f.write(output)
            # checkout parent
            repo.git.checkout(git_parent)
            repo.git.add([code_path, out_path])
            msg = f'updated {cell_id}'
            repo.git.commit(a=False, m=msg)
            success = True
        except GitCommandError as e:
            success = False
            msg = f'commit {cell_id} failed, err: {e}'
        
        self.write({
            'status': success,
            'msg': msg
        })
        
        
            