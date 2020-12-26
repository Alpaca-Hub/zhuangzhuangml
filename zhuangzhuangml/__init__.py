# from zhuangzhuangml.api.register_handler import setup_handlers
from .handlers import setup_handlers
# Jupyter Extension points
def _jupyter_server_extension_paths():
    return [{
        'module': 'zhuangzhuangml',
    }]

def _jupyter_nbextension_paths():
    return [{
        "section": "notebook",
        "dest": "zhuangzhuangml",
        "src": "static",
        "require": "zhuangzhuangml/main"
    }]

def load_jupyter_server_extension(nbapp):
    setup_handlers(nbapp.web_app)
