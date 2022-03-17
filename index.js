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
  let result = await resp.json();
  allTask = result.data;
  render();  
};

const onClickButton = async () => {
  allTask.push( {
    text: inputText,
    isCheck: false    
  });
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
  inputText = '';
  input.value = '';  
  render()
} 

const updateValue =  (event) => {
  inputText = event.target.value;  
}

const render = () => {  
  const content = document.getElementById('content');

  while(content.firstChild) {                       //избегает повторяющегося элемента
    content.removeChild(content.firstChild);
  }
  
  allTask.sort(elem => elem.isCheck ?  1 : -1)  
  allTask.map((item, index) => {
    const { isCheck, text, _id } = item    
    const container = document.createElement('div');
    container.id = `task-${index}`;    
    container.className = 'container-task';
    content.appendChild(container);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';    
    checkbox.checked = isCheck;
    checkbox.className = 'checkbox';
    checkbox.onchange =  () => {
      onChangeCheckBox(index);
    };   
    container.appendChild(checkbox); 
    const textValue = document.createElement('p');    
    textValue.innerText = text;
    textValue.className = isCheck ? 'done-task' : 'text-task';
    textValue.id = `text-${index}`;    
    container.appendChild(textValue); 
    const editImg = document.createElement('img');
    editImg.className = 'icons';  
    editImg.src = 'img/edit.png';
    container.appendChild(editImg);
    editImg.onclick = () => {
      editText(index, container, item, _id);
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

const onChangeCheckBox = (index) => {
  allTask[index].isCheck = !allTask[index].isCheck;   
  render();
};

const deleteTask = async (index) => {  
  allTask.splice(index, 1);  
  const resp = await fetch(`${url}/deleteTask/?_id=${index}`, {
    method: 'DELETE', 
  });        
  render();
};

const editText = (index, container, item, id) => {    //стирает весь контейнер при редактировании. 
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  };

  const input = document.createElement('input');
  input.type = 'text';
  input.value = item.text;
  input.id = `input-${index}`;  
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
  saveImg.onclick = () => changeValue(index, id);
  container.appendChild(saveImg);
}

const changeValue = async(index, item) => {
  const temp = document.getElementById(`input-${index}`);      
  allTask[index].text = temp.value;
  console.log(allTask[index].text);     
  const resp = await fetch(`${url}/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',        
    }, body: JSON.stringify( {
      _id: item,            
      text: temp.value,                
    })    
  }); 
  render();
}

const cancel = () => {
  render();
}

const deleteAllTasks = () => { 
  allTask = [];
  localStorage.clear();
  render();  
}
