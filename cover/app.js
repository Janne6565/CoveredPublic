var vue = new Vue({
    el: '#app',
    data() {
        return {
            userData: {
                UserName: "",
                UserEmail: "",
                SteamId: "",
                UserPassword: "",
                UserAuth: "",
            },
            page: 0,
            coverRightNow: {
                AuthorId: "",
                CoverId: "",
                DifferentAuthor: "",
                GameId: "",
                Path: "",
                Style: "",
                Type: "",
            },
        }
    },
    methods: {
        getCoversFromGame(gameId, onlyLibrary, recall) {
            let xml = new XMLHttpRequest()
            xml.open("GET", "https://projektejwkk.com/Covered/API/get/coversFromGame.php?gameId=" + gameId + "&only600900=" + onlyLibrary)
            xml.send()
            xml.onload = function() {
                recall(JSON.parse(this.response)["Message"])
            }
        },
        checkUserLogin(recall) {
            if (this.getCookie("UserId") != "" && this.getCookie("UserAuth") != "") {
                let xml = new XMLHttpRequest() 
                xml.open("GET", this.echoParams("https://projektejwkk.com/Covered/API/get/userDetails.php", {
                    userId: this.getCookie("UserId"),
                    userAuth: this.getCookie("UserAuth"),
                }))
                xml.send() 
                let self = this
                xml.onload = function() {
                    let jsonResponse = JSON.parse(this.response)["Message"]
                    console.log(jsonResponse)
                    if (jsonResponse["Code"] == "200") {
                        jsonResponse["loggedIn"] = true
                    } else {
                        jsonResponse["loggedIn"] = false
                    }
                    recall(jsonResponse)
                }
            }
        },
        loadRecommended() {
            let self = this
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/discover/covers.php", {
                userId: userId, 
                userAuth: userAuth,
                only600900: "1"
            }))
            xml.send() 
            xml.onload = function() {
                let jsonResponse = JSON.parse(this.response)
                let covers = jsonResponse["Message"]
                self.coverRightNow = covers[0]
            }
        },
        addCoverToList(coverId, gameId) {
            let self = this
            
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth

            let xml = new XMLHttpRequest() 
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/add/toList.php", {
                userId: userId,
                userAuth: userAuth,
                coverId: coverId,
                gameId: gameId
            }))
            xml.send() 
            xml.onload = function() {
                self.loadRecommended()
            }
        },
        removeCover(coverId) {
            let self = this
            
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth

            let xml = new XMLHttpRequest() 
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/add/coverToDisliked.php", {
                userId: userId,
                userAuth: userAuth,
                coverId: coverId,
            }))
            xml.send() 
            xml.onload = function() {
                self.loadRecommended()
            }
        },
        removeGame(gameId) {
            let self = this
            
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth

            let xml = new XMLHttpRequest() 
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/add/gameToNotShown.php", {
                userId: userId,
                userAuth: userAuth,
                gameId: gameId,
            }))
            xml.send() 
            xml.onload = function() {
                self.loadRecommended()
            }
        },
        saveCover(coverId) {
            let self = this
            
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth

            let xml = new XMLHttpRequest() 
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/add/coverToLiked.php", {
                userId: userId,
                userAuth: userAuth,
                coverId: coverId,
            }))
            xml.send() 
            xml.onload = function() {
                self.loadRecommended()
            }
        },
        getCurrentCoverFromGame(gameId, recall) {
            let self = this
            let userId = self.userData.UserId
            let userAuth = self.userData.UserAuth
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/get/equipedCover.php", {
                userId: userId, 
                userAuth: userAuth,
                gameId: gameId
            }))
            xml.send()
            xml.onload = function() {
                recall(JSON.parse(this.response))
            }
        },
        registerUser() {
            if (!this.isErrorInRegister) {
                let self = this
                let xml = new XMLHttpRequest()
                xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/create/user.php", self.userData))
                xml.send()
                xml.onload = function() {
                    let jsonResponse = JSON.parse(this.response)
                    if (jsonResponse["Code"] == "200") {
                        let userData = jsonResponse["Message"]
                        self.userInfos = userData
                        self.setCookies()
                    }
                }
            }
        },
        checkUsername() {
            let self = this
            let xml = new XMLHttpRequest()
            xml.open("GET", self.echoParams("https://projektejwkk.com/Covered/API/search/existsUserWithUsername.php", self.userData))
            xml.send()
            xml.onload = function () {
                let jsonResponse = JSON.parse(this.response)
                console.log(jsonResponse)
                self.isErrorInRegister = (jsonResponse.Code == 201) 
            }
        },
        changeActiveCover() {
            if (document.readyState === 'complete') {
                let covers = document.getElementsByClassName("covers")[0]
                let coversList = covers.getElementsByClassName("oneCover")
                console.log(coversList[this.activeCover])
                coversList[this.activeCover].classList.toggle("activeCover")
                this.activeCover += 1
                if (this.activeCover >= this.listCovers.length) {
                    this.activeCover = 0
                }
                coversList[this.activeCover].classList.toggle("activeCover")
                return true;
            } else {
                console.log("Not loaded yet")
                return false;
            }
        },
        initiateActiveCover() {
            if (document.readyState === 'complete') {
                let covers = document.getElementsByClassName("covers")[0]
                let coversList = covers.getElementsByClassName("oneCover")
                coversList[0].classList.toggle("activeCover")
                return true;
            } else {
                return false;
            }
        },
        echoParams(url, data) {
            var string = url + "?";
            for (key in data) {
                string += key + "=" + data[key] + "&";
            }
            string += "_=" + Date.now()
            return string;
        },
        setCookies() {
            if (this.userInfos.UserId != "" && this.userInfos.UserAuth != "") {
                this.setCookie("UserId", this.userInfos.UserId, 30)
                this.setCookie("UserAuth", this.userInfos.UserAuth, 30)
            } else {
                console.log("Not Logged in")
            }
        },

        getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
                c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
              }
            }
            return "";
          },
          setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
          },
          getCover(coverId) {
            let self = this
            let xml = new XMLHttpRequest()
            xml.open("GET", "https://projektejwkk.com/Covered/API/get/cover.php?coverId=" + coverId)
            xml.send() 
            xml.onload = function() {
                let jsonResponse = JSON.parse(this.response)
                self.coverRightNow = jsonResponse["Message"]
            }
          },
    }, 
    created() {
        let self = this
        let coverId = window.location.href.split("#")[1]
        console.log(coverId)
        self.getCover(coverId)
    }
}); 