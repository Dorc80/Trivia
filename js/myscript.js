let questionsDiv = document.querySelectorAll('.question');
let isBlocked = false;
let score = 0;

for (var i = 0; i < questionsDiv.length; i++) {

    // Agrega listener al question area
    questionsDiv[i].addEventListener('click', function () {

        if (this.classList.contains('gray') && !isBlocked) {

            // agrega preguntas
            this.classList.remove('gray');
            let idx = this.id.substring(this.id.length, this.id.length - 1);
            this.innerHTML = getQuestionHtml(idx)
            isBlocked = true;

            let radios = document.querySelectorAll('#idx' + idx + ' input[type=radio]');

            // comprueba respuesta de radio button
            for (var i = 0; i < radios.length; i++) {
                radios[i].addEventListener('click', function () {
                    let radioidx = this.value.split('-')[1];
                    let radio_answer = this.value.split('-')[0]
                    let correct_answer = questions['idx' + radioidx];
                    let questionDiv = document.querySelector('#idx' + radioidx);

                    if (radio_answer === correct_answer) {

                        if (radioidx == 0 || radioidx == 3 || radioidx == 6) {
                            score += 100;
                            questionDiv.innerHTML = getScoreHtml(100);
                        } else if (radioidx == 1 || radioidx == 4 || radioidx == 7) {
                            questionDiv.innerHTML = getScoreHtml(200);
                            score += 200;
                        } else {
                            questionDiv.innerHTML = getScoreHtml(300);
                            score += 300;
                        }

                        document.querySelector('#score').innerText = score + ' points';

                    } else {
                        questionDiv.innerHTML = getErrorQuestionHtml(radioidx, radio_answer);
                    }

                    isBlocked = false;

                })
            }

        }

    });

}

function getQuestionHtml(idx) {

    let questionapi = questions.questions[idx];

    let questionHtml = `<div>
    <span class="column center">${questionapi.question}</span>
    <div>`

    for (var i = 0; i < questionapi.incorrect_answers.length; i++) {
        questionHtml += `<div><input type="radio" name="entertaiment1" value="${questionapi.incorrect_answers[i]}-${idx}">${questionapi.incorrect_answers[i]}</div>`;
    }

    questionHtml += `</div>
    </div>`;



    return questionHtml;

}

function getErrorQuestionHtml(idx, error_answer) {

    let questionapi = questions.questions[idx];

    let correct_answer = questions['idx' + idx];

    let questionHtml = `<div>
    <span class="column center">${questionapi.question}</span>
    <div>`

    for (var i = 0; i < questionapi.incorrect_answers.length; i++) {
        questionHtml += `<div ${questionapi.incorrect_answers[i] == correct_answer ? 'class="green"' : questionapi.incorrect_answers[i] == error_answer ? 'class="red"' : ''}>
            <input type="radio" name="entertaiment1" value="${questionapi.incorrect_answers[i]}-${idx}" disabled>${questionapi.incorrect_answers[i]}
        </div>`
    }

    questionHtml += `<div class="color-red"><h3>Respuesta incorrecta</h3><div>
    </div>
    </div>`;



    return questionHtml;

}

function getScoreHtml(score) {

    let questionHtml = `<div class="puntaje">
        <h1>${score}</1>
    </div>`;

    return questionHtml;

}

class Questions {
    questions = [];
}

let questions = new Questions();

/* 
** difficulty: easy/medium/hard
** category:    15: Games
**              11: Film
**              27: Animals
**/
async function callOpentdb(category, difficulty) {

    try {
        let responseStream = await fetch(`https://opentdb.com/api.php?amount=1&category=${category}&difficulty=${difficulty}&type=multiple`);
        let response = await responseStream.json();
        let res = response.results[0];
        res.incorrect_answers.push(res.correct_answer);
        res.incorrect_answers.sort((a, b) => 0.5 - Math.random());
        return res;
    } catch (error) {
        console.log(error);
    }

}

async function getQuestions() {

    let question = await callOpentdb(15, 'easy');
    questions.questions.push(question);
    questions['idx' + 0] = question.correct_answer;

    question = await callOpentdb(15, 'medium');
    questions.questions.push(question);
    questions['idx' + 1] = question.correct_answer;

    question = await callOpentdb(15, 'hard');
    questions.questions.push(question);
    questions['idx' + 2] = question.correct_answer;

    question = await callOpentdb(11, 'easy');
    questions.questions.push(question);
    questions['idx' + 3] = question.correct_answer;

    question = await callOpentdb(11, 'medium');
    questions.questions.push(question);
    questions['idx' + 4] = question.correct_answer;

    question = await callOpentdb(11, 'hard');
    questions.questions.push(question);
    questions['idx' + 5] = question.correct_answer;

    question = await callOpentdb(27, 'easy');
    questions.questions.push(question);
    questions['idx' + 6] = question.correct_answer;

    question = await callOpentdb(27, 'medium');
    questions.questions.push(question);
    questions['idx' + 7] = question.correct_answer;

    question = await callOpentdb(27, 'hard');
    questions.questions.push(question);
    questions['idx' + 8] = question.correct_answer;

    document.querySelector('#cargando-container').classList.add('display-none');
    document.querySelector('#trivia-container').classList.remove('display-none');

}

function resetGame() {

    questions = new Questions();

    document.querySelector('#cargando-container').classList.remove('display-none');

    for(var i = 0; i < 9; i++) {
        let element = document.querySelector('#idx'+i);
        element.classList.add('gray');
        if(element.children.length > 0) {
            element.children[0].remove();
        }
    }

    document.querySelector('#trivia-container').classList.add('display-none');



    getQuestions()

}

document.querySelector('#continue').addEventListener('click', function() {
    resetGame();
});

getQuestions();