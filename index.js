let allTask = JSON.parse(localStorage.getItem('tasks')) || [];
let inputText = '';
let input = null;

window.onload =  init = ()  => {
  input = document.getElementById('input-text');
  input.addEventListener('change', updateValue);  
  localStorage.setItem('tasks', JSON.stringify(allTask));
  render();  
}

const onClickButton = () => {
  allTask.push( {
    text: inputText,
    isCheck: false
  });

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
  localStorage.setItem('tasks', JSON.stringify(allTask)); 
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
    const delImg = document.createElement('img');
    delImg.className = 'icons';
    delImg.src = 'img/delete.png'
    container.appendChild(delImg);
    delImg.onclick = function() {deleteElem(index);} 
    if (checkbox.checked === true) {      
      container.removeChild(editImg);
    }  
  })
}

const onChangeCheckBox = (index) => {
  allTask[index].isCheck = !allTask[index].isCheck; 
  localStorage.setItem('tasks', JSON.stringify(allTask)); 
  render();
}

const deleteElem = (index) => {
  allTask.splice(index, 1)
  localStorage.setItem('tasks', JSON.stringify(allTask));  
  render();
}

const editText = (index, container, item) => {    //стирает весь контейнер при редактировании. 
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }

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
cancelImg.onclick = () => {cancelVal();}
const okImg = document.createElement('img');
okImg.src = 'img/okey.png';
okImg.className = 'icons';
okImg.onclick = () => {changeValue(index);}
container.appendChild(okImg);
}
const changeValue = (index) => {
  const temp = document.getElementById(`input-${index}`)
  allTask[index].text = temp.value;
  localStorage.setItem('tasks', JSON.stringify(allTask));  
  render();
}

const cancelVal = () => {
  render();
}

const deleteAllTasks = () => { 
  allTask = [];
  localStorage.clear()
  render();  
}
