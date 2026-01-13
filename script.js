const state= {
    text : "here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.",
    index: 0,
    startTime : null,
    finished : false,
    errors : 0
}

let typingArea = document.getElementById('textArea');
let charOfSpans = [];
const test_time_in_seconds = 15;
let timerID = null;

function renderText(){
    charOfSpans = [];

    const newFragment = document.createDocumentFragment();
    for (const char of state.text){
        // console.log("letter you needed was: ", char);
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'baseColor';
        charOfSpans.push(span);
        newFragment.appendChild(span);
        
    }

    typingArea.replaceChildren(newFragment);
    // typingArea.appendChild(newFragment);
}

renderText();
console.log(state.index);
let timeEl = document.getElementById('time');
let test_time_duration = 15;

function startTimer(){
    timerID = setInterval(() => {
        let time_elapsed_in_milisec = Date.now() - state.startTime;
        let time_elapsed_in_sec = Math.floor(time_elapsed_in_milisec/1000);
        if (time_elapsed_in_sec >= test_time_in_seconds){
            finishTest();
    }
        timeEl.textContent = ` ${test_time_duration - time_elapsed_in_sec}s`;
        console.log("time elapsed: ",time_elapsed_in_sec);
    }, 1000);
    
    // console.log("timerrrrrr", timer);

}

function finishTest(){
        if (state.finished) return;

        state.finished = true;
        typingArea.classList.add('dimAll');
        stopTimer();
        stats();
        console.log("stop test!!! and stop the timer");

}
function stopTimer(){
        clearInterval(timerID);
        timerID = null;
}

function stats(){
    let correctLetters = state.index - state.errors;
    console.log("corrctly typed",correctLetters);

    let time_elapsedMsec = Date.now() - state.startTime;
    let time_elapsedMin= time_elapsedMsec/60000;

    if (time_elapsedMin >0){
        let wpm = Math.round((correctLetters / 5)/ (time_elapsedMin));
        console.log("wpm is>>>>>>>>>>>", wpm);
        let wpmEl = document.getElementById('wpm');
        wpmEl.textContent = `WPM : ${wpm}`;
        let accuracy = Math.round((correctLetters / state.index)*100);
        let accuracyEL = document.getElementById('accuracy');
        accuracyEL.textContent = `Accuracy : ${accuracy}%`;
        console.log("Accuracy>>>>",accuracy, state.errors);
    }
    
    
}
function handleKeyDown(j,t){
    let expectedLetter = state.text[state.index];
    let typed_letter = j.key;

    let span = charOfSpans[state.index];

    

    if (state.startTime === null){
        const t = Date.now();
        state.startTime = t;
        console.log(t,state.startTime);
        startTimer();
        
    }

    if(typed_letter === 'Backspace'){
        if (state.index > 0){
            state.index--;
            span = charOfSpans[state.index];
            console.log(span, "you are backspacing!!!!!");
            if (span.classList.contains('incorrect')){
                state.errors--;
            };

            span.classList.remove('correct', 'incorrect');
            updateStatus();


        }
        j.preventDefault();
        return;
        
    }
    if(state.finished) return;

    if(typed_letter === expectedLetter){
        span.classList.replace('baseColor','correct');
        
        console.log("from match", state.index);

        console.log("its a match:)",typed_letter,expectedLetter);
        console.log("from match", state.index);
    }
    else{
        span.classList.replace('baseColor','incorrect');
        console.log("not a match!!!", typed_letter, expectedLetter);
        console.log("from not match",state.index);
        state.errors++;
        console.log("errors......", state.errors);
    }
    // console.log("key expected: ",expectedLetter)
    // console.log("key you pressed: ", j.key);
    state.index++;

    updateStatus();
}

function reset(){
    state.index = 0,
    state.startTime = null,
    state.finished = false,
    state.errors = 0,
    timeEl.textContent = test_time_duration + 's';
    wpmEl.textContent = "";
    accuracyEL.textContent = "";


    stopTimer();
    renderText();
    updateStatus();
    typingArea.focus();


}

function updateStatus(){
    charOfSpans.forEach(n => n.classList.remove('current'));
    if (charOfSpans[state.index]){
        charOfSpans[state.index].classList.add('current');
    }
}
typingArea.addEventListener('keydown', (e,s) => handleKeyDown(e,s));
let reSet = document.getElementById('reset');
reSet.addEventListener('click', reset);
typingArea.focus();


