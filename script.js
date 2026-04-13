let positiveWords = new Set();
let negativeWords = new Set();


// load senticnet dictionary
fetch("senticnet.txt")
.then(r => r.text())
.then(data => {

 let lines = data.split("\n");

 lines.forEach(line => {

  let parts =
   line.trim().split(/\s+/);

  if(parts.length >= 2){

   let polarity = parts[0];

   let word =
    parts[1].toLowerCase();

   if(polarity==="positive")
    positiveWords.add(word);

   if(polarity==="negative")
    negativeWords.add(word);

  }

 });

 console.log("dictionary loaded");

});




// sentiment logic
function analyzeSentiment(text){

 let words =
  text.toLowerCase().split(/\W+/);

 let pos = 0;
 let neg = 0;

 words.forEach(w=>{

  if(positiveWords.has(w)) pos++;

  if(negativeWords.has(w)) neg++;

 });

 let sentiment = "neutral";

 if(pos>neg) sentiment="positive";

 else if(neg>pos) sentiment="negative";

 return {
  sentiment,
  pos,
  neg
 };

}




// update UI
function showResult(r){

 const card =
  document.querySelector(".result-card");

 const label =
  document.querySelector(".verdict-label");

 const score =
  document.querySelector(".verdict-score");

 const confidenceFill =
  document.querySelector(".confidence-fill");

 const confidencePct =
  document.querySelector(".confidence-pct");



 card.classList.remove("hidden");

 card.classList.add("revealed");



 label.textContent =
  r.sentiment.toUpperCase();



 score.textContent =
  "Positive: "+r.pos+
  " | Negative: "+r.neg;



 let total = r.pos+r.neg;

 let confidence =
  total===0
  ?0
  :Math.round(
   Math.max(r.pos,r.neg)
   /total*100
  );



 confidenceFill.style.width =
  confidence+"%";

 confidencePct.textContent =
  confidence+"%";



 document.body.classList.remove(
  "state-positive",
  "state-negative"
 );



 card.classList.remove(
  "card-positive",
  "card-negative",
  "card-neutral"
 );



 if(r.sentiment==="positive"){

  document.body.classList.add(
   "state-positive"
  );

  card.classList.add(
   "card-positive"
  );

 }

 else if(r.sentiment==="negative"){

  document.body.classList.add(
   "state-negative"
  );

  card.classList.add(
   "card-negative"
  );

 }

 else{

  card.classList.add(
   "card-neutral"
  );

 }

}




document.addEventListener(
"DOMContentLoaded",

()=>{

 const btn =
  document.querySelector(
   ".btn-primary"
  );

 const textarea =
  document.querySelector(
   ".text-area"
  );



 btn.addEventListener(
  "click",

 ()=>{

  let result =
   analyzeSentiment(
    textarea.value
   );

  showResult(result);

 });

});
