define(['base/js/namespace',
        'base/js/dialog',
        'jquery'],
        function(IPython, dialog, $){

    function get_code_output(i) {
        // i is the cell index
        let json = IPython.notebook.toJSON();
        console.log(json);
        let cell = IPython.notebook.get_cell(i);
        if (cell.id === undefined) {
            cell.metadata = {...cell.metadata, id: Math.floor(Math.random() * 10000000)};
        }

        console.log(json);
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
        for(let i = 0; i < cells.length; i++){
            let cell = cells[i];
            cell = $(cell);
            cell.prepend("<div class=\"new-git\"><button class = \"git-btn btn btn-default\"></button></div>");
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

    }

    return {load_ipython_extension: _on_load };
})
