from notebook.utils import url_path_join as ujoin
from zhuangzhuangml.api.commit_cell import CommitCellHandler
from zhuangzhuangml.api.repo_init import RepoInitHandler
from zhuangzhuangml.api.commit_history import GetCommitHistoryHandler

def add_handler(nbapp, path, handler):
    print('base_url', nbapp.settings['base_url'])
    route_pattern = ujoin(nbapp.settings['base_url'], path)
    nbapp.add_handlers('.*', [(route_pattern, handler)])

def setup_handlers(nbapp):
    add_handler(nbapp, '/repo/init', RepoInitHandler)
    add_handler(nbapp, '/cell/commit', CommitCellHandler)
    add_handler(nbapp, '/cell/get_commit_history', GetCommitHistoryHandler)
    print('handlers setup done')