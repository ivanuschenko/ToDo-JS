let allTask = [];
let inputText = '';
let input = null;
const url = 'http://localhost:8000';

 window.onload = init = async()  => {
  input = document.getElementById('input-text');
  input.addEventListener('change', updateValue);
  const resp = await fetch(`${url}/allTasks`, {
    method: 'GET',  
  });  
  let response = await resp.json();   
  allTask = response;
  render();  
};

const onClickButton = async () => {  
  const resp = await fetch(`${url}/createTask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }, body: JSON.stringify({
       text: inputText,
       isCheck: false,             
    })
  });
  const response = await resp.json();
  allTask = response;
  inputText = '';
  input.value = '';  
  render();
} 

const updateValue =  (event) => {
  inputText = event.target.value;  
}

const render = () => {  
  const content = document.getElementById('content');

  while(content.firstChild) {                       //избегает повторяющегося элемента
    content.removeChild(content.firstChild);
  }
  
  allTask
    .sort(elem => elem.isCheck ?  1 : -1)  
    .map((item) => {
    const { isCheck, text, _id } = item;    
    const container = document.createElement('div');
    container.id = `task-${_id}`;         
    container.className = 'container-task';
    content.appendChild(container);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';    
    checkbox.checked = isCheck;
    checkbox.className = 'checkbox';
    checkbox.onchange =  () => {
      onChangeCheckBox(item);      
    };   
    container.appendChild(checkbox); 
    const textValue = document.createElement('p');    
    textValue.innerText = text;
    textValue.className = isCheck ? 'done-task' : 'text-task';
    textValue.id = `text-${_id}`;        
    container.appendChild(textValue); 
    const editImg = document.createElement('img');
    editImg.className = 'icons';  
    editImg.src = 'img/edit.png';
    container.appendChild(editImg);
    editImg.onclick = () => {
      editText(container, item);
    };
    const deleteImg = document.createElement('img');
    deleteImg.className = 'icons';
    deleteImg.src = 'img/delete.png';
    container.appendChild(deleteImg);     
    deleteImg.onclick = () =>  deleteTask(_id); 
    if (checkbox.checked === true) {      
      container.removeChild(editImg);
    };  
  });
};

const onChangeCheckBox = (item) => {  
  item.isCheck = !item.isCheck;   
  render();
};

const deleteTask = async (_id) => { 
  const resp = await fetch(`${url}/deleteTask/?_id=${_id}`, {
    method: 'DELETE', 
  });   
  const response = await resp.json();
  allTask = response;
  render();
};

const editText = (container, item) => {    //стирает весь контейнер при редактировании. 
  const {_id, text, isCheck} = item
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  };
  const input = document.createElement('input');
  input.type = 'text';
  input.value = text;
  input.id = `input-${_id}`;  
  input.className = 'text-input';
  container.appendChild(input);
  const cancelImg = document.createElement('img');
  cancelImg.src = 'img/decline.png';
  cancelImg.className = 'icons';
  container.appendChild(cancelImg);
  cancelImg.onclick = () => cancel();
  const saveImg = document.createElement('img');
  saveImg.src = 'img/okey.png';
  saveImg.className = 'icons';
  saveImg.onclick = () => changeValue(_id);
  container.appendChild(saveImg);
}

const changeValue = async (id) => {
  const temp = document.getElementById(`input-${id}`); 
  const resp = await fetch(`${url}/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',        
    }, body: JSON.stringify( {
      _id: id,            
      text: temp.value,                
    })    
  });
  const response = await resp.json(); 
  allTask = response;
  render();
}

const cancel = () => {
  render();
}

const deleteAllTasks = async () => { 
  allTask = [];
  const resp = await fetch(`${url}/deleteAll`, {
    method: 'DELETE', 
  });   
  render();  
}
