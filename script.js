const socket= io('http://localhost:8000')
roomBtn= document.getElementById('room-btn');
roomValue= document.getElementById('room-value')
messageContainer= document.querySelector('.container2');
messageInput= document.querySelector('#input');
messageForm= document.getElementById('form')
record_btn= document.getElementById('btn45');
const append=(message, position, color)=>{
    const messagearea= document.createElement('div');
    const time= document.createElement('p');
    messagearea.innerHTML= message;
 
    a= new Date()
    b= a.toLocaleString('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true })
    const Time= b;
    time.innerHTML= Time;
    messagearea.classList.add('message')
    messagearea.classList.add(color)
    messagearea.classList.add(position)
    time.classList.add('para')
    time.classList.add(color)
    time.classList.add(position)
    messageContainer.append(messagearea)
    messagearea.append(time)
}
const appendusers=(message, position, color)=>{
    const messagearea= document.createElement('div');
    messagearea.innerHTML= message;
    messagearea.classList.add('for-sending-disconnection-of-users')
    messagearea.classList.add(color)
    messagearea.classList.add(position)
    messageContainer.append(messagearea)
}
messageForm.addEventListener('submit',(e)=>{
 e.preventDefault();
 const message= messageInput.value;
 const room= roomValue.value;

 if(message==''){
     return false;
 }else{
    append(`You: ${message}`, 'right', 'green')
    socket.emit('send-msg', message, room)
    messageInput.value='';
    pageScroll()
    audio = new Audio('tick.wav');
    audio.volume= 0.2;
    audio.play()
 }

})
let a = prompt("Enter Your Name");

socket.emit('new-user-joined', a);
socket.on('user-joined', name=>{
 appendusers(`${name} joined the chat`,'left', 'black')
})
socket.on('recieve', data=>{
    append(`${data.name}: ${data.message}`,'left')
})
socket.on('user-disconnected', name=>{
    appendusers(`${name} left the chat`, 'left', 'black')
})
function pageScroll() {
    window. scrollBy(0,100);
}
roomBtn.addEventListener('click',()=>{
    const room= roomValue.value;
    if (room===''){
        return false;
    }
    socket.emit('room-joined', room, message=>{
        appendusers(`${message}`,'left', 'black')
        pageScroll()
    });
})

document.addEventListener('keydown', e=>{
    if(e.target.matches('input')) return
        if(e.key==="c") socket.connect()
        if(e.key==="e") socket.disconnect()
 })

record_btn.addEventListener('click',()=>{
    let audio = new webkitSpeechRecognition();
    audio.lang='en-GB';
    audio.onresult= function(e){
        console.log(e)
        messageInput.value=e.results[0][0].transcript;
    }
    audio.start();
})
