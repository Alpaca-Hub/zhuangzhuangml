define(['base/js/namespace',
        'base/js/dialog',
        'jquery'],
        function(IPython, dialog, $, mc){

    var git_commit_push  = {
        help: 'Commit current notebook and push to GitHub',
        icon : 'fa-github',
        help_index : '',
        handler : function (env) {
            console.log(env);

        }
    }

    function _on_load(){

        // log to console
        console.info('Loaded Jupyter extension: zhuangzhuangml')

        // register new action
        var action_name = IPython.keyboard_manager.actions.register(git_commit_push, 'commit-push', 'jupyter-git')

        // add button for new action
        IPython.toolbar.add_buttons_group([action_name])

    }

    return {load_ipython_extension: _on_load };
})
