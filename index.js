let allTask = JSON.parse(localStorage.getItem('tasks')) || [];
let inputText = '';
let input = null;

 window.onload = init = async()  => {
  input = document.getElementById('input-text');
  input.addEventListener('change', updateValue);
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  }); 
  let result = await resp.json();
  allTask = result.data;
  render();  
}

const onClickButton = async () => {
  allTask.push( {
    text: inputText,
    isCheck: false    
  });
  const resp = await fetch('http://localhost:8000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }, body: JSON.stringify( {
       text: inputText,
       isCheck: false
    })
  }); 
  let result = await resp.json();
  console.log('result', result)
  allTask = result.data;  
  localStorage.setItem('tasks', JSON.stringify(allTask));
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
  
  allTask.sort(a => a.isCheck ?  1 : -1) 
  .map((item, index) => {
    const { isCheck, text } = item    
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
      editText(index, container, item);
    } 
    const deleteImg = document.createElement('img');
    deleteImg.className = 'icons';
    deleteImg.src = 'img/delete.png';
    container.appendChild(deleteImg);
    deleteImg.onclick = () =>  EraseTask(item.id); 
    if (checkbox.checked === true) {      
      container.removeChild(editImg);
    };  
  });
};

const onChangeCheckBox = (index) => {
  allTask[index].isCheck = !allTask[index].isCheck; 
  localStorage.setItem('tasks', JSON.stringify(allTask)); 
  render();
};

const EraseTask = async(index) => {
  allTask.splice(index, 1);
  const resp = await fetch(`http://localhost:8000/deleteTask/?id=${index}`, {
    method: 'DELETE', 
  });
  
  localStorage.setItem('tasks', JSON.stringify(allTask));  
  render();
};

const editText = (index, container, item) => {    //стирает весь контейнер при редактировании. 
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
  saveImg.onclick = () => changeValue(index, item.id);
  container.appendChild(saveImg);
}

const changeValue = async(index, item) => {                 //тут
  const temp = document.getElementById(`input-${index}`);
  allTask[index].text = temp.value;     
  const resp = await fetch(`http://localhost:8000/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',        
    }, body: JSON.stringify( {
      id: item,      
      text: temp.value,                
    })    
  });     
  const result = await resp.json();
  allTask = result.data;
  localStorage.setItem('tasks', JSON.stringify(allTask));  
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
