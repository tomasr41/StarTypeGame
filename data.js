export const words = [
    "hola",
    "tomas",
    "como",
    "va",
    "loco",


//"Press Start 2P", system-ui, monospace;
//function onKeyUp(){
  //recupera elementos actuales seleccionados
  const $currentWord = $paragraph.querySelector('x-word.active');  //  palabra activa
  const $currentLetter = $currentWord.querySelector('x-letter.active') //  letra activa
  
  const currentWord = $currentWord.innerText.trim();
  $input.maxLength = currentWord.length;
  const $allLetters = $currentWord.querySelectorAll('x-letter');
  $input.value.split('').forEach((char,index) => {
  const $letter = $allLetters[index];
  const letterToCheck = currentWord[index];

  const isCorrect = char === letterToCheck;
  const letterClass = iscorrect ? 'correct' : 'incorrect';
  $letter.classList.add(letterClass);

})
]
    
