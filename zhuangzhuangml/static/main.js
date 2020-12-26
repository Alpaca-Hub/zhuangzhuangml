define(['base/js/namespace',
        'base/js/dialog',
        'jquery'],
        function(IPython, dialog, $){

    // we will define an action here that should happen when we ask to clear and restart the kernel.
    var commit  = {
        help: 'Commit current notebook cells',
        icon : 'fa-code-fork',
        help_index : '',
        handler : function (env) {
            console.log(env);
        }
    }

    function get_git_history(uuid){
        
    }

    function commit_cell(uuid,data){
        
    }

    //uuid v4 generator function
    function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => 
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

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

        $(".new-git").remove();
        let cells = $(".cell");
        for(let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            cell = $(cell);
            cell.prepend("<div class=\"new-git\"><button class = \"git-btn btn btn-default\"></button></div>");
        }
        for(let i = 0; i < cells.length; i++) {
            let cell = IPython.notebook.get_cell(i);
            if (cell.id === undefined) {
                var uuid = uuidv4();
                cell.metadata = {...cell.metadata, id: uuid};
            }
        }
        let buttons = $(".git-btn");
        for(let i = 0; i < buttons.length;i++) {
            let btn = buttons[i];
            btn = $(btn);
            $(btn).html('<i class = "fa-git fa"></i>');
        }
        for(let i=0; i < buttons.length; i++){
            let btn = buttons[i];
            btn = $(btn);
            btn.attr("index", i);
            btn.click(() => {
                let input = $(".input").eq(i);
                console.log(input);
                let h = input.find(".hist");
                if (h.length) {
                    h.remove();
                } else {
                    input.prepend(`<div class="hist">
                        Example <br />
                        Example <br />
                        Example
                    </div>`);
                }

                console.log(get_code_output(i));
            });
        }
    }

    function _on_load(){

        // log to console
        console.info('Loaded Jupyter extension: zhuangzhuangml');

        init_set_bind();
        $("button").click(()=>{
            init_set_bind();
        });
        
        // register new action
        var action_name = IPython.keyboard_manager.actions.register(commit, 'commit-push', 'jupyter-git')
        // add button for new action
        IPython.toolbar.add_buttons_group([action_name])


    }

    return {load_ipython_extension: _on_load };
})
