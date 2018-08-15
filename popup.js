//does the action for the popup

'use strict';

let createPlaylist = document.getElementById('setlistCreation');
var id = 0;
//gets current url and parses it to get SetlistID
var query = {active: true, currentWindow: true };
function callback(tabs) {
	var arr = tabs[0].url.split("-");
	id = arr[arr.length-1].split(".")[0];
}
chrome.tabs.query(query, callback);

createPlaylist.onclick = function(element) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", "https://api.setlist.fm/rest/1.0/setlist/" + id, true);
	xmlHttp.setRequestHeader("x-api-key", config.SETLISTFM_API_KEY);
	xmlHttp.setRequestHeader("Accept", "application/json");
	xmlHttp.onload = function (e) {
		if(xmlHttp.readyState === 4) {
			if (xmlHttp.status === 200){
				// console.log(this.responseText)
				var responseJSON = JSON.parse(this.responseText);
				var artist = (responseJSON["artist"] ? responseJSON["artist"]["name"] : "")
				var tour = (responseJSON["tour"] ? responseJSON["tour"]["name"] : "")
				//set processing
				var set = responseJSON["sets"]["set"][0]["song"]
				if(responseJSON["sets"]["set"].length > 1){
					for(var i = 1; i < responseJSON["sets"]["set"].length; i++){
						responseJSON["sets"]["set"][i]["song"].forEach(function(element){
							set.push(element)
						})
					}
				}
				console.log(JSON.stringify(set))
				// console.log(set)

				//end set processing
				chrome.storage.sync.set({["Artist_name"]: artist}, function(){
					chrome.storage.sync.set({["Tour_name"]: tour}, function(){
						chrome.storage.sync.set({["Set"]: set}, function(){
							spotify_api.login(false, spotify_api.reqRefreshToken());
						})
					})
				})

			}
		}
	}
	xmlHttp.send(null);
}
