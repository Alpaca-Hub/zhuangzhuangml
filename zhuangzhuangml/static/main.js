define(['base/js/namespace',
        'base/js/dialog',
        'jquery'],
        function(IPython, dialog, $){

    var git_commit_push  = {
        help: 'Commit current notebook and push to GitHub',
        icon : 'fa-github',
        help_index : '',
        handler : function (env) {
            console.log(env);

        }
    }


    function init_set_bind() {
        let overlays = $(".out_prompt_overlay");
        for (let i = 0; i < overlays.length; i++) {
            let overlay = overlays[i];
            overlay = $(overlay);
            console.log(overlays);
            overlay.attr("index", i);
            overlay.click(function (){
                let json = IPython.notebook.toJSON();
                console.log(`Getting content of cell ${i}`);
                console.log(json.cells[i]);
                console.log(json.cells[i].source);
                console.log(json.cells[i].outputs.map((item)=>item.text).join(""));
            });
        }
    }

    function _on_load(){

        // log to console
        console.info('Loaded Jupyter extension: zhuangzhuangml')

        init_set_bind();

        // register new action
        var action_name = IPython.keyboard_manager.actions.register(git_commit_push, 'commit-push', 'jupyter-git')

        // add button for new action
        IPython.toolbar.add_buttons_group([action_name])

    }

    return {load_ipython_extension: _on_load };
})
