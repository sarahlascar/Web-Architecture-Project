var apiKeyT = "515f772922097746c8f9d935bc4d8254";
var urlT ="https://api.themoviedb.org/3/movie/";

var form = document.querySelector("form");
var input = document.querySelector('input[type="text"]');
var resultT = document.querySelector(".tmdb-result");
var Erreur = document.querySelector(".erreur");
var body = document.querySelector("body");
var question=document.getElementById('la_question');
console.log(question.textContent);

//la listes des films 
var liste_films=["Inception"];

// Pour afficher le poste le nom ... de la personne faisant parti du film
function castResult(source, poster, name) {
      var resultItem = document.createElement("div");
      var nomPerson = document.createElement("h3");
      var img = document.createElement("img");
      nomPerson.innerHTML = name;
      img.src = poster;
      resultItem.appendChild(img);
      resultItem.appendChild(nomPerson);
      resultT.appendChild(resultItem);
      question.textContent = "Veuillez sélectionner le nom d'un film auquel il a participé"
}


//Pour afficher le poster du film, le titre... du film auquel a participe la personne
function filmResult(source, poster, name,release_year) {
      var resultItem1= document.createElement("div");
      var resultItem2 = document.createElement("div");
      var movieTitle = document.createElement("h3");
      var date = document.createElement("h4");
      var img = document.createElement("img");
      
      movieTitle.innerHTML = name;
      date.innerHTML=release_year;
      img.src = poster;
      resultItem1.appendChild(img);
      resultItem1.appendChild(date);
      resultItem2.appendChild(movieTitle);
      resultT.appendChild(resultItem1);
      resultT.appendChild(resultItem2);
      question.textContent ="Veuillez sélectionner le nom d'un acteur ou du directeur du film."
}

var searchTitle="Inception";
var searchactor;


//la fonction qui fait la recherche
function search(e) {
      var childNode = resultT.lastChild;
      var nombre_images=document.images.length;
      var i=0;
      Erreur.textContent="";
      var body = document.querySelector("body");
      e.preventDefault();
      if (nombre_images%2==1){
                searchactor = input.value;
                makeActorRequest(searchactor);
                liste_films.push(childNode.textContent);
                console.log("la liste des films "+ liste_films)}
      else{
                //on vérifie que le film n' pas deja ete cite
                var flag = 0;  // Initialement 0 - Introuvable
                for(var i=0; i<liste_films.length; i++) {
                      if(input.value.toLowerCase() === liste_films[i].toLowerCase()) {
                            flag = 1; }}
                if(flag==0){
                    searchactor=childNode.textContent;
                    searchTitle = input.value;
                    var searchFilm = input.value;
                    makeFilmRequest(searchTitle);}
                 else{
                   var err = document.createElement("h5");
                   err.innerHTML =  "Ce film a déjà été cité.";
                   Erreur.appendChild(err);
                   body.appendChild(Erreur);}
      }
        input.value = "";


}

//Pour voir si une personne fait parti du cast ou bien est le directeur du film ci dessus
//la premiere requete est pour trouver l'id du film la deuxieme pour voir la liste de ses acteurs ainsi que son directeur 
function makeActorRequest(searchactor) {
          var xhr1 = new XMLHttpRequest();
          var IDfilm;
          xhr1.open("GET","https://api.themoviedb.org/3/search/movie?api_key=" + apiKeyT + "&query=" + searchTitle, true);
          xhr1.responseType = 'json';
          console.log("xhr1 cest ici"+ xhr1)
          xhr1.onload = function() {
                  IDfilm= xhr1.response.results[0].id
                  console.log("mon objet CEST CAA "+IDfilm )
                  var i=0;
                  xhr = new XMLHttpRequest();
                  console.log("id est"+ IDfilm)
                  xhr.onload = function() {
                          var response = JSON.parse(this.responseText).cast;
                          var response2 = JSON.parse(this.responseText).crew;
                          var array3 = response.concat(response2);
                          var res=[]
                          for(let j = 0; j < response.length; j++){
                                    res.push(response[j].name)}
                          for(let j = 0; j < response2.length; j++){
                                    if(response2[j].job == 'Director'){
                                    res.push(response2[j].name)}}
   
                          var n=0
                          var k=0
                          array3.map(function(item) {
                          k+=1
                          n+=1
                          if(item.name.toLowerCase()==searchactor.toLowerCase() && i==0){
                                  console.log("item est trouveeee##########",item.name);
                                  i=1
                                  n=-10
                                  castResult("tmdb","https://image.tmdb.org/t/p/w300/" + item.profile_path, item.name );
                            /* body.appendChild(form2);*/} 
                          else{
                                  if( k==res.length+1 && k==n && i==0) {
                                           var err = document.createElement("h5");
                                           err.innerHTML =  "Mince il ne fait pas parti des personnes ayant travaillées sur ce film.";
                                           Erreur.appendChild(err);
                                           body.appendChild(Erreur);
}}});};
                  xhr.open("GET", urlT+IDfilm+"/credits?api_key=" + apiKeyT , true);
                  xhr.send();};
          xhr1.send();}


//pour voir si un film fait parti de la liste des films d'une personne 
//la premiere requete est pour trouver l'id de la personne la deuxieme pour voir la liste de ses films 
function makeFilmRequest(searchFilm) {
      var xhr1 = new XMLHttpRequest();
      var IDperson="";
      console.log("le film est " + searchFilm)
      xhr1.open("GET","https://api.themoviedb.org/3/search/person?api_key="+apiKeyT+"&query="+searchactor, true);
      xhr1.responseType = 'json';
      console.log("xhr1 cest ici"+ xhr1)
      xhr1.onload = function() {
              console.log("lerreur de mnt "+xhr1.response.results);
              IDperson= xhr1.response.results[0].id;
              console.log("mon objet CEST CAA "+IDperson )
              var i=0;
              xhr = new XMLHttpRequest();
              console.log("id de la personne est "+ IDperson)
              xhr.onload = function() {
                      var response = JSON.parse(this.responseText).cast;
                      var response2 = JSON.parse(this.responseText).crew;
                      var array3 = response.concat(response2);
                      var res=[]
                      for(let j = 0; j < response.length; j++){
                             res.push(response[j].original_title)}
                      for(let j = 0; j < response2.length; j++){
                             if(response2[j].job == 'Director'){
                                   res.push(response2[j].original_title) }}
                      var n=0
                      var k=0
                      array3.map(function(item) {
                              k+=1
                              n+=1
                              if(item.original_title.toLowerCase()==searchFilm.toLowerCase() && i==0){
                                      console.log("item est trouveeee##########",item.original_title);
                                      i=1
                                      n=-10
                                      filmResult("tmdb","https://image.tmdb.org/t/p/w300/" + item.poster_path,item.original_title,item.release_date );  }       
                               else{
                                      if( k==res.length+1 && k==n && i==0) {
                                           var err = document.createElement("h5");
                                           err.innerHTML =  "Mince il ne joue pas dans ce film";
                                           Erreur.appendChild(err);
                                           body.appendChild(Erreur);}
            }});};
              xhr.open("GET", "https://api.themoviedb.org/3/person/"+IDperson+"/movie_credits?api_key="+apiKeyT, true);
              xhr.send();};
      xhr1.send();
}


form.addEventListener("submit", search);