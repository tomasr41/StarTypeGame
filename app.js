const $time = document.querySelector('time');
const $paragraph = document.querySelector('p'); // $ = Elem del dom
const $input = document.querySelector('input');
const $game = document.querySelector('#game')
const $results = document.querySelector('#results')
const $wpm = $results.querySelector('#results-wpm')
const $accuracy = $results.querySelector('#results-accuracy')
const $button = document.querySelector('#reload-button')

const TIEMPO_INICIAL = 30;
let TEXT = ["It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil galactic empire.",
            "During the battle, Rebel spies managed to steal secret plans to the Empire's ultimate weapon, the DEATH STAR, an armored space station with enough power to destroy an entire planet.",
            "Pursued by the sinister agents of the Emperor, Princess Leia flees aboard her ship, guarding the stolen plans that can save her people and restore freedom to the galaxy."]


let words = [];
let tiempoActual = TIEMPO_INICIAL;
let playing;


initGame()
initEvents()

function initGame() {
  $game.style.display = 'flex'
  $results.style.display = 'none'
  $input.value = ''
  
  const randomIndex = Math.floor(Math.random() * TEXT.length);    // cada vez que damos reload al juego tocara aleatoriamente cualquiera de los 3 textos.

  
  playing = false;

  words = TEXT[randomIndex].split(' ')  // cargamos en el array "words" cada palabra del texto como elemento.
  tiempoActual = TIEMPO_INICIAL;  //Inicializamos el tiempo
    
    
    
  $time.textContent = tiempoActual ;
    
    $paragraph.innerHTML = words.map((word, index) => {
        const letters = word.split('')                                                  // agarra el array words y lo transforma en una cadena de texto que representa elementos HTML con la funcion map. Cada palabra del array se convierte en un elemento HTML <word>, y cada letra de cada palabra se envuelve en un elemento HTML <letter>. 
  
        return `<word>                                                  
          ${letters
            .map(letter => `<letter>${letter}</letter>`)
            .join('')
          }
        </word>
        `
      }).join('')

      const $firstWord= $paragraph.querySelector('word');
      $firstWord.classList.add('active');
      $firstWord.querySelector('letter').classList.add('active');   // capturamos la primer palabra y letra otorgandole la clase active (con CSS marcamos la letra con color para el usuario)

    
}


function initEvents() {
  document.addEventListener('keydown', () => {
    $input.focus()
    if (!playing) {
      playing = true
      const intervalid = setInterval(() => {
        tiempoActual--;
        $time.textContent = tiempoActual;
        if (tiempoActual === 0) {
          clearInterval(intervalid);
          gameOver();
        }
      }, 1000);
    }
  })
  $input.addEventListener('keydown', onKeyDown)
  $input.addEventListener('keyup', onKeyUp)
  $button.addEventListener('click', initGame)

}

function onKeyDown(event) {
  const $currentWord = $paragraph.querySelector('word.active')
  const $currentLetter = $currentWord.querySelector('letter.active')

  const { key } = event
  if (key === ' ') {           //CASO ESPACIO
    event.preventDefault() //Por defecto utiliza el espacio en el input, con esta linea lo capturamos y evitamos que no se pueda.

    const $nextWord = $currentWord.nextElementSibling //capturamos la siguiente palabra
    const $nextLetter = $nextWord.querySelector('letter') //capturamos la siguiente letra

    $currentWord.classList.remove('active', 'marked')
    $currentLetter.classList.remove('active')   // limpiamos clases

    $nextWord.classList.add('active')    //pasamos a capturar la siguiente palabra 
    $nextLetter.classList.add('active')  //por consiguiente, la siguiente letra

    $input.value = ''   // reset de input cada vez que pasemos a la siguiente palabra

    const hasMissedLetters = $currentWord                     // si faltan letras en la palabra que dejamos atras con el espacio
      .querySelectorAll('letter:not(.correct)').length > 0      

    const classToAdd = hasMissedLetters ? 'marked' : 'correct'  // quedan marcadas las letras restantes y con CSS lo mostramos en rojo.
    $currentWord.classList.add(classToAdd)

    return
  }

  if (key === 'Backspace') {                              // CASO RETROCESO 
    const $prevWord = $currentWord.previousElementSibling
    const $prevLetter = $currentLetter.previousElementSibling  //Al contrario del espacio, capturamos la palabra y letra anterior (son elementos )

    if (!$prevWord && !$prevLetter) {             // si no tenemos palabra y letra anterior
      event.preventDefault()                      // evitamos error en tal caso
      return
    }

    const $wordMarked = $paragraph.querySelector('word.marked')    // capturamos palabra marcada (class marked)
    if ($wordMarked && !$prevLetter) {    
      event.preventDefault()
      $prevWord.classList.remove('marked')  // Sacamos la marca a esa palabra
      $prevWord.classList.add('active')  //La activamos

      const $letterToGo = $prevWord.querySelector('letter:last-child') //Inicializamos el letterToGo con la ultima letra de la palabra anterior

      $currentLetter.classList.remove('active')      
      $letterToGo.classList.add('active')

      $input.value = [                                                     // con [] transformamos el querySelectorAll en array, para poder usar la funcion map. Por defecto, el querySelectorAll es una Nodelist
        ...$prevWord.querySelectorAll('letter.correct, letter.incorrect')  
      ].map($el => {
        return $el.classList.contains('correct') ? $el.innerText : '*'        
      })
        .join('')
    }
  }
}

function onKeyUp() {
  // recuperamos los elementos actuals
  const $currentWord = $paragraph.querySelector('word.active')
  const $currentLetter = $currentWord.querySelector('letter.active')       

  const currentWord = $currentWord.innerText.trim()
  $input.maxLength = currentWord.length

  const $allLetters = $currentWord.querySelectorAll('letter')               

  $allLetters.forEach($letter => $letter.classList.remove('correct', 'incorrect'))            // limpiamos los valores de la clase para volver a iterar

  $input.value.split('').forEach((char, index) => {
    const $letter = $allLetters[index]
    const letterToCheck = currentWord[index]

    const isCorrect = char === letterToCheck
    const letterClass = isCorrect ? 'correct' : 'incorrect'
    $letter.classList.add(letterClass)
  })

  $currentLetter.classList.remove('active', 'is-last')   // deja de estar activa la palabra  y limpiamos is last
  const inputLength = $input.value.length                
  const $nextActiveLetter = $allLetters[inputLength]  //

  if ($nextActiveLetter) {
    $nextActiveLetter.classList.add('active')
  } else {
    $currentLetter.classList.add('active', 'is-last')
    
  }
}



function gameOver(){
  $game.style.display = 'none'
    $results.style.display = 'flex'

    const correctWords = $paragraph.querySelectorAll('word.correct').length
    const correctLetter = $paragraph.querySelectorAll('letter.correct').length
    const incorrectLetter = $paragraph.querySelectorAll('letter.incorrect').length  

    const totalLetters = correctLetter + incorrectLetter 

    const accuracy = totalLetters > 0
      ? (correctLetter / totalLetters) * 100     // calcula la exactitud del usuario durante el juego
      : 0

    const wpm = correctWords * 60 / TIEMPO_INICIAL   // regla de 3 para calcular palabras por minuto
    $wpm.textContent = wpm
    $accuracy.textContent = `${accuracy.toFixed(2)}%`
}