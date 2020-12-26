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

    function get_cell_history(uuid){
        fetch('/cell/get_commit_history',{
            method: 'POST',
            body: JSON.stringify({
                jupyter_uuid: "test",
                cell_id: uuid
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })    
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
        .then((data) => {
            // Work with JSON data here
            console.log(data);
            return data;
        })
        .catch((err) => {
            // network error, log in console
            console.log(err);
        })
    }

    function commit_cell(uuid,data){
        fetch('/cell/commit',{
            method: 'POST',
            body: JSON.stringify({
                jupyter_uuid: "test",
                cell_id: uuid,
                cell_content: string,
                output: string,
                git_parent: string
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })    
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
        .catch((err) => {
            // network error, log in console
            console.log(err);
        })
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
        let st = `
        .TimelineItem:before {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 47px;
            display: block;
            width: 2px;
            content: "";
            background-color: rgb(234, 236, 239);
        }
        .TimelineItem-badge {
            position: relative;
            z-index: 1;

            width: 32px;
            margin-right: 8px;
            margin-left: 35px;
            align-items: center;
            /* background-color: #ffffff; */
            justify-content: center;
            flex-shrink: 0;

            height: 16px;
            margin-top: 8px;
            margin-bottom: 8px;
            border: 0;
        }
        .TimelineItem-body {
            min-width: 0;
            max-width: 100%;
            margin-top: -33px;
            margin-left: 65px;
            color: #444d56;
        }
        .text-normal {
            font-weight: 400!important;
        }
        
        .f5 {
            font-size: 14px!important;
        }
        `;
        $("<style></style>").appendTo("head").html(st);
    }

    function update_set_bind() {
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
                    let title = "This is title.";

                    input.prepend(`<div class="hist">
                        <div class="TimelineItem TimelineItem--condensed pt-0 pb-2">
                            <div class="TimelineItem-badge">
                            <svg class="octicon octicon-git-commit" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"></path></svg>
                            </div>
                            <div class="TimelineItem-body">
                                <h2 class="f5 text-normal">${title}</h2>
                            </div>
                        </div>
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
        update_set_bind();
        $("button").click(()=>{
            update_set_bind();
        });
        
        // register new action
        var action_name = IPython.keyboard_manager.actions.register(commit, 'commit-push', 'jupyter-git')
        // add button for new action
        IPython.toolbar.add_buttons_group([action_name])


    }

    return {load_ipython_extension: _on_load };
})
