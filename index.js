
const createbtn = document.querySelector('.btn-create')
const main = document.querySelector(".main")
const input_todo = document.querySelector('.input_todo')
const input_edit = document.querySelector('.input_edit')
const btn_cancel = document.querySelector('.btn-cancelEdit')
const search_input = document.getElementById("search-input")
const filtro = document.getElementById("filter")
const btn_edit = document.querySelector('.btn-edit')


var oldtitle;
var todotitle;

const LocalData = () => {
    let localdata = JSON.parse(localStorage.getItem('todos')) || []
    return localdata
}

const getDate = () =>{
    let data = new Date()
    let dia = data.getDate()
    let mes = data.getMonth() + 1
    let ano = data.getFullYear()

    let spanData = document.querySelector("#filter_data")
    spanData.innerText = mes < 10 ? `0${mes}-${ano}` : `${mes}-${ano}`
    
    return mes < 10 ? `${dia}-0${mes}-${ano}` : `${dia}-${mes}-${ano}`
}

const createtodo = ({title,done = 0,data}) =>{
    let div = document.createElement('div')
    div.setAttribute('class','todo')

    let article = document.createElement('article')
    article.setAttribute('class','todo_info')

    let article2 = `<article class="val-rem hidden">
    <p>tem certeza que deseja excluir?</p>
    <button class="remove-db">sim</button>
    <button class="cancel-rem">nao</button>
    </article>`

    
    let spandate = document.createElement('span')
    spandate.setAttribute('class','todo_date')
    spandate.innerText = data || getDate();

    let titulo = document.createElement('h4')
    titulo.setAttribute('class','todo_title')
    titulo.setAttribute('title',title)
    titulo.innerText = title;

    let donebtn = document.createElement('button')
    donebtn.setAttribute('class','done')
    donebtn.innerHTML = '<i class="fa-solid fa-check"></i>'

    let removebtn = document.createElement('button')
    removebtn.setAttribute('class','remove')
    removebtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    
    let editbtn = document.createElement('button')
    editbtn.setAttribute('class','edit')
    editbtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    
    article.appendChild(titulo)
    article.appendChild(donebtn)
    article.appendChild(removebtn)
    article.appendChild(editbtn)

    div.appendChild(spandate)
    div.innerHTML = div.innerHTML + article2
    div.appendChild(article)

    main.appendChild(div)

    if(done){
        div.classList.add('done')
    }
    return
}


const toggleForms = ()=>{
    const forms = document.querySelectorAll("form")
    forms.forEach(element => {
        element.classList.toggle("hide")
    });
}

createbtn.addEventListener('click',(e)=>{
    e.preventDefault();
    let value = input_todo.value;
    let isRepeated = repeatedTodo(value);
    if(!value){
        window.alert('o campo esta vazio!')
        input_todo.focus()
        return
    }
    if(isRepeated){
        window.alert('todo ja existe!')
        input_todo.value = ""
        input_todo.focus()
        return
    }

    createtodo({title:value});
    setLocalStorage(value)
    input_todo.value = ""
    input_todo.focus()
})


document.addEventListener('click', (e)=>{
    e.preventDefault();
    let target = e.target;
    let div = target.closest('div')

    
    if(div && div.querySelector('h4')){
        todotitle = div.querySelector('h4').innerText;
    }

    if(target.classList.contains('done')){
        div.classList.toggle('done')
        updatelocalstatus(todotitle)
    }

    if(target.classList.contains("edit")){
        toggleForms();
        oldtitle = todotitle
        input_edit.value = oldtitle;
        input_edit.focus()
    }

    if(target.classList.contains("remove")){
        div.querySelectorAll('article').forEach(item=> item.classList.toggle('hidden'))
    }
    
    if(target.classList.contains("remove-db")){
        div.remove()
        deleteLocalStor(todotitle)
        div.querySelectorAll('article').forEach(item=> item.classList.toggle('hidden'))
    }

    if(target.classList.contains("cancel-rem")){
        div.querySelectorAll('article').forEach(item=> item.classList.toggle('hidden'))
    }

    if(target.classList.contains('backspace')){
        search_input.value = ""
        search_input.focus()
    }
})

btn_cancel.addEventListener('click', ()=>{
    toggleForms();
})

btn_edit.addEventListener('click',()=>{
    let newtitle = input_edit.value
    let isRepeated = repeatedTodo(newtitle)
    if(!newtitle){
        window.alert('campo vazio!')
        return
    }
    if(isRepeated){
        window.alert('ja existe essa tarefa!')
        input_edit.value = ""
        input_edit.focus()
        return 
    }

    updateLocalStorage(newtitle,oldtitle)
    toggleForms()
    window.location.reload(true)
})

filtro.addEventListener('change',(e)=>{
    let value = e.target.value
    filter(value)
})

search_input.addEventListener('keyup',(e)=>{
    let value = e.target.value;
    searchMonitorar(value)
})

// ### funcões relacionadas ao data base ####

const setLocalStorage = (title) => {
    let todos = LocalData()
    let item = {title: title , done: 0, data: getDate()}
    todos.push(item);
    localStorage.setItem('todos',JSON.stringify(todos))
}

const updateLocalStorage = (newtitle, oldtitle)=>{
    let todos = LocalData()

    let newtodos = todos.map(todo =>{
        if(todo.title === oldtitle){
            todo.title = newtitle
        }
        return todo
    })
    localStorage.setItem('todos',JSON.stringify(newtodos))
    
}
const updatelocalstatus = (text) => {
    let todos = LocalData()
    let newtodos = todos.map(item => {
        if(item.title === text){
            item.done = !item.done
        }
        return item
    })
    localStorage.setItem('todos',JSON.stringify(newtodos))
}


const deleteLocalStor = (titulo) =>{
    let lista = LocalData()
    let newlist = lista.filter((item) => item.title != titulo)
    localStorage.setItem('todos',JSON.stringify(newlist))
}

// #######################################################################

const filter = (value)=>{
    let todos = document.querySelectorAll(".todo")
    if(value === 'done'){
        todos.forEach(todo =>{
            if(todo.classList.contains(value)){
                todo.style.display = 'flex'
            }
            else{
                todo.style.display = 'none'
            }
        })  
    }

    if(value === 'all'){
        window.location.reload(true)
    }

}

const searchMonitorar = (value)=>{
    let todos = document.querySelectorAll('.todo')
    
    todos.forEach(todo=>{
        let h4 = todo.querySelector('h4').innerText

        h4.includes(value) ? todo.style.display = 'flex' : todo.style.display = 'none'
    })
}

const repeatedTodo = (title) =>{
   let todos = LocalData()
   let isRepeated = todos.some(todo => todo.title === title)
   return isRepeated;
}

// ###################### funçoes para filtrar todos #######################

let getdata = new Date()
let x = getdata.getMonth()

const preMonth = ()=> {
    x--
    let data = new Date(2022,x)
    let mes = data.getMonth() + 1;
    let ano = data.getFullYear()
    let text = mes < 10 ? `0${mes}-${ano}` : `${mes}-${ano}`

    let spanData = document.querySelector("#filter_data")
    spanData.innerText = mes < 10 ? `0${mes}-${ano}` : `${mes}-${ano}`

    filterByMonth(text)
}
const nextMonth = ()=> {
    x++
    let data = new Date(2022,x)
    let mes = data.getMonth() + 1
    let ano = data.getFullYear()
    let text = mes < 10 ? `0${mes}-${ano}` : `${mes}-${ano}` 

    let spanData = document.querySelector("#filter_data")
    spanData.innerText = mes < 10 ? `0${mes}-${ano}` : `${mes}-${ano}`
    filterByMonth(text)
}

const filterByMonth  = (string) => {
    let dados = LocalData()
    let arrayfilter = dados.filter(item => {
        if(item.data.includes(string)){
          return item
        }
    })

    let todos = document.querySelectorAll(".todo")
    todos.forEach(todo=>{
        todo.remove()
    })

    arrayfilter.forEach(item => {
        createtodo(item)
    })
}


const loadtodos = ()=>{
    let todos = LocalData()

    todos.map(todo=>{
        createtodo(todo)
    })

    getDate()
}
loadtodos()




