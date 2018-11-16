//app.js
//define tags by ids
var news_tag	= document.getElementById('news');
var search_tag	= document.getElementById('search');
//after the page is loaded do this function getNews();
document.addEventListener("DOMContentLoaded", function(event) {
	//get 'string' after origin of url and sub string 'slash' at first of string.
	var url_word = window.location.pathname.substring(1);
	if(url_word.length > 0){ //if not empty
		//return all news related to this string
		getNews(url_word);
		//set value of search input equel to this string and decode it
		search_tag.value = decodeURIComponent(url_word);
	}else{ //if empty
		//return news with defualt value of function getNews()
		getNews();
	}
});
document.addEventListener("click", function(event) { //after any click event 
	//console.log(event);
	var tagID = event.srcElement.id; //get tag id of element that clicked
	//check if tag name is img and have id attr. also
	if(event.srcElement.localName == 'img' && tagID != null && tagID != undefined && tagID != NaN){
		if(tagID.length > 6){
			//check vote images is clicked not other image within page
			if(tagID.substring(0,6) == 'upvote' || tagID.substring(0,6) == 'dnvote'){
				voting(tagID);
				//debugger;
			}
		}
	}
});
//after searc input field is keyup do the following ...
document.getElementById('search').addEventListener("keyup", function(event) {
	//if enter key is pressed during typing at search input field
	if (event.keyCode == 13) {
		//get search input value
    	var words = search_tag.value;
	    if(words.length > 0){ //if search input value is not empty
	    	//return all news related to search input value
	    	getNews(words);
	    	//update url of page with search query
	    	window.location.href = window.location.origin + "/" + words;
	    }else{ //if search input value is empty
	    	//return news with defualt value of function getNews()
	    	getNews();
	    	//update url of page without search query
	    	window.location.href = window.location.origin;
	    }
    }
});

function voting(tagID){
	var vote_id 	= tagID.substring(6); //get articale id
	var alt			= tagID.substring(0,6); //get action is upvote or downvote
	var title_art	= document.getElementById('title'+vote_id).innerHTML; //get articale title
	var time_art	= document.getElementById('time'+vote_id).innerHTML; //get artical time
	var vote_tag	= document.getElementById('votenum'+vote_id); //define vote number 'span' tag
	var _Key_		= title_art + time_art; //set key of localStorage
	var votenum		= 0; //set defualt value for vote number
	//check we have db for this artical. if no have make noe for it
	if(localStorage.getItem(_Key_) != undefined && localStorage.getItem(_Key_) != null && localStorage.getItem(_Key_) != NaN){
		var votenum = parseInt(localStorage.getItem(_Key_));
	}
	//check action is upvote or downvote for increasing or decreasing vote number
	if(alt == 'upvote'){ votenum++; }
	if(alt == 'dnvote'){ votenum--; }
	//update db for this articale 'vote number'
	localStorage.setItem(_Key_,votenum); 
	//append new value of vote number for vote_tag of target articale
	vote_tag.innerHTML = votenum; 
}
function getNews(searchWords='football'){
	//set new Date object.
	var date = new Date();
	//get response from newsapi.org
	fetch("https://newsapi.org/v2/everything?q="+searchWords+"&from="+date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+"&sortBy=publishedAt&apiKey=b60f15202abc40cf895fd1162f96752b")
	.then(function(response){ return response.json(); })
	.then(function(data){
		//console.log(data); 
		var news = "";//set variable for final UI
		var _id_ = 1; //set id for articale 'increasable'
		var art = data.articles.map(function(article){
			//localStorage key equal to author + publishedAt of article and it value equel to vote number
			//check if we set item for this articale previously, if not set item for it
			var key = article.title+article.publishedAt;
			if(localStorage.getItem(key) == undefined || localStorage.getItem(key) == null || localStorage.getItem(key) == NaN){
				localStorage.setItem(key,"0");
			}
			//try to searching on 'hello' words and see the errors 
			news = news + `
				<article>
					<div id="img">
						<img src="${article.urlToImage}" alt="rendom picture" onerror="this.onerror=null; this.src='${require("./asset/newspaper.png")}'">
					</div>
					<div id="text">
						<span id="title${_id_}">${article.title}</span>
						<span>${article.description}</span>
						<time id="time${_id_}" datetime="${article.publishedAt}">${article.publishedAt}</time>
					</div>
					<div >
                        <img src="${require('./asset/upvote.png')}" id="upvote${_id_}"><br>
                        <span id="votenum${_id_}">${localStorage.getItem(key)}</span><br>
                        <img src="${require('./asset/downvote.png')}" id="dnvote${_id_}">
                    </div>
				</article>`;
			_id_++;
		});
		//append news to main tag and see UI
		if(news.length == 0){ news = "<center><h1>No have news related to your query, try another query !!</hr></center>"; }
		news_tag.innerHTML = news;
	})
}