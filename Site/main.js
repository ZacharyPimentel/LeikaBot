// Define configuration options
const opts = {
  identity: {
    username: "Leika_Bot",
    password: "oauth:sfhrcrttp4shcv0c9f9ku6e7glm2xj",
  },
  channels: [
    "chibileika",
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

//Global Variables
let numberInQueue = 0;
let singingQueue = [];
let upperCaseSingingQueue = [];
let queueOL = document.getElementById("queue"); //this is the ol people who join queue will be appended to
const animationDuration = 300;

//removes the person from current turn and updates the queue when finished button is clicked
$("#finished-song-btn").click(function(){
    singingQueue.shift();
    upperCaseSingingQueue.shift();
    numberInQueue = singingQueue.length;
    console.log(singingQueue);
    $("#current-turn-text").css("font-size","0em");
    setTimeout(function(){
      $("#current-turn-text").text("");
    },animationDuration);
    updateList();
  });

for(i=1;i<=4;i++){
  $(`#sona${i}`).volume = 0.1;
}

//allows admin to add users manually to the queue
function manualAddFunctionality(){
  $("#add-player-btn").click(function(event){
      event.preventDefault(); //stops page from reloading
      let manualAddText = $("#add-player-input").val();
      //if input field is not empty, add field content as a user in the queue
      if(manualAddText !== ""){
        createQueueMember(manualAddText); //create queue member
        singingQueue.push(manualAddText); //add new member to array
        upperCaseSingingQueue.push(manualAddText.toUpperCase()); //also add to uppercase array
        numberInQueue = singingQueue.length; //update number of people in queue
        $("#add-player-input").val(""); //empty the manual add box
      }
      updateList() //refresh the list
  });
}

//updates the queue list whenever a change is made
function updateList(){
  if(singingQueue.length >= 1){ //only update list if the singing queue array is not empty

    //will run the animation rightaway if the current turn box is empty
    //otherwise it will wait 0.5s for the animation to finish
    if($("#current-turn-text").text() == ""){
      $("#current-turn-text").text(singingQueue[0]);
      $("#current-turn-text").css("font-size","2em");
    }else{
      setTimeout(function(){
        $("#current-turn-text").text(singingQueue[0]);
        $("#current-turn-text").css("font-size","2em");
      },animationDuration);
    }

    $("#queue li").remove();
    //remake the queue excluding the person with current turn (starting from array[1])
    for(i=1;i<numberInQueue;i++){
      createQueueMember(singingQueue[i]);
    }
  }
}

//creates an li element for each person who joins the singing queue and appends to an ol
function createQueueMember (displayName){

  //creating elements and adding properties
  let queueLI = document.createElement("li");
  queueLI.innerHTML = displayName;
  queueLI.id = displayName;
  let queueRemoveBtn = document.createElement("button");
  queueRemoveBtn.innerHTML = "Remove";
  queueRemoveBtn.classList.add("remove-btn");

  //lets the admin change the order of the queue

  //move up button
  let queueMoveUpBtn = document.createElement("button");
  queueMoveUpBtn.innerHTML = "&uarr;";
  //When clicked, moves the li element up one on the list if not already at the top
  $(queueMoveUpBtn).click(function(){
    let $current = $(this).closest("li");
    let $previous = $current.prev("li");
    if($previous.length !==0){ //checks if li is already top most on the list
      //sliding animation
      $current.slideUp(animationDuration,function(){
        $(this).insertBefore($previous).slideDown(animationDuration);
      });

      // following few lines makes sure the array is updated with new positions when an up or down button is clicked
      let currentLI = $(this).parent()[0];
      let currentID = $(currentLI).attr('id')
     
      function hasCorrectID(element){ //used for findIndex
          return element == currentID;
      }
      //finds the index that the current li is located in the array and moves it up 1 in the array
      let properIndex = singingQueue.findIndex(hasCorrectID);
      singingQueue.move = function(from,to){
        this.splice(to,0,this.splice(from,1)[0]);
      }
      upperCaseSingingQueue.move = function(from,to){
        this.splice(to,0,this.splice(from,1)[0]);
      }

      upperCaseSingingQueue.move(properIndex,properIndex-1);
      singingQueue.move(properIndex,properIndex-1);
    }
  });
  //move down button
  let queueMoveDownBtn = document.createElement("button");
  queueMoveDownBtn.innerHTML = "&darr;";
  //When clicked, moves the li element up one on the list if not already at the top
  $(queueMoveDownBtn).click(function(){
    let $current = $(this).closest("li");
    let $previous = $current.next("li");
    if($previous.length !==0){ //checks if li is already top most on the list
      //sliding animation
      $current.slideUp(animationDuration,function(){
        $(this).insertAfter($previous).slideDown(animationDuration);
      });

      // following few lines makes sure the array is updated with new positions when an up or down button is clicked
      let currentLI = $(this).parent()[0];
      let currentID = $(currentLI).attr('id')
     
      function hasCorrectID(element){
          return element == currentID;

      }
      
      //finds the index that the current li is located in the array and moves it down 1 in the array
      let properIndex = singingQueue.findIndex(hasCorrectID);
      singingQueue.move = function(from,to){
        this.splice(to,0,this.splice(from,1)[0]);
      }
      upperCaseSingingQueue.move = function(from,to){
        this.splice(to,0,this.splice(from,1)[0]);
      }

      upperCaseSingingQueue.move(properIndex,properIndex-1);
      singingQueue.move(properIndex,properIndex+1);
    }
  });

  //adds functionality to the remove button on each queue member
  //removes the li element of that member and takes them out of the singingQueue array
  $(queueRemoveBtn).click(function(){
    $(queueLI).remove();
    singingQueue.splice(singingQueue.indexOf(displayName),1); //removes the username from the array
    upperCaseSingingQueue.splice(upperCaseSingingQueue.indexOf(displayName.toUpperCase),1);
  });

  //append the created queue member to the OL
  queueLI.append(queueRemoveBtn);
  queueLI.append(queueMoveUpBtn);
  queueLI.append(queueMoveDownBtn);
  queueOL.append(queueLI);
}

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  // console.log(`target = ${target}`);
  // console.log(`self = ${self}`);
  console.log(context);
  console.log(`message = ${msg}`);
  // Remove whitespace from chat message
  const commandName = msg.trim();

  //singing commands
  if (commandName === '!join') {
    //check if person is already in queue
    if(upperCaseSingingQueue.includes(context["display-name"].toUpperCase())){
      client.say(target, `Thanks for the enthousiasm, ${context["display-name"]}, but you're already in queue!`);
    }
    else{ //if person is not in queue, add them to queue
      
      singingQueue.push(context["display-name"]);
      upperCaseSingingQueue.push(context["display-name"].toUpperCase());
      numberInQueue = singingQueue.length;

      createQueueMember(context["display-name"]);
      updateList();
      
      //picks an appropriate message to send the user after joining queue
      if(numberInQueue-1 == 1){
        client.say(target, `Thanks for joining the queue, ${context["display-name"]}! There's 1 person ahead of you. Make sure you're here when it's your turn!`);
      }else if(numberInQueue-1 == 0){
        client.say(target, `Thanks for joining the queue, ${context["display-name"]}! You're next in line! Make sure you're here when it's your turn!`);
      }else{
        client.say(target, `Thanks for joining the queue, ${context["display-name"]}! There are ${numberInQueue - 1} people ahead of you. Make sure you're here when it's your turn!`);
      }
    }
    console.log(`Singing Queue: ${singingQueue}`);
    console.log(`Number in Queue: ${numberInQueue}`);
    
    let randomJoinSoundIndex = Math.floor(Math.random() * Math.floor(4));
    $(`#sona${randomJoinSoundIndex}`)[0].play();
      
      
  }else if(commandName === '!leave') {
    //if the person is in the queue, do this stuff
    if(upperCaseSingingQueue.includes(context["display-name"].toUpperCase())){

      if($("#current-turn-text").text().toUpperCase() == context["display-name"].toUpperCase()){
        //if the current turn text matches the user who called the leave command
        //remove the name from current turn, giving time for the animation
        $("#current-turn-text").css("font-size","0em");
        setTimeout(function(){
          $("#current-turn-text").text("");
        },animationDuration);
      }else{
        document.getElementById(context["display-name"]).remove(); //removes from webpage
      }

      client.say(target, `Sad to see you leave, ${context["display-name"]} UwU, I hope you join another time!`);

      singingQueue.splice(singingQueue.indexOf(`${context["display-name"]}`),1); //removes the username from the array
      upperCaseSingingQueue.splice(upperCaseSingingQueue.indexOf(`${context["display-name"].toUpperCase()}`),1);
      numberInQueue = singingQueue.length;
    }
    else{ //do this if they're not in queue
      client.say(target, `Nice try, ${context["display-name"]}, but you're not in the queue!`);
    }
      updateList(); 
  }   
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  manualAddFunctionality();
  const circle = document.getElementById("circle");
  const connectingText = document.getElementById("connecting_text");

  connectingText.innerHTML = `* Connected to ${addr}:${port}`;
  circle.style.backgroundColor = "green";

  console.log(`* Connected to ${addr}:${port}`);
}