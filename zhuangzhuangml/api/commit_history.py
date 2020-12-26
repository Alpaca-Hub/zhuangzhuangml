from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import IPythonHandler
import os, json, git, urllib, requests
from git import Repo, GitCommandError
from subprocess import check_output
import subprocess
from zhuangzhuangml.api import state
import json 

class GetCommitHistoryHandler(IPythonHandler):
    def put(self):
        print('handling cell/get_commit_history')
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
        num_records = data['num_records']
        DEFAULT_HIST_NUM_RECORDS = 5
        if num_records == None:
            num_records = DEFAULT_HIST_NUM_RECORDS

        # get current directory (to return later)
        cwd = os.getcwd()
        if not state.repo:
            # error
            print('state.repo is None')
        repo = state.repo

        history = []
        try:
            os.chdir(git_dir)
            code_path = f'{cell_id}_code'
            out_path = f'{cell_id}_out'
            code_commits = list(repo.iter_commits("master", max_count=num_records))
            out_commits = list(repo.iter_commits("master", max_count=num_records))
            if len(code_commits) != len(out_commits):
                print('len(code_commits) != len(out_commits)')
            for code_c, out_c in zip(code_commits, out_commits):
                code_hash = code_c.hexsha
                out_hash = out_c.hexsha
                datetime = code_c.committed_datetime
                
                print(code_hash, out_hash)
                code = repo.git.show(f'{code_hash}:{code_path}')
                out = repo.git.show(f'{out_hash}:{out_path}')
                history.append((code_hash,code,out))

            msg = f'got {cell_id} commit history'
            success = True
        except GitCommandError as e:
            success = False
            msg = f'get {cell_id} commit history failed, err: {e}'
                
        self.write({
            'status': success,
            'msg': msg,
            'commit_hist': history
        })
        
        
            