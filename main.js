//  check

const circles = document.querySelectorAll(".circle")

circles.forEach(circle=> {
    circle.addEventListener("click", ()=> {
        circle.classList.toggle("done")
    })
})

// ====================================
const input = document.querySelector("input");

const tasksDiv = document.querySelector(".tasks")

let myArray = [];

if (window.localStorage.getItem("array")) {
    myArray = JSON.parse(window.localStorage.getItem("array"))
}
data_of_LS()
addCount()

document.addEventListener("keydown", (e)=> {
    if (e.key == 'Enter') {
        if (input.value != "") {
            addToArray(input.value);
            input.value = ""
        }

    }
})

function addToArray(taskTxt) {
    let task = {
        id: Date.now(),
        content: taskTxt,
        complated: false
    }

    myArray.push(task)
    addToTasks(myArray)
    
    addToLs(myArray)
}


function addToTasks(myarray) {
    tasksDiv.innerHTML = '';
    myarray.forEach(task=> {
        const container = document.createElement("li");
        container.className = "task"
        container.draggable = true
        container.setAttribute("data-id", task.id)
        const round = document.createElement("div");
        round.className = 'round';
        

        const span = document.createElement("span");
        span.className = 'text';
        span.appendChild(document.createTextNode(task.content))

        const icon = document.createElement("i");
        icon.className = 'icon ri-close-large-line';
                
            if (task.complated) {
                container.className = "task done"
                round.innerHTML = `<input type="checkbox" class="check" id="check" checked/>
            <label for="check"></label>`;
            } else {
                round.innerHTML = `<input type="checkbox" class="check" id="check" />
            <label for="check"></label>`;
            }
       
        container.appendChild(round)
        container.appendChild(span)
        container.appendChild(icon)
        tasksDiv.appendChild(container)
       
    })
    
}

function addToLs(myarray) {
    let string = JSON.stringify(myarray);
    window.localStorage.setItem("array", string);

    addCount()
}

function data_of_LS() {
    let data = window.localStorage.getItem("array");
    if (data) {
        let tasks = JSON.parse(data);
        addToTasks(tasks)
    }

}

function taskClick() {
     // task click

    }
    const tasks = document.querySelectorAll(".task")

    if (tasks) {

        tasks.forEach(task=> {
            task.addEventListener("click", ()=> {
               task.classList.toggle("done")
               const check = task.querySelector("#check");
               if (check.checked) {
                   check.checked = false
               } else {
                   check.checked = true
               }
               toggleStatus(task.getAttribute("data-id"))
               
           })
           })
    }
    
    
// taskClick()

function toggleStatus(taskId) {
    myArray.forEach(task=> {
        if (task.id == taskId) {
            task.complated === false ? task.complated = true : task.complated = false;
        }
    
    })
    addToLs(myArray)
}

tasksDiv.addEventListener("click", (e)=> {
    if (e.target.classList.contains("icon")) {
        deletetasks(e.target.parentElement.getAttribute("data-id"));
        e.target.parentElement.remove()
    } 
})

function deletetasks(taskId) {
    myArray = myArray.filter(task=> task.id != taskId)
    addToLs(myArray)
}

function addCount() {
    const num = document.querySelector(".num")
    let count = 0
    myArray.forEach(task=> {
        if (!task.complated) {
            count++
        }
    })
    
    num.innerHTML = count
}

const filters = document.querySelectorAll("footer .filter button")
filters.forEach(e=> {
    e.addEventListener('click', ()=> {
        filters.forEach(el=> {
            el.classList.remove("selected")
        })
        e.classList.add("selected")
    })
})

function filter(select) {
    tasksDiv.innerHTML = ''
    if (select == 'all') {
        addToTasks(myArray)
    }
    if (select == 'active') {
        const items = [];
        myArray.forEach(task=> {
            if (!task.complated) {
                items.push(task)
            }
        })
        addToTasks(items)
    }
    if (select == 'completed') {
        const items = [];
        myArray.forEach(task=> {
            if (task.complated) {
                items.push(task)
            }
        })
        addToTasks(items)
    }
}

document.querySelector(".clear").addEventListener("click", clear)

function clear() {
    tasksDiv.innerHTML = ''
    myArray = []
    addToLs(myArray)
}

// drag & drop
const draggables = document.querySelectorAll(".task")

let draggingId ;
draggables.forEach(draggable => {
    draggable.addEventListener("dragstart", ()=> {
        draggable.classList.add("dragging")
        draggingId = draggable.getAttribute("data-id")
    })
    draggable.addEventListener("dragend", ()=> {
        draggable.classList.remove("dragging")
    })
})

tasksDiv.addEventListener('dragover', (e)=> {
    e.preventDefault()
    
    const afterElement = getAfterElement(tasksDiv, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == -Infinity) {
        tasksDiv.appendChild(draggable)
    }else {
        tasksDiv.insertBefore(draggable, afterElement)
    }
    const childrenArr = Array.from(tasksDiv.children)
    let new_position = childrenArr.findIndex(value=> value.getAttribute('data-id') == draggingId)
    let taskPosition = myArray.findIndex(value=> value.id == draggingId);
    array_move(myArray, taskPosition, new_position)

})



function getAfterElement(container, y) {
    const draggable = [...container.querySelectorAll(".task:not(.dragging)")];

    return draggable.reduce((closest, child)=> {
        const box = child.getBoundingClientRect()
        const offset = y- box.top - box.height / 2;

        if (offset < 0 && offset > closest) {
            return child
        } else {
            return closest
        }

    },Number.NEGATIVE_INFINITY)
}

function array_move(arr, old_index, new_index, taskId) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    addToLs(myArray)
};

// toggle theme

const toggleBtn = document.querySelector(".toggle-theme")
const body = document.querySelector("body")

toggleBtn.addEventListener("click", ()=> {
    body.classList.toggle("dark")
    
    if (body.classList.contains('dark')) {
        toggleBtn.querySelector('img').src = './images/icon-sun.svg'
    } else {
        toggleBtn.querySelector('img').src = './images/icon-moon.svg'
    }
})