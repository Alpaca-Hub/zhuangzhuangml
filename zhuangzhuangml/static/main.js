define(['base/js/namespace',
        'base/js/dialog',
        'jquery'],
        function(IPython, dialog, $){

    function get_code_output(i) {
        // i is the cell index
        let json = IPython.notebook.toJSON();
        return {
            "cell": json.cells[i],
            "code": json.cells[i].source,
            "output": json.cells[i].outputs.map((item)=>item.text).join("")
        };
    }

    function init_set_bind() {
        //select the code cell for addition of the function
        let cells = $(".cell");
        for(let i = 0; i < cells.length; i++){
            let cell = cells[i];
            cell = $(cell);
            cell.prepend("<div><button class = \"git-btn\"></button></div>");
        }
        let buttons = $(".git-btn");
        for(let i = 0; i < buttons.length;i++){
            let btn = buttons[i];
            btn = $(btn);
            $(btn).html('<i class = "fa-git fa"></i>');
        }
        for(let i=0; i < buttons.length; i++){
            let btn = buttons[i];
            btn = $(btn);
            btn.attr("index", i);
            btn.click(() => {console.log(get_code_output(i));});
        }
    }

    function _on_load(){

        // log to console
        console.info('Loaded Jupyter extension: zhuangzhuangml');

        init_set_bind();

        // register new action
        var action_name = IPython.keyboard_manager.actions.register(git_commit_push, 'commit-push', 'jupyter-git')

        // add button for new action
        IPython.toolbar.add_buttons_group([action_name])

    }

    return {load_ipython_extension: _on_load };
})
